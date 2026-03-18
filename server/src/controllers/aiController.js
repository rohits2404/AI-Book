import { openai } from "../config/openai.js";

/* ======================================================
   📚 GENERATE BOOK OUTLINE
====================================================== */
export const generateBookOutline = async (req, res) => {
    try {
        const { topic, style, numChapters, description } = req.body;

        if (!topic || !style || !numChapters || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const prompt = `
Create a book outline.

Topic: ${topic}
Style: ${style}
Description: ${description}
Chapters: ${numChapters}

Return ONLY valid JSON array like:
[
 { "title": "Chapter 1", "description": "..." }
]
        `;

        const response = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        let text = response.choices[0]?.message?.content || "";

        // safer JSON extraction
        const jsonMatch = text.match(/\[[\s\S]*\]/);

        if (!jsonMatch) throw new Error("Invalid JSON format");

        const outline = JSON.parse(jsonMatch[0]);

        res.status(200).json({ outline });

    } catch (error) {
        console.error("Outline Error:", error.message);

        const fallback = generateSampleOutline(
            req.body.topic,
            req.body.numChapters,
            req.body.style
        );

        res.status(200).json({ outline: fallback });
    }
};

/* ======================================================
   📖 GENERATE BOOK CONTENT
====================================================== */
export const generateBookContent = async (req, res) => {
    try {
        const { chapterTitle, chapterDescription, style } = req.body;

        if (!chapterTitle || !style) {
            return res.status(400).json({ error: "Chapter title and style required" });
        }

        const prompt = `
Write a detailed book chapter.

Title: ${chapterTitle}
Style: ${style}
${chapterDescription ? `Focus: ${chapterDescription}` : ""}

Structure:
- Introduction
- Multiple sections
- Conclusion
        `;

        const response = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content;

        if (!content) throw new Error("Empty response");

        res.status(200).json({ content });

    } catch (error) {
        console.error("Content Error:", error.message);

        const fallback = generateSampleChapterContent(
            req.body.chapterTitle,
            req.body.chapterDescription,
            req.body.style
        );

        res.status(200).json({ content: fallback });
    }
};

/* ======================================================
   ✂️ SUMMARIZE TEXT
====================================================== */
export const summarizeText = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "Text is required" });
        }

        const response = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: "Summarize clearly and concisely.",
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            temperature: 0.3,
        });

        const summary = response.choices[0]?.message?.content;

        res.status(200).json({ summary });

    } catch (error) {
        console.error("Summarization error:", error.message);
        res.status(500).json({ error: "Failed to summarize text" });
    }
};

/* ======================================================
   🔑 EXTRACT KEYWORDS
====================================================== */
export const extractKeywords = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "Text is required" });
        }

        const prompt = `
Extract important keywords from this text.
Return as JSON array.

Text:
${text}

Format:
["keyword1", "keyword2"]
        `;

        const response = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        });

        const raw = response.choices[0]?.message?.content || "";
        const match = raw.match(/\[[\s\S]*\]/);

        const keywords = match ? JSON.parse(match[0]) : [];

        res.status(200).json({ keywords });

    } catch (error) {
        console.error("Keyword error:", error.message);
        res.status(500).json({ error: "Failed to extract keywords" });
    }
};

/* ======================================================
   🧠 CLASSIFY TEXT
====================================================== */
export const classifyText = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "Text is required" });
        }

        const prompt = `
Classify this text into one of the following:
fiction, non-fiction, educational, self-help, biography

Return JSON:
{ "category": "..." }

Text:
${text}
        `;

        const response = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
        });

        const raw = response.choices[0]?.message?.content || "";
        const match = raw.match(/\{[\s\S]*\}/);

        const classification = match ? JSON.parse(match[0]) : {};

        res.status(200).json({ classification });

    } catch (error) {
        console.error("Classification error:", error.message);
        res.status(500).json({ error: "Failed to classify text" });
    }
};
