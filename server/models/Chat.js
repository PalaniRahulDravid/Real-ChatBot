const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    messages: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);