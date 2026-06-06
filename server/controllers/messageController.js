// controllers/messageController.js
const Message = require('../models/Message');
const User = require('../models/User');

const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        console.log("Sender ID from req.user:", req.user._id);
        const newMessage = new Message({
            senderId: req.user._id, 
            receiverId,
            message
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("SendMessage Error:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
};

const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userId },
                { senderId: userId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to load messages" });
    }
};

const getConversations = async (req, res) => {
    try {
        const myId = req.user._id;
        const sentTo = await Message.distinct('receiverId', { senderId: myId });
        const receivedFrom = await Message.distinct('senderId', { receiverId: myId });
        const allUserIds = [...new Set([...sentTo, ...receivedFrom])];
        const users = await User.find({ _id: { $in: allUserIds } }).select('name email');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch conversations" });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.id;
        // ✅ FIXED: Explicitly use Mongoose identification mapping variable formats (._id vs .id)
        const userId = req.user._id.toString(); 

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: "Message not found" });

        // Check if the user is the sender
        if (message.senderId.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized to delete this message" });
        }

        await Message.findByIdAndDelete(messageId);
        res.json({ message: "Message deleted successfully", id: messageId });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Clear and Explicit Export
module.exports = {
    sendMessage,
    getMessages,
    getConversations,
    deleteMessage
};