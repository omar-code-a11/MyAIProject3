const Groq = require("groq-sdk");

// Vercel Serverless Function
module.exports = async (req, res) => {
    
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method Not Allowed" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ reply: "Write a message first!" });
        }

        const result = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: message }],
        });

        const text = result.choices[0].message.content;
        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("❌ GROQ ERROR:", error.message);
        res.status(500).json({ reply: "Error: " + error.message });
    }
};