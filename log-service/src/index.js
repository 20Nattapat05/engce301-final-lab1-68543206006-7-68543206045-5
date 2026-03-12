const express = require("express");

const app = express();
app.use(express.json());

let logs = [];

/* GET LOGS */
app.get("/api/logs", (req, res) => {
    res.json({ logs });
});

/* RECEIVE LOG */
app.post("/api/logs", (req, res) => {

    const log = req.body;

    logs.push(log);

    console.log("log received", log);

    res.json({ status: "logged" });
});

app.listen(3003, () => {
    console.log("log service running on 3003");
});