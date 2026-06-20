const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        await resend.emails.send({
            from: 'StudyAI <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            html: options.html,
        });
        console.log("📧 Email sent via Resend to:", options.email);
    } catch (error) {
        console.error("📧 Resend Error:", error);
        throw new Error("Email could not be sent");
    }
};

module.exports = sendEmail;