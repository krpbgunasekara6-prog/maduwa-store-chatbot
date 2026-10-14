# Maduwa Store — Gemini AI Chatbot Starter

A small Node.js/Express chatbot for Maduwa Store, connected to Google's Gemini API. The browser never receives the API key; it stays in the server `.env` file.

## 1. Get a Gemini API key

1. Open https://aistudio.google.com/apikey
2. Sign in with your Google account.
3. Create an API key. Use the free tier if it is offered to your account/model.
4. Do not share the key or put it in `public/index.html`.

Google's free tier has model-specific usage limits and policies. Check https://ai.google.dev/gemini-api/docs/pricing before deploying publicly. Free-tier requests may be limited, and Google says free-tier content may be used to improve its products.

## 2. Run the project

Install Node.js (LTS), then in this folder run:

```bash
npm install
```

Copy `.env.example` to `.env` and add your key:

```env
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-3.8-flash
PORT=3000
```

Then start the server:

```bash
npm start
```

Open http://localhost:3000 in your browser.

## Notes

- The Gemini model can be changed using `GEMINI_MODEL` if that model is not available for your account.
- The app has basic rate limiting and security headers. For public production use, add stronger abuse protection and monitor usage.
- Account prices and stock are not invented; the bot directs customers to WhatsApp 0719270005 to confirm.
- Never ask customers for passwords, OTPs, recovery codes, or email access.
- Hosting the server may have separate costs even when Gemini API usage is within a free tier.
