const express = require("express");
const router = express.Router();
const axios = require("axios");
const Chat = require("../models/Chat");
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Get all chats
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// Post new message or update existing chat
router.post("/", async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Valid message is required." });
  }

  try {
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

    const botReply =
      response.data?.choices?.[0]?.message?.content || "No response";

    let chat;

    if (chatId) {
      // Update existing chat
      chat = await Chat.findById(chatId);
      chat.messages.push({ role: "user", content: message });
      chat.messages.push({ role: "bot", content: botReply });
      await chat.save();

      res.status(200).json({ reply: botReply });
    } else {
      // Create new chat
      chat = new Chat({
        title: message.slice(0, 20) || "New Chat",
        messages: [
          { role: "user", content: message },
          { role: "bot", content: botReply },
        ],
      });

      await chat.save();

      res.status(200).json({ reply: botReply, chat }); // send new chat object
    }
  } catch (error) {
    console.error("❌ OpenRouter Error:", error.response?.data || error.message);
    res.status(500).json({ error: "OpenRouter API call failed." });
  }
});

// Delete a chat by ID
router.delete("/:id", async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
