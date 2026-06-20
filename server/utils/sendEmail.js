const nodemailer = require('nodemailer');
const dns = require('dns');

// Force Node.js DNS resolution to prefer IPv4 globally
dns.setDefaultResultOrder('ipv4first');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,          // Changed from 465
            secure: false,      // false = STARTTLS (upgraded after connection)
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
                minVersion: 'TLSv1.2'
            },
            connectionTimeout: 15000,
            greetingTimeout: 15000,
            socketTimeout: 15000,
        });

        const mailOptions = {
            from: `"StudyAI Finder" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent successfully to:", options.email);
    } catch (error) {
        console.error("📧 Nodemailer Connection Error:", error);
        throw new Error("Email could not be sent");
    }
};

module.exports = sendEmail;