const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();
app.use(express.json());

const SECRET = "mysecret";

let tasks = [];

/* JWT Middleware */
function verifyJWT(req, res, next) {

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = decoded;

        next();
    });
}

/* GET TASKS */
app.get("/api/tasks", verifyJWT, (req, res) => {
    res.json(tasks);
});

/* CREATE TASK */
app.post("/api/tasks", verifyJWT, async (req, res) => {

    const task = req.body;
    task.id = tasks.length + 1;

    tasks.push(task);

    try {
        await axios.post("http://log-service:3003/api/logs", {
            method: "POST",
            path: "/api/tasks"
        });
    } catch (err) {
        console.log("log service error");
    }

    res.status(201).json(task);
});

/* UPDATE TASK */
app.put("/api/tasks/:id", verifyJWT, async (req, res) => {

    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    task.title = req.body.title;

    try {
        await axios.post("http://log-service:3003/api/logs", {
            method: "PUT",
            path: `/api/tasks/${id}`
        });
    } catch (err) {
        console.log("log service error");
    }

    res.json({ status: "updated", task });
});

/* DELETE TASK */
app.delete("/api/tasks/:id", verifyJWT, async (req, res) => {

    const id = parseInt(req.params.id);

    tasks = tasks.filter(t => t.id !== id);

    try {
        await axios.post("http://log-service:3003/api/logs", {
            method: "DELETE",
            path: `/api/tasks/${id}`
        });
    } catch (err) {
        console.log("log service error");
    }

    res.json({ status: "deleted" });
});

app.listen(3002, () => {
    console.log("task service running on 3002");
});