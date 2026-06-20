const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register User
exports.registerUser = async (req, res) => {
    const { name, email, password, subjects, bio, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ 
            name, 
            email, 
            password, 
            subjects: Array.isArray(subjects) ? subjects : [subjects], 
            bio, 
            role
        });

        return res.status(201).json({ 
            message: "Registration successful! Welcome to StudyAI."
        });

    } catch (err) {
        console.error("Registration Error:", err); 
        return res.status(500).json({ message: err.message });
    }
};

// @desc    Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ 
                _id: user._id, 
                name: user.name, 
                email: user.email,
                subjects: user.subjects,
                bio: user.bio,
                role: user.role,
                token: generateToken(user._id) 
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Find Peers
exports.findPeers = async (req, res) => {
    try {
        const { subject } = req.query;
        let query = { _id: { $ne: req.user.id } };

        if (subject) {
            query.subjects = { $regex: subject, $options: 'i' };
        }

        const peers = await User.find(query).select('-password');
        res.json(peers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};