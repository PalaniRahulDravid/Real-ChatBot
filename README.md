# 💬 AI Chatbot using MERN Stack

This is a full-stack chatbot web application built using **React** (frontend), **Express.js** (backend), and **MongoDB Atlas** (database). It uses **Groq API Key** for generating intelligent AI responses.

---

## 🚀 Features

- 🔐 **User Authentication** (Register/Login)
- 🚫 Protected Routes: Only logged-in users can access the chat
- 🌐 Responsive web interface to chat with an AI assistant  
- ✨ Start new chats and view previous conversations  
- 💾 Chat history is saved in **MongoDB Atlas**  
- 🔁 Switch between chats and delete any chat  
- ⌨️ Typing indicator added for better UX  
- 🧠 AI integration via OpenRouter

---

## 📁 Project Structure

```
client/                 # React Frontend
  └── components/       # Reusable UI components
  └── pages/            # Page-level components (Login, Register, Chat, etc)
  └── utils/            # Utility functions
  └── App.jsx           # Root component
  └── main.jsx          # React entry point

server/                 # Node.js Backend
  └── routes/
      └── auth.js       # Register & Login APIs
      └── chat.js       # Chat APIs
  └── models/
      └── User.js       # User schema
      └── Chat.js       # Chat schema
  └── middleware/
      └── authMiddleware.js  # Token validation middleware
  └── index.js          # Server entry point
  └── .env              # Environment config
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/PalaniRahulDravid/Real-ChatBot.git
cd Real-ChatBot
```

---

### 2. Setup the backend (server)

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
MONGO_URI=your_mongodb_atlas_url
GROQ_API_KE=your_groq_api_key
JWT_SECRET=your_jwt_secret_key
```

Start the backend:

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

## 🔑 Authentication Flow

- 📝 **Register** at `/register` with name, email, and password
  - Invalid email = "Please enter a valid email address"
  - Existing user = "User already exists. Please login."
  - Success = "Registration successful. Please login."

- 🔐 **Login** at `/login` with valid credentials
  - Invalid combo = "Invalid email or password"
  - Unregistered email = "Please register first"
  - On success, you're redirected to the chatbot

- 🧭 **Route Protection**
  - If you're not logged in, `/` (chat page) redirects to `/login`
  - Token stored securely in `localStorage`

---

## 🧠 How to Use

1. Open the app: [https://real-chat-bot.vercel.app/login](https://real-chat-bot.vercel.app/login)
2. Register or login  
3. Start chatting with the AI  
4. View recent chats in sidebar  
5. Logout by clearing `localStorage` token  

---

## 🔑 How to Get Groq API Key

1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)  
2. Sign in and get your API key  
3. Paste it into `.env` like this:

```env
OPENROUTER_API_KEY=your_key_here
```

---

## 🛠 Technologies Used

- React + Tailwind CSS  
- Node.js + Express.js  
- MongoDB Atlas  
- Groq API  
- JWT for authentication  
- Vite + Framer Motion

---

## 🙌 Developed By

**RAHUL DRAVID**  
Inspired by real-world AI apps like ChatGPT & Gemini.

---

## 📄 License

This project is open-source and free to use.

---
