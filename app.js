const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(express.json());

app.use("/auth", require("./src/routes/index.js"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
