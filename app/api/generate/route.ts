// ============================================================================
// BOX 2 of 5: LOGIC        (and BOX 3 of 5: INTELLIGENCE lives inside it)
// ----------------------------------------------------------------------------
// This is the app's "back room." The screen (BOX 1) sends the user's text
// here. This file decides what to do, talks to the AI, and sends an answer
// back. The user never sees this code — only its result.
//
// To change WHAT THE APP DOES with the input, edit this file.
// ============================================================================

import OpenAI from "openai";
import { getExternalContext } from "@/lib/connections";

// ----------------------------------------------------------------------------
// BOX 3 of 5: INTELLIGENCE — the AI's personality.
// ----------------------------------------------------------------------------
// This single sentence tells the AI HOW to behave. It is the most important
// thing you can edit. Want a pirate? A lawyer? A meal planner? Change this.
const SYSTEM_PROMPT =
  "You are a friendly, concise assistant for a startup founder. " +
  "Answer in plain English, in 3 sentences or fewer.";

// Read the AI settings from environment variables (see .env.example).
// Because these come from env vars, the SAME code works with OpenAI, Groq,
// Google Gemini, or any OpenAI-compatible provider — you only change the vars.
const AI_BASE_URL = process.env.AI_BASE_URL;
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL;

// This function runs when the screen POSTs to /api/generate.
export async function POST(request: Request) {
  // --- Validate the input. Never trust data coming from outside. ---
  const body = await request.json().catch(() => null);
  const prompt = body?.prompt;

  if (typeof prompt !== "string" || prompt.trim() === "") {
    return Response.json(
      { error: "Please type something first." },
      { status: 400 },
    );
  }

  // --- BOX 5: CONNECTIONS — grab a little extra context from the outside. ---
  // (Optional. If the outside service is down this is just null and we move on.)
  const externalFact = await getExternalContext();

  // --- MOCK MODE ---
  // If no AI key is set, we DON'T crash. We return a friendly fake answer so a
  // beginner can see the whole app work before signing up for any AI provider.
  if (!AI_API_KEY) {
    return Response.json({
      answer:
        `🤖 (mock reply — no AI key set yet) You said: "${prompt}". ` +
        `Add AI_API_KEY in your .env file to get real AI answers.` +
        (externalFact ? `\n\nFun fact I fetched: ${externalFact}` : ""),
    });
  }

  // --- REAL AI CALL (BOX 3: INTELLIGENCE) ---
  try {
    const ai = new OpenAI({ baseURL: AI_BASE_URL, apiKey: AI_API_KEY });

    const completion = await ai.chat.completions.create({
      model: AI_MODEL ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        // Hand the user's question (plus the outside fact, if any) to the AI.
        {
          role: "user",
          content: externalFact
            ? `${prompt}\n\n(Optional context you may use: ${externalFact})`
            : prompt,
        },
      ],
    });

    const answer =
      completion.choices[0]?.message?.content ?? "(The AI returned nothing.)";

    return Response.json({ answer });
  } catch (error) {
    // Show a friendly message to the user; log the detail for ourselves.
    console.error("AI call failed:", error);
    return Response.json(
      { error: "The AI is unavailable right now. Please try again." },
      { status: 502 },
    );
  }
}
