# AI CRM Frontend

React + Vite + Tailwind (CDN) frontend for the AI CRM backend.

## Setup

1. `npm install`
2. `.env` already hai with `VITE_API_URL=http://localhost:5000/api` — agar backend kisi aur port pe hai to change kar lena
3. `npm run dev`
4. Browser mein `http://localhost:5173` khulega

**Important:** Backend server (`ai-crm-backend`) pehle se chalu hona chahiye (`npm run dev` us folder mein), tabhi yeh frontend kaam karega.

## Pages

| Route | Description |
|---|---|
| `/signup` | Naya business register karo |
| `/login` | Login |
| `/dashboard` | Lead stats overview |
| `/leads` | Saare leads, filter/search, naya lead add karo |
| `/leads/:id` | Lead detail — AI ke saath chat simulate karo, AI se score karwao |

## How the AI Chat Demo Works

`/leads/:id` page pe ek chat window hai jahan aap **customer ki taraf se** message type karte ho (jaise ek real customer type kar raha ho). Yeh message backend ke `/api/ai/chat` ko jaata hai, jo configured AI provider (Claude/OpenAI/Gemini — jo bhi `.env` mein set hai) se reply generate karke wapas bhejta hai. "✨ Score This Lead with AI" button conversation ko analyze karke ek 1-10 score aur summary generate karta hai.

## Note on Tailwind

Yeh project Tailwind ko CDN (`index.html` mein `<script>` tag) se load karta hai — isse setup fast ho jaata hai bina extra build config ke. Production ke liye baad mein proper Tailwind install kar sakte ho (`npm install -D tailwindcss postcss autoprefixer`), lekin abhi demo/internship ke liye yeh approach bilkul sahi hai.
