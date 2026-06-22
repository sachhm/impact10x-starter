<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://impact10x.com.au/wp-content/uploads/2025/03/Impact-10x-logo-white.svg">
    <img alt="Impact10X" src="https://impact10x.com.au/wp-content/uploads/2025/03/Impact10x-logo-black-big.svg" width="240">
  </picture>
</p>

# Impact10X — AI MVP Starter

> Guiding innovators to turn problems into success stories.

This is the starter template for the **Impact10X 3-Day AI Simulator** — the
starting point for teams going from idea to a working, live MVP in three days.
The **five boxes** below are the mental model used across the program: once you
know which box does what, you always know where to make a change. Build it, ship
a live URL, pitch on Day 3.

---

## The five boxes (the whole map)

| # | Box | What it does | The file it lives in |
|---|-----|--------------|----------------------|
| 1 | **INTERFACE** | The screen the user sees | `app/page.tsx` |
| 2 | **LOGIC** | The back room that handles the request | `app/api/generate/route.ts` |
| 3 | **INTELLIGENCE** | The actual AI call + its personality | inside `app/api/generate/route.ts` |
| 4 | **MEMORY** | Saves answers so they survive a refresh | `lib/memory.ts` |
| 5 | **CONNECTIONS** | Talking to other services on the internet | `lib/connections.ts` |

### "I want to change X — which box?"

- **To change what the USER SEES** (wording, layout, colours)
  → edit **`app/page.tsx`** (BOX 1, INTERFACE).
- **To change what the APP DOES with the input** (the steps, validation)
  → edit **`app/api/generate/route.ts`** (BOX 2, LOGIC).
- **To change what the AI DOES** (its personality / instructions)
  → edit the `SYSTEM_PROMPT` line in **`app/api/generate/route.ts`** (BOX 3, INTELLIGENCE).
- **To change WHERE answers are saved**
  → edit **`lib/memory.ts`** (BOX 4, MEMORY).
- **To connect another outside service** (weather, CRM, payments...)
  → edit **`lib/connections.ts`** (BOX 5, CONNECTIONS).

---

## Run it (3 steps)

You need [Node.js](https://nodejs.org) installed. Then:

```bash
npm install        # download the building blocks (once)
cp .env.example .env   # create your settings file
npm run dev        # start the app
```

Open **http://localhost:3000**. It works **immediately in "mock mode"** — no AI
account needed. You'll get fake answers so you can see the whole flow first.

---

## Turn on real AI (optional)

The same code works with OpenAI, Groq, or Google Gemini — you only change
settings, not code. Open your `.env` file and fill in:

| Provider | `AI_BASE_URL` | `AI_MODEL` example |
|----------|---------------|--------------------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` |
| Gemini | `https://generativelanguage.googleapis.com/v1beta/openai/` | `gemini-2.0-flash` |

Then paste your key into `AI_API_KEY` and restart (`npm run dev`).
If `AI_API_KEY` is blank, the app stays in friendly mock mode.

---

## Deploy to the internet (Vercel)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), click **New Project**, pick your repo.
3. Under **Environment Variables**, add `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`
   (same values as your `.env`).
4. Click **Deploy**. Done — you have a live URL.

---

## Upgrading MEMORY to Supabase (when you outgrow the browser)

Right now answers are saved in the browser (localStorage). That's per-device
and gets cleared if the user wipes their browser. When you want answers stored
in a real database (shared across devices, kept forever), switch to
[Supabase](https://supabase.com):

1. Create a free Supabase project and a table called `results` with columns
   `id` (text, primary key — `upsert` uses it to avoid duplicate rows),
   `prompt` (text), `answer` (text), `created_at` (timestamp, default `now()`).
2. `npm install @supabase/supabase-js`.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env`.
4. In **`lib/memory.ts`**, swap the localStorage functions for the
   commented-out Supabase example already written at the bottom of that file.

Nothing else in the app changes — that's the whole point of keeping MEMORY in
its own box.

---

<p align="center">
  Delivered by JCU and Mindesigns, supported by the Queensland Government through
  the Regional Enablers Program.<br>
  <a href="https://impact10x.com.au/simulator/">impact10x.com.au/simulator</a>
</p>
