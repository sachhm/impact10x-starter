// ============================================================================
// BOX 5 of 5: CONNECTIONS
// ----------------------------------------------------------------------------
// THIS IS WHERE YOU CONNECT OUTSIDE SERVICES.
//
// Any time your app needs information from somewhere else on the internet
// (weather, stock prices, a CRM, a payment provider...) the call goes here.
//
// As a simple, free, no-key example we fetch one random cat fact and hand it
// to the AI as a bit of extra context. Swap this for any API you like.
// ============================================================================

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
