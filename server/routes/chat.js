const express = require("express");
const router = express.Router();
const axios = require("axios");
const Chat = require("../models/Chat");
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Reusable function to get AI response
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

router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

router.post("/", async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Valid message is required." });
  }

  try {
    const aiResponse = await getAIResponse(message);

    if (chatId) {
      const chat = await Chat.findById(chatId);
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
      });

      await newChat.save();
      return res.status(200).json({ reply: aiResponse, chat: newChat });
    }
  } catch (err) {
    console.error("Chat save error:", err.response?.data || err.message);
    res.status(500).json({ error: "Server error." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;