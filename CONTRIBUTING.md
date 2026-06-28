# Contributing to the Impact10x AI Starter

Thanks for improving the Impact10x 3-Day AI Simulator starter.

This template is used by beginners during a fast-paced program, so clarity matters as much as functionality.

## Development workflow

```bash
npm install
cp .env.example .env
npm run dev
```

Leave `AI_API_KEY` blank first and confirm mock mode works. Then optionally add a real provider key to test real AI streaming.

## Before submitting changes

Run:

```bash
npm run build
npx tsc --noEmit
npm run lint
```

Also manually test:

1. The homepage loads.
2. A chat message streams back in mock mode with no API key.
3. The Clear chat button clears the conversation.
4. The app still deploys cleanly to Vercel.

## Five Boxes constraint

Preserve the Five Boxes mental model:

| Box | Purpose | File |
|---|---|---|
| Interface | What the user sees | `app/page.tsx` |
| Logic | Request handling | `app/api/chat/route.ts` |
| Intelligence | AI behaviour | `SYSTEM_PROMPT` in `app/api/chat/route.ts` |
| Memory | Persistence | `lib/memory.ts` |
| Connections | External services/tools | `lib/connections.ts` |

Do not remove the educational comments at the top of these files.

## Pull requests

A good PR should:

- Explain what changed and why.
- Confirm mock mode still works.
- Include screenshots or a short screen recording for UI changes.
- Avoid hardcoded secrets or provider-specific lock-in.
- Keep code approachable for participants with limited coding experience.
