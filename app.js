const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

mongoose
  .connect(process.env.mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("MongoDB error: ", e));

app.use(express.json());

app.use("/auth", require("./src/routes/index.js"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
