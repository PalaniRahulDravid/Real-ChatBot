const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const chatRoute = require("./routes/chat");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoute);

app.listen(5000, () => {
  console.log("🚀 Backend server is live at: http://localhost:5000");
});
