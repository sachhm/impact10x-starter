# AGENTS.md — Impact10x AI Starter

## Project overview

This repository is the starter template for the Impact10x 3-Day AI Simulator. It is used by founders, JCU students, researchers, mentors, and regional innovators to build a small AI MVP quickly and deploy it to Vercel.

The code is intentionally beginner-readable. The educational comments are part of the product, not clutter.

## The Five Boxes architecture

| Box # | Name | File |
|---|---|---|
| 1 | Interface | `app/page.tsx` |
| 2 | Logic | `app/api/chat/route.ts` |
| 3 | Intelligence | `SYSTEM_PROMPT` inside `app/api/chat/route.ts` |
| 4 | Memory | `lib/memory.ts` |
| 5 | Connections | `lib/connections.ts` |

## Key constraints

- Always preserve educational comments.
- Always keep mock mode working when `AI_API_KEY` is blank.
- Never hardcode API keys.
- Keep the Five Boxes mental model intact.
- Keep code beginner-readable, even when adding production-quality features.
- Use shadcn/ui components for interface work.
- Use the Vercel AI SDK (`ai` package), not the raw `openai` package.
- Keep one-click Vercel deployment as the deploy path.

## Commands

```bash
npm run dev      # start local development server
npm run build    # build for production
npm run lint     # lint the app
```

## Environment variables

Copy `.env.example` to `.env` and fill in values as needed.

```bash
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=
AI_MODEL=gpt-4o-mini

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Leave `AI_API_KEY` blank for mock mode. Mock mode must always work.

## AI behaviour

When modifying the AI behaviour, only edit `SYSTEM_PROMPT` in:

```text
app/api/chat/route.ts
```

Do not scatter prompt instructions through UI components or helper files.

## Before finishing changes

Run:

```bash
npm run build
npx tsc --noEmit
npm run lint
```

If you changed chat behaviour, also test the app with `AI_API_KEY` blank to confirm mock streaming still works.
