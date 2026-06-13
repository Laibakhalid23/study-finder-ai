const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Enforcing direct SSL secure channel configuration for stable cloud-instance executions
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for port 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            },
            tls: {
                rejectUnauthorized: false, // Bypasses internal routing proxies on cloud servers
                minVersion: 'TLSv1.2'
            }
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