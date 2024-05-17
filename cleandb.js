const express = require("express");
const router = express.Router();
const Output = require("./model/output.model.js");
const Input = require("./model/input.model.js");

router.delete("/cleandb", async (req, res) => {
  try {
    await Input.deleteMany({});
    await Output.deleteMany({});
    console.log("Documents deleted successfully.");
    res.status(200).send("Documents deleted successfully.");
  } catch (error) {
    // If there's an error, send error response
    console.error("Error while cleaning database:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
