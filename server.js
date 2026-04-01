require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "AI .html"));
});

// API للـ Chat
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ reply: "write a message first!" });

        const result = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: message }],
        });

        const text = result.choices[0].message.content;
        res.json({ reply: text });

    } catch (error) {
        console.error("❌ GROQ ERROR:", error.message);
        res.status(500).json({ reply: "Error: " + error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
