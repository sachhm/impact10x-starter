// ============================================================================
// BOX 5 of 5: CONNECTIONS
// ----------------------------------------------------------------------------
// THIS IS WHERE YOU CONNECT OUTSIDE SERVICES.
//
// Any time your app needs information from somewhere else on the internet
// (weather, stock prices, a CRM, a payment provider...) the call goes here.
//
// As a simple, free, no-key example we fetch one random cat fact and expose it
// as an AI SDK tool. This demonstrates how a real AI app can call outside
// services on demand instead of only answering from the model's training data.
// ============================================================================

import { tool } from "ai";
import { z } from "zod";

// Ask an outside service for a single fact. If it's down or we're offline,
// we return null and the app simply carries on — an outside service should
// never be allowed to crash your whole app.
export async function getExternalContext(): Promise<string | null> {
  try {
    const response = await fetch("https://catfact.ninja/fact", {
      // Don't wait forever — give up after 4 seconds.
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;

    const data = (await response.json()) as { fact?: string };
    return data.fact ?? null;
  } catch {
    return null;
  }
}

// AI SDK tool wrapper for BOX 5: CONNECTIONS.
// The assistant can call this during a streamed answer when outside context
// would make the reply more useful. Keep the original getExternalContext()
// above so beginners can also call it directly while experimenting.
export const getContextTool = tool({
  description: "Fetches a relevant external fact to add context to the answer",
  parameters: z.object({}),
  execute: async () => {
    const fact = await getExternalContext();
    return { fact: fact ?? "No external context available." };
  },
});
