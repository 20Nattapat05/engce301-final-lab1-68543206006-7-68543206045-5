const express = require("express");

const app = express();
app.use(express.json());

app.post("/api/logs", (req, res) => {
    console.log("log received");
    res.json({ status: "logged" });
});

app.get("/api/logs", (req, res) => {
    res.json({ logs: [] });
});

app.listen(3003, () => {
    console.log("log service running on 3003");
});