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

It now includes a streamed, multi-turn AI chat experience using the Vercel AI
SDK while still keeping the code heavily commented and beginner-readable.

> **If you forked this, start here.** The template already contains all five
> boxes. Your first moves are: **(1)** set your AI key + model in env vars if you
> want real AI, and **(2)** edit the `SYSTEM_PROMPT` in the Intelligence box
> (`app/api/chat/route.ts`). If `AI_API_KEY` is blank, the app still works in
> mock mode.

---

## What's new in this version

- Real-time streamed AI replies with the **Vercel AI SDK**.
- Multi-turn conversation history with `useChat`.
- Polished shadcn/ui chat interface with message bubbles, timestamps, copy, clear chat, and loading states.
- Mock streaming mode that works with zero configuration.
- AI SDK tool-calling example for the Connections box.
- Browser `localStorage` memory with a one-file Supabase upgrade path.
- `AGENTS.md` and `.cursorrules` for future coding agents.
- Strict TypeScript and production build verification.

---

## The five boxes (the whole map)

| # | Box | What it does | The file it lives in |
|---|-----|--------------|----------------------|
| 1 | **INTERFACE** | The screen the user sees | `app/page.tsx` |
| 2 | **LOGIC** | The back room that handles chat requests | `app/api/chat/route.ts` |
| 3 | **INTELLIGENCE** | The AI call + its personality | `SYSTEM_PROMPT` inside `app/api/chat/route.ts` |
| 4 | **MEMORY** | Saves the chat so it survives a refresh | `lib/memory.ts` |
| 5 | **CONNECTIONS** | Talking to other services and AI tools | `lib/connections.ts` |

### "I want to change X — which box?"

- **To change what the USER SEES** (wording, layout, colours)
  → edit **`app/page.tsx`** (BOX 1, INTERFACE).
- **To change what the APP DOES with the input** (the steps, validation, tools)
  → edit **`app/api/chat/route.ts`** (BOX 2, LOGIC).
- **To change what the AI DOES** (its personality / instructions)
  → edit the `SYSTEM_PROMPT` line in **`app/api/chat/route.ts`** (BOX 3, INTELLIGENCE).
- **To change WHERE chats are saved**
  → edit **`lib/memory.ts`** (BOX 4, MEMORY).
- **To connect another outside service** (weather, CRM, payments...)
  → edit **`lib/connections.ts`** (BOX 5, CONNECTIONS).

---

## Run it (3 steps)

You need [Node.js](https://nodejs.org) **22 or newer** — Vercel deploys on 24 by
default. If you use [nvm](https://github.com/nvm-sh/nvm), just run `nvm use` in
this folder — it reads the included `.nvmrc` and picks the right version for
you. Then:

```bash
npm install             # download the building blocks once
cp .env.example .env    # create your local settings file
npm run dev             # start the app
```

> **Don't delete `package-lock.json`.** It pins the exact, tested versions of
> every dependency. Keeping it means `npm install` gives you the same working
> setup we tested — delete it and you may pull in newer, untested versions.

Open **http://localhost:3000**. It works **immediately in mock mode** — no AI
account needed. You'll get streamed fake answers so you can see the whole flow
first.

---

## Turn on real AI (optional)

The app uses the Vercel AI SDK with an OpenAI-compatible provider. The same code
works with OpenAI, Groq, or Google Gemini — you only change settings, not code.
Open your `.env` file and fill in:

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

> ⚠️ **Your `/api/chat` URL is public and spends your AI key.** Anyone who gets
> your live URL can send it messages, and every message uses *your* AI credits.
> For a 3-day build that's fine if you do two things:
> 1. **Use a free-tier key** (Google Gemini or Groq) — their own limits cap how
>    much anyone can run up.
> 2. **Set a spend cap** in your AI provider's dashboard.
>
> Going past the event / sharing the URL widely? Add rate limiting before then
> (e.g. [`@upstash/ratelimit`](https://github.com/upstash/ratelimit-js) or a
> Vercel Firewall rule on `/api/chat`).

---

## Upgrading MEMORY to Supabase (when you outgrow the browser)

Right now chats are saved in the browser (`localStorage`). That's per-device and
gets cleared if the user wipes their browser. When you want chats stored in a
real database (shared across devices, kept forever), switch to
[Supabase](https://supabase.com).

### 1. Create the table

Run this SQL in your Supabase SQL editor:

```sql
create table if not exists public.chat_sessions (
  id text primary key,
  messages jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.chat_sessions enable row level security;

-- Beginner-friendly starter policy for simulator prototypes.
-- For production apps, replace this with user-based auth policies.
create policy "Allow anonymous simulator chat sessions"
  on public.chat_sessions
  for all
  using (true)
  with check (true);
```

### 2. Add env vars

Add these to `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

They are already listed as blank entries in `.env.example`.

### 3. Swap the Memory box

In `lib/memory.ts`, comment out the localStorage block and uncomment the
Supabase block. Nothing else changes.

That is the whole point of keeping MEMORY in its own box.

---

## For Coding Agents

Future AI coding agents should read **`AGENTS.md`** before changing the project.
It explains the Five Boxes architecture, project constraints, commands, and the
rule that AI behaviour belongs in `SYSTEM_PROMPT` only.

Cursor users can also rely on **`.cursorrules`** for concise project rules.

---

## Quality checks

Before deploying or submitting changes, run:

```bash
npm run build
npx tsc --noEmit
npm run lint
```

Also test once with `AI_API_KEY` blank to confirm mock mode still works.

---

<p align="center">
  Delivered by JCU and Mindesigns, supported by the Queensland Government through
  the Regional Enablers Program.<br>
  <a href="https://impact10x.com.au/simulator/">impact10x.com.au/simulator</a>
</p>
