# 🎓 StudyFinder AI - Peer-to-Peer Study Marketplace with AI Tutor

StudyFinder AI is a feature-rich, full-stack web application designed to connect students with compatible study partners based on shared subjects and academic interests. Featuring real-time messaging, smart unread notification tracking, a secure email verification system, and a native **Google Gemini AI** assistant, it seamlessly bridges the gap between collaborative peer learning and advanced AI-assisted education.

---

## 🚀 Key Features

* **🔍 Smart Peer Discovery:** Filter and find study partners instantly based on verified academic stacks (e.g., React, OOP, Data Structures).
* **💬 Real-Time Chat Workspace:** High-performance, instant messaging powered by WebSockets (`Socket.io`) with automatic room assignment.
* **🔴 Advanced Unread Tracking:** Smart sidebar notifications that track specific senders and dynamically display "New" badges on the chat screen.
* **🧠 Built-in Gemini AI Tutor:** An integrated conversational study partner powered by Google's Generative AI (`gemini-3-flash-preview`) that provides contextual help based on the student's subjects.
* **✉️ Secure Email Verification:** Two-step registration process that sends automated account activation links via email to ensure genuine user profiles.
* **📊 Dynamic Dashboard:** A clean user interface showing active academic stacks, recent direct peer chats with instant shortcuts, and an AI initialization instance.

---

## 📂 Project Structure

This repository is structured as a **Monorepo**, separating concerns between the client interface and the server architecture:

```text
study-finder-ai/
├── client/                 # Frontend - React.js + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/     # Reusable UI (Sidebar, Chat Workspace)
│   │   ├── pages/          # Layouts (Dashboard, FindPeers, Messages, AITutor)
│   │   └── App.jsx         # Centralized state & Socket provider
│   └── package.json
└── server/                 # Backend - Node.js + Express + MongoDB
    ├── controllers/        # Route logic (aiController, messageController, userController)
    ├── models/             # Schema definitions (User, Message)
    ├── routes/             # REST API Endpoints (aiRoutes, messageRoutes, userRoutes)
    ├── middleware/         # Middleware for authentication
    └── server.js           # Server initializer & Socket server
```

## 🛠️ Tech Stack
### Frontend
* **Library:** React.js (Vite workflow)

* **Styling:** Tailwind CSS (Modern, fluid layouts)

* **Icons:** Lucide React

* **State & Routing:** React Router DOM

* **Networking:** Axios & Socket.io-Client

### Backend
* **Runtime:** Node.js

* **Framework:** Express.js

* **Database:** MongoDB (Mongoose ODM)

* **AI Integration:** Google Gen AI SDK (@google/generative-ai)

* **Real-time Protocol:** Socket.io

* **Mailing Service:** Nodemailer / Crypto (for tokens)

* **Security:** JWT (JSON Web Tokens) & Bcrypt

## ⚙️ Local Setup Instructions
Follow these steps to get the project running locally on your machine.

### Prerequisites
Node.js installed (v16+ recommended)

MongoDB Atlas account or local MongoDB instance running

1. Clone the Repository
```
Bash

git clone [https://github.com/Laibakhalid23/study-finder-ai.git](https://github.com/Laibakhalid23/study-finder-ai.git)
cd study-finder-ai
```
2. Setup Backend Server
```
Bash

cd server
npm install
```
Create a .env file inside the server/ directory and configure your credentials:
```
Code snippet

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```
Start the server:
```
Bash

npm start # or nodemon server.js
```
3. Setup Frontend Client
Open a new terminal window, navigate back to the root, and enter the client folder:

```
Bash

cd client
npm install
```
Start the local development server:

```
Bash

npm run dev
```
Your application will be live at http://localhost:5173!

## 💡 Future Roadmap
[ ] Audio/Video Group Rooms: Enabling face-to-face virtual study rooms using WebRTC.

[ ] File Sharing: Uploading notes, code snippets, and PDFs within the peer chat.

[ ] AI Summary Nodes: Automatically generating study summaries of peer chat history using Gemini.

