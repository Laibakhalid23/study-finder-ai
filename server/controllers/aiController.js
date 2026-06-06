const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askTutor = async (req, res) => {
    try {
        const { question, subject } = req.body;
        
        // Use the key from your .env
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // This name matches the 'gemini-3-flash-preview' in your screenshot
        // If this still fails, change it to "gemini-1.5-flash" inside these quotes
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(`Expert Tutor for ${subject}. Explain: ${question}`);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            answer: text
        });

    } catch (err) {
        console.error("AI ERROR:", err.message);
        
        res.status(500).json({ 
            success: false, 
            error: err.message 
        });
    }
};