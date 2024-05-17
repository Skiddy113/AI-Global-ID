const mongoose = require("mongoose");
const express = require("express");
const app = express();
const main = require("./main.js");
const cleandb = require("./cleandb.js");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/main", main);
app.use("/cleandb", cleandb);

// Connecting with MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:nodeAPI1@password.ybcklkj.mongodb.net/AI?retryWrites=true&w=majority&appName=Backend"
  )
  .then(() => {
    console.log("Connected to DB");
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`Running on port ${port}...`));
  })
  .catch((error) => {
    console.error("Connection Failed", error);
  });
