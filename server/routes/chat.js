const express = require("express");
const axios = require("axios");
const Chat = require("../models/Chat");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

/* ------------------------ CLEANER FUNCTION ------------------------ */
const cleanText = (text = "") => {
  if (typeof text !== "string") return "⚠️ Invalid AI response.";
  return text
    .replace(/<s>|<\/s>|<\s*\/?\s*s\s*>/gi, "") // remove <s> tags
    .replace(/<[^>]*>/g, "")                    // remove any leftover HTML
    .replace(/\u0000|\u0001|\u0002|\u0003/g, "") // remove hidden chars
    .replace(/[^\S\r\n]+/g, " ")                // normalize spaces
    .replace(/\n{3,}/g, "\n\n")                 // limit blank lines
    .trim();
};

/* ------------------------ GROQ AI FUNCTION ------------------------ */
const getAIResponse = async (message) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile", // you can change to "mixtral-8x7b" if you prefer
        messages: [
          { role: "system", content: "You are a helpful and friendly assistant. Keep responses clean and simple." },
          { role: "user", content: message },
        ],
        max_tokens: 400,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let text = response.data?.choices?.[0]?.message?.content || "";
    text = cleanText(text);

    if (!text || text.length === 0) {
      text = "⚠️ The model did not return a valid response. Please try again.";
    }

    console.log("✅ Groq Cleaned AI Reply:", text);
    return text;
  } catch (err) {
    console.error("❌ Groq API Error:", err.response?.data || err.message);
    return "⚠️ Error fetching AI response. Try again later.";
  }
};

/* ------------------------ ROUTES ------------------------ */

// 🧠 Get all chats
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// 💬 Send message (new or existing chat)
router.post("/", auth, async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "A valid message is required." });
  }

  try {
    const aiReply = await getAIResponse(message);
    let chat;

    if (chatId) {
      // Update existing chat
      chat = await Chat.findOne({ _id: chatId, user: req.user._id });
      if (!chat) return res.status(404).json({ error: "Chat not found." });

      chat.messages.push({ role: "user", content: message });
      chat.messages.push({ role: "bot", content: aiReply });
      chat.updatedAt = new Date();
      await chat.save();
    } else {
      // Create new chat
      const title = message.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 40) || "New Chat";
      chat = await Chat.create({
        title,
        messages: [
          { role: "user", content: message },
          { role: "bot", content: aiReply },
        ],
        user: req.user._id,
      });
    }

    res.status(200).json({ reply: aiReply, chat });
  } catch (err) {
    console.error("❌ Chat save error:", err.message);
    res.status(500).json({ error: "Server error while saving chat." });
  }
});

// 🗑️ Delete chat
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted) return res.status(404).json({ error: "Chat not found." });
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ error: "Delete failed." });
  }
});

module.exports = router;
