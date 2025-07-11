const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth"); // ✅ new

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoute); // ✅ new

app.listen(5000, () => {
  console.log("🚀 Backend server is live at: http://localhost:5000");
});