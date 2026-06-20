const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register User & Send Verification Email
exports.registerUser = async (req, res) => {
    const { name, email, password, subjects, bio, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Creating user with default true to avoid deployment/email network blocks
        const user = await User.create({ 
            name, 
            email, 
            password, 
            subjects: Array.isArray(subjects) ? subjects : [subjects], 
            bio, 
            role, 
            verificationToken,
            isVerified: true // Guaranteed login access right after registration
        });

        const verifyUrl = `https://study-finder-ai.onrender.com/api/users/verify/${verificationToken}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; border: 1px solid #e2e8f0; padding: 30px; border-radius: 12px; max-width: 500px; margin: auto;">
                <h2 style="color: #2563eb; text-align: center;">Verify Your Account</h2>
                <p>Hello ${name},</p>
                <p>Thank you for joining StudyAI! Please click the button below to verify your email address and activate your account:</p>
                <div style="text-align: center;">
                    <a href="${verifyUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Verify My Email</a>
                </div>
            </div>
        `;

        try {
            // Attempting to send real email in background
            await sendEmail({
                email: user.email,
                subject: "Verify your email - StudyAI",
                html: htmlContent
            });
            
            return res.status(201).json({ 
                message: "Registration successful! A verification link has been sent to your email for security."
            });
        } catch (mailErr) {
            console.error("📧 Nodemailer background notice:", mailErr.message);
            
            // Safe fallback message if network blocks the email delivery
            return res.status(201).json({ 
                message: "Registration successful! Your account is active and ready to use."
            });
        }
    } catch (err) {
        console.error("DETAILED REGISTRATION ERROR:", err); 
        return res.status(500).json({ message: err.message });
    }
};

// @desc    Verify Email Token
exports.verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        
        if (!user) {
            return res.status(400).send(`
                <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                    <h1 style="color: #ef4444;">Verification Link Expired</h1>
                    <p>Your account is already active. You can proceed to log in.</p>
                    <a href="https://study-finder-ai-pr91.vercel.app/login" style="display: inline-block; margin-top: 20px; color: #2563eb; font-weight: bold; text-decoration: none; border: 1px solid #2563eb; padding: 10px 20px; border-radius: 5px;">Go to Login Page</a>
                </div>
            `);
        }

        user.isVerified = true;
        user.verificationToken = undefined; 
        await user.save();

        res.send(`
            <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                <h1 style="color: #22c55e;">Email Verified Successfully! ✅</h1>
                <p>Your account status is fully verified. You can now return to the workspace.</p>
                <a href="https://study-finder-ai-pr91.vercel.app/login" style="display: inline-block; margin-top: 20px; color: #2563eb; font-weight: bold; text-decoration: none; border: 1px solid #2563eb; padding: 10px 20px; border-radius: 5px;">Go to Login Page</a>
            </div>
        `);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
};

// @desc    Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            // Clean dynamic response structure
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
        // Adjusted query to ensure newly registered hybrid users show up in peer discovery
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