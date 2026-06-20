const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, 
            secure: true, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            },
            tls: {
                rejectUnauthorized: false, 
                minVersion: 'TLSv1.2'
            },
            // Added: Forces Node to prioritize IPv4 over IPv6 networks on cloud servers
            family: 4, 
            connectionTimeout: 12000, 
            greetingTimeout: 12000
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
        // Throwing error back to userController so our elegant fallback mechanism triggers smoothly
        throw new Error("Email could not be sent");
    }
};

module.exports = sendEmail;