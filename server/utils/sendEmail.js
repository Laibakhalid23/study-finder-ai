const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            },
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
        console.error("📧 Nodemailer Error:", error);
        throw new Error("Email could not be sent");
    }
};

module.exports = sendEmail;