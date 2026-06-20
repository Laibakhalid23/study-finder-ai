require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

// Whitelist origins with all potential local development ports (5173 and 5174)
const allowedOrigins = [
    "https://study-finder-ai-pr91.vercel.app",
    "https://study-finder-ai-pr91.vercel.app/",
    "http://localhost:5173",
    "http://localhost:5173/",
    "http://localhost:5174",
    "http://localhost:5174/"
];

// Configure Express CORS correctly for development and production
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.includes("localhost") || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true
}));

app.use(express.json());

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io with configurations
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
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

    socket.on('join_chat', ({ userId, receiverId }) => {
        if (!userId || !receiverId) return;
        const roomName = [userId, receiverId].sort().join('_');
        socket.join(roomName);
        console.log(`👥 Socket ${socket.id} joined conversation room: ${roomName}`);
    });

    socket.on('send_message', (data) => {
        if (!data.senderId || !data.receiverId) return;
        const roomName = [data.senderId, data.receiverId].sort().join('_');
        socket.to(roomName).emit('receive_message', data);
    });

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