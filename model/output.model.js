const mongoose = require("mongoose");
const outputSchema = mongoose.Schema(
  {
    output_file: {
      type: String,
      ref: "input_file",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const output = mongoose.model("output_file", outputSchema);
module.exports = output;
