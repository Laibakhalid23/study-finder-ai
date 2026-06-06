require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

app.get('/', (req, res) => {
    res.send("<h1>🚀 Study Finder API is Running</h1>");
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join a deterministic conversation room for two specific users
    socket.on('join_chat', ({ userId, receiverId }) => {
        if (!userId || !receiverId) return;
        const roomName = [userId, receiverId].sort().join('_');
        socket.join(roomName);
        console.log(`👥 Socket ${socket.id} joined conversation room: ${roomName}`);
    });

    // Handle real-time incoming messages
    socket.on('send_message', (data) => {
        if (!data.senderId || !data.receiverId) return;
        const roomName = [data.senderId, data.receiverId].sort().join('_');
        socket.to(roomName).emit('receive_message', data);
    });

    // Handle real-time message deletions
    socket.on('delete_message', (data) => {
        if (!data.senderId || !data.receiverId || !data.id) return;
        const roomName = [data.senderId, data.receiverId].sort().join('_');
        socket.to(roomName).emit('message_deleted', { id: data.id });
    });

    socket.on('disconnect', () => {
        console.log('👋 User disconnected');
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully!");
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); 
    });