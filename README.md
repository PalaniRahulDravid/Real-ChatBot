# 💬 AI Chatbot using React, Node.js, Express & MongoDB

This is a full-stack chatbot web application built using **React** (frontend), **Express.js** (backend), and **MongoDB Atlas** (database). It uses **OpenRouter API** for generating intelligent AI responses.

---

## 🚀 Features

- 🌐 Responsive web interface to chat with an AI assistant  
- ✨ Start new chats and view previous conversations  
- 💾 Chat history is saved in **MongoDB Atlas**  
- 🔁 Switch between chats and delete any chat  
- ⌨️ Typing indicator added for better UX  
- 🧠 AI integration via OpenRouter

---

## 📁 Project Structure

```
client/           # React Frontend
  └── components/
  └── pages/
server/           # Node.js Backend
  └── routes/
  └── models/
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/PalaniRahulDravid/Real-ChatBot.git
cd Real-ChatBot
```

### 2. Setup the backend (server)

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder with the following contents:

```env
MONGO_URI=your_mongodb_atlas_url
OPENROUTER_API_KEY=your_openrouter_api_key
```

Now run the backend server:

```bash
node index.js
```

It will run at: `http://localhost:5000`

---

### 3. Setup the frontend (client)

```bash
cd client
npm install
npm run dev
```

It will run at: `http://localhost:5173`

---

## 🧠 How to Use

1. Open the app in browser: `http://localhost:5173`  
2. Type your question in the input field  
3. The chatbot will reply using AI (via OpenRouter API)  
4. Start a new chat any time  
5. View recent chats on the left sidebar  
6. Delete any conversation from the top menu  

---

## 🔑 How to Get OpenRouter API Key

1. Visit [https://openrouter.ai](https://openrouter.ai)  
2. Sign in and copy your API key  
3. Paste it into `.env` like this:

```env
OPENROUTER_API_KEY=your_key_here
```

---

## 🛠 Technologies Used

- React + Tailwind CSS  
- Node.js + Express.js  
- MongoDB Atlas  
- OpenRouter API
- Framer Motion  
- Vite

---

## 🙌 Developed By

**RAHUL DRAVID**  
Inspired by real-world AI interfaces like ChatGPT.

---

## 📄 License

This project is open-source and free to use.

---
