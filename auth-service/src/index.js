const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = "mysecret";

const users = [
  { username: "alice", password: "password" },
  { username: "bob", password: "password" },
  { username: "admin", password: "admin" }
];

/* RATE LIMIT STORAGE */
let attempts = {};

app.post("/login", (req, res) => {

  const ip = req.ip;

  const now = Date.now();

  if (!attempts[ip]) {
    attempts[ip] = [];
  }

  /* keep attempts within 1 minute */
  attempts[ip] = attempts[ip].filter(
    time => now - time < 60000
  );

  if (attempts[ip].length >= 5) {
    return res.status(429).json({
      error: "Too many login attempts"
    });
  }

  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {

    attempts[ip].push(now);

    return res.status(401).json({
      error: "Invalid credentials"
    });
  }

  const token = jwt.sign({ username }, SECRET, {
    expiresIn: "1h"
  });

  res.json({ token });

});

app.listen(3001, () => {
  console.log("auth service running");
});