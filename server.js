import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));
app.use("/api/", rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false
}));

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const STORE_INSTRUCTIONS = `
ඔයා Maduwa Store එකේ friendly gaming store assistant.
Customer සමඟ සිංහල/English mix එකෙන්, ලස්සනට සහ කෙටියෙන් කතා කරන්න. සාමාන්‍යයෙන් "මචං" කියලා ආදරයෙන් අමතන්න.
Customer අහන දේට අදාළ store info පමණක් භාවිතා කරන්න. Prices වෙනස් කරලා හදන්න එපා. නොදන්න stock, delivery time, account price හෝ warranty තහවුරු කරලා කියන්න එපා; WhatsApp එකෙන් confirm කරන්න කියන්න.
Store WhatsApp: 0719270005. Link: https://wa.me/94719270005

TOP-UP PRICE LIST (LKR):
Weekly Lite 130
Weekly 580
Monthly 2850
Little Pack 1600
VIP Pack 3450
VIP Special 3560
Big Pack 5200
Super VIP 5160
Diamond Packs: 8600 / 14300 / 23000 / 28800

BLOOD STRIKE:
Strike Pass Elite 1300
Strike Pass Premium 1450
100 + 5 Golds 300
300 + 20 Golds 950
1000 + 100 Golds 3000
2000 + 260 Golds 5500
5000 + 800 Golds 12000

GUILD GLORY BOTS (LKR):
4 Bots 1200
8 Bots 2000
12 Bots 3150
16 Bots 4200
20 Bots 5450
24 Bots 6800

ACCOUNT SELLING:
Maduwa Store also sells game accounts. No account-specific price list, inventory, or stock details have been supplied yet. If a customer asks for an account, ask which game they mean (PUBG Mobile, Free Fire, Blood Strike, Call of Duty, or PC game) and their budget, then explain that current stock and price must be confirmed with the store via WhatsApp. Do not invent account prices or claim an account is available.
For account buying/selling, remind users not to share passwords, recovery codes, email access, or OTPs in chat. Never ask for them.

Other supported game topics include PUBG Mobile, Free Fire, Blood Strike, Call of Duty, and PC games. For gaming advice, help generally. Do not claim to complete purchases or payments; only guide customers to contact the store.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) return res.status(400).json({ error: "Message එකක් එවන්න." });
    if (message.length > 2000) return res.status(413).json({ error: "Message එක දිග වැඩියි." });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "GEMINI_API_KEY එක .env file එකට දාන්න." });
    }

    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction: STORE_INSTRUCTIONS,
        maxOutputTokens: 500
      }
    });

    return res.json({ reply: response.text || "මචං, සමාවෙන්න. නැවත අහන්න." });
  } catch (error) {
    console.error("Chat API error:", error?.status || error?.message || "unknown error");
    const status = (error?.status === 401 || error?.status === 403) ? 503 : 500;
    return res.status(status).json({
      error: status === 503
        ? "Google Gemini API key එක වැරදි හෝ සකස් කරලා නැහැ. Server .env එක check කරන්න."
        : "Gemini request එක අසාර්ථකයි. API key, model සහ free-tier limits check කරන්න."
    });
  }
});

app.listen(port, () => {
  console.log(`Maduwa Store AI is running at http://localhost:${port}`);
});
