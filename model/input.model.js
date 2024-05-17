const mongoose = require("mongoose");
const inputSchema = mongoose.Schema(
  {
    input_file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const input = mongoose.model("input_file", inputSchema);
module.exports = input;
