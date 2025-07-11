const express = require("express");
const router = express.Router();
const axios = require("axios");
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/authMiddleware");
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const getAIResponse = async (message) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data?.choices?.[0]?.message?.content || "No response";
};

// Get all chats for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Valid message is required." });
  }

  try {
    const aiResponse = await getAIResponse(message);

    if (chatId) {
      const chat = await Chat.findOne({ _id: chatId, user: req.user._id });
      if (!chat) return res.status(404).json({ error: "Chat not found." });

      chat.messages.push({ role: "user", content: message });
      chat.messages.push({ role: "bot", content: aiResponse });

      await chat.save();
      return res.status(200).json({ reply: aiResponse });
    } else {
      const cleanedTitle = message.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 30);

      const newChat = new Chat({
        title: cleanedTitle || "New Chat",
        messages: [
          { role: "user", content: message },
          { role: "bot", content: aiResponse },
        ],
        user: req.user._id,
      });

      await newChat.save();
      return res.status(200).json({ reply: aiResponse, chat: newChat });
    }
  } catch (err) {
    console.error("Chat save error:", err.response?.data || err.message);
    res.status(500).json({ error: "Server error." });
  }
});

// Delete chat
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted) return res.status(404).json({ error: "Chat not found." });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;