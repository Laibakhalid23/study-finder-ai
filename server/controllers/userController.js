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

// @desc    Get My Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, bio, subjects, currentPassword, newPassword } = req.body;

        // Update basic fields
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (subjects) {
            user.subjects = Array.isArray(subjects)
                ? subjects
                : subjects.split(',').map(s => s.trim()).filter(Boolean);
        }

        // Password change — only if both fields provided
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ message: "New password must be at least 6 characters" });
            }
            user.password = newPassword; // pre-save hook will hash it
        }

        const updatedUser = await user.save();

        // Return updated user data (same shape as login response)
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            subjects: updatedUser.subjects,
            bio: updatedUser.bio,
            role: updatedUser.role,
            token: generateToken(updatedUser._id)
        });

    } catch (err) {
        console.error("Update Profile Error:", err);
        res.status(500).json({ message: err.message });
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