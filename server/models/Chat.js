const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled Chat",
    },
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