# AI MVP Build-Prompts (Provider-Agnostic)
### Copy-paste these into whatever you're building with — ChatGPT, Gemini, Cursor, Copilot, Bolt, Lovable, v0, or Replit.

Fill in anything in `[BRACKETS]`. Work top to bottom — each prompt builds on the last.

---

## First, 5 rules for talking to your AI builder

1. **Give context before the ask.** Tell it what the app is and what you're trying to do *before* the specific request.
2. **One change at a time.** Don't ask for five features in one prompt. Build → test → next.
3. **Paste the *actual* error.** Copy the real error text. "It's broken" gives the AI nothing to work with.
4. **Describe the user, not the code.** Say "when someone clicks Submit, they should see X," not "use a useState hook." Let the AI pick the how.
5. **Ask it to explain.** End with "explain what you changed in one sentence" so you understand your own system — that's the whole point.

---

## 0 — Scope it (do this before you build anything)

```
My idea is: [ONE SENTENCE].
Help me cut this down to a single MVP: ONE user, ONE job they need done,
and ONE happy path (the success case, ignore edge cases).
Ask me 3 questions if you need to, then give me the one-sentence version.
```

---

## 1 — Interface: build the app shell

> **If you forked the starter template, start here.** It already contains all five
> boxes, so prompts **#1–3** (app shell, AI call, save-on-refresh) are **already
> built** — don't run them to recreate what's there; read them as a guide to what
> you'll be EDITING. Your first real moves: **(1)** set your AI key + model env
> vars, and **(2)** edit the `SYSTEM_PROMPT` in the Intelligence box
> (`app/api/generate/route.ts`). Then carry on from **#4 (Connections) → #6
> (Deploy) → #7 (Demo)**. Prompt #1 below is only for building from scratch
> WITHOUT the template.

```
Build the starting shell for a web app called [NAME].
Stack: full-stack JavaScript (Next.js + Tailwind) (the starter template is actually TypeScript — that's fine; TypeScript is just JavaScript with types), deployable to a live URL.
The one screen I need first: [DESCRIBE THE MAIN SCREEN — what the user sees and the one action they take].
Keep it minimal. No login yet. Make it run and show me how to preview it.
```

---

## 2 — Intelligence: wire in the AI call (provider-agnostic)

```
Add an AI feature to this app.
When the user [DOES THIS ACTION], send [THIS INPUT] to an LLM and show [THIS OUTPUT].

Important: make the AI call provider-agnostic. Use an OpenAI-compatible client
where the base URL and API key come from environment variables, so I can point it
at OpenAI, Google Gemini's OpenAI-compatible endpoint, or Groq without changing code.
Put the prompt to the model in one clearly-labelled place I can edit.
Use a .env.example with placeholders — never hard-code the key.
```

*Set the env vars to whichever free tier you're using — Gemini (Google AI Studio) and Groq both give generous free keys.*

---

## 3 — Memory: make it remember things

```
Add persistence so [WHAT NEEDS TO BE SAVED] survives a page refresh.
For the MVP, [localStorage is fine] OR [use Supabase — free tier].
Show me how to view the saved data.
```

---

## 4 — Connections: add an outside service

```
Connect [SERVICE — e.g. email, payments, a public API].
When [THIS HAPPENS], the app should [DO THIS via the service].
Use environment variables for any keys, and tell me exactly which account/keys I need.
If this needs a paid account I don't have, suggest a free alternative or a fake/stub for the demo.
```

---

## 5 — Debug: give a good bug report

```
Something's wrong.
What I did: [STEPS].
What I expected: [EXPECTED].
What actually happened: [ACTUAL].
Here's the exact error: [PASTE FULL ERROR].
Find the cause and fix it. Explain the fix in one sentence.
```

---

## 6 — Deploy: get a live URL

```
Deploy this to a public live URL I can share with judges.
Walk me through connecting [Vercel / Netlify] step by step.
After it's live, give me the URL and confirm the AI feature works on the live site, not just locally.
```

---

## 7 — Demo-ready: polish the happy path ONLY

```
This is for a 3-minute pitch demo. Don't add features.
Make the ONE happy path look clean and work reliably end to end:
[DESCRIBE THE EXACT CLICK-PATH you'll show on stage].
Fix anything on that path that looks broken or confusing. Ignore everything else.
```

---

### If your idea outgrows the default
Plain full-stack JS covers most web MVPs. You only need a different stack when one piece breaks the default: a **native mobile app** (Expo/Flutter), a **custom ML model** instead of an API call (Python service), **realtime/multiplayer** (websockets/realtime DB), **heavy data or search** (vector DB / warehouse), or **hardware/IoT**. If that's you, flag your mentor — it's a one-box change, not a rebuild.
