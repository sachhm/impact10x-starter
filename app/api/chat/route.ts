// ============================================================================
// BOX 2 of 5: LOGIC        (and BOX 3 of 5: INTELLIGENCE lives inside it)
// ----------------------------------------------------------------------------
// This is the app's "back room." The screen (BOX 1) sends the user's chat
// history here. This file decides what to do, streams the AI's answer, and
// sends it back. The user never sees this code — only its result.
//
// To change WHAT THE APP DOES with the input, edit this file.
// ============================================================================

import {
  convertToCoreMessages,
  createDataStreamResponse,
  streamText,
  type CoreMessage,
  type Message,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getExternalContext, getContextTool } from "@/lib/connections";

// ----------------------------------------------------------------------------
// BOX 3 of 5: INTELLIGENCE — the AI's personality.
// ----------------------------------------------------------------------------
// This single sentence tells the AI HOW to behave. It is the most important
// thing you can edit. Want a pirate? A lawyer? A meal planner? Change this.
const SYSTEM_PROMPT =
  "You are a friendly, concise assistant for a startup founder. Answer in plain English, in 3 sentences or fewer.";

// Read the AI settings from environment variables (see .env.example).
// Because these come from env vars, the SAME code works with OpenAI, Groq,
// Google Gemini, or any OpenAI-compatible provider — you only change the vars.
const AI_BASE_URL = process.env.AI_BASE_URL;
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL ?? "gpt-4o-mini";

export const maxDuration = 30;

function lastUserText(messages: Message[]): string {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  return lastUserMessage?.content?.trim() ?? "";
}

function mockStream(text: string): Response {
  // The AI SDK data-stream protocol sends text chunks as lines like:
  //   0:"hello"
  // We write several small chunks so mock mode still visibly streams.
  return createDataStreamResponse({
    async execute(dataStream) {
      const chunks = text.match(/.{1,24}(\s|$)/g) ?? [text];
      for (const chunk of chunks) {
        dataStream.write(`0:${JSON.stringify(chunk)}\n`);
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
    },
  });
}

// This function runs when the screen POSTs to /api/chat.
export async function POST(request: Request) {
  // --- Validate the input. Never trust data coming from outside. ---
  const body = await request.json().catch(() => null);
  const messages = body?.messages;

  if (!Array.isArray(messages)) {
    return Response.json(
      { error: "Please send a messages array." },
      { status: 400 },
    );
  }

  const prompt = lastUserText(messages as Message[]);
  if (!prompt) {
    return Response.json(
      { error: "Please type something first." },
      { status: 400 },
    );
  }

  // --- MOCK MODE ---
  // If no AI key is set, we DON'T crash. We return a friendly fake answer so a
  // beginner can see the whole app work before signing up for any AI provider.
  if (!AI_API_KEY) {
    // --- BOX 5: CONNECTIONS — grab a little extra context from the outside. ---
    // (Optional. If the outside service is down this is just null and we move on.)
    const externalFact = await getExternalContext();
    return mockStream(
      `🤖 (mock reply — no AI key set yet) You said: "${prompt}". ` +
        `Add AI_API_KEY in your .env file to get real streamed AI answers.` +
        (externalFact ? `\n\nFun fact I fetched: ${externalFact}` : ""),
    );
  }

  // --- REAL AI CALL (BOX 3: INTELLIGENCE) ---
  try {
    const providerConfig = { baseURL: AI_BASE_URL, apiKey: AI_API_KEY };
    const openai = createOpenAI(providerConfig);
    const coreMessages: CoreMessage[] = convertToCoreMessages(messages);

    const result = streamText({
      model: openai(AI_MODEL),
      system: SYSTEM_PROMPT,
      messages: coreMessages,
      tools: {
        // BOX 5: CONNECTIONS — this is the real integration pattern.
        getContext: getContextTool,
      },
      maxSteps: 2,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    // Show a friendly message to the user; log the detail for ourselves.
    console.error("AI call failed:", error);
    return Response.json(
      { error: "The AI is unavailable right now. Please try again." },
      { status: 502 },
    );
  }
}
