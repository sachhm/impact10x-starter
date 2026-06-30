// ============================================================================
// BOX 4 of 5: MEMORY
// ----------------------------------------------------------------------------
// This is where conversation history is SAVED so it survives a page refresh.
//
// By default we use the browser's built-in "localStorage" — a tiny box of
// text that lives inside the user's browser. Zero setup, no database, no key.
//
// To change WHERE things are saved (e.g. a real database), edit this file only.
// ============================================================================

import type { Message } from "ai";

// The single name of our box in localStorage. Change it and old saves hide.
export const STORAGE_KEY = "impact10x-chat-messages";
export const SESSION_KEY = "impact10x-session-id";

// Both functions below are ASYNC (they return a Promise). The browser version
// doesn't really need to wait for anything, but a real database WOULD — so we
// keep the same async shape here. That's what makes the Supabase swap below a
// genuine drop-in: the rest of the app already `await`s these.

// A small helper used by the optional Supabase version too. It gives this
// browser one stable session id so a whole chat can be saved as one row.
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server-session";

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const next = crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, next);
  return next;
}

// localStorage stores text, so dates come back as strings after JSON.parse().
// The AI SDK expects Date objects for createdAt, so we gently rebuild them.
function normaliseMessage(message: Message): Message {
  return {
    ...message,
    createdAt: message.createdAt ? new Date(message.createdAt) : undefined,
  };
}

// READ the full saved conversation. Returns an empty list if nothing's there.
export async function loadMessages(): Promise<Message[]> {
  // localStorage only exists in the browser, so guard against running on the server.
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const messages = raw ? (JSON.parse(raw) as Message[]) : [];
    return messages.map(normaliseMessage);
  } catch {
    // If the saved text is somehow corrupt, start fresh instead of crashing.
    return [];
  }
}

// SAVE the whole conversation back into the browser box.
// We always write a brand-new list (never edit the old one in place) — this is
// the "immutable" style: safer and easier to reason about.
export async function saveMessages(messages: Message[]): Promise<void> {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export async function clearMessages(): Promise<void> {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

// ============================================================================
// UPGRADE PATH: swap localStorage for a real Supabase database.
// ----------------------------------------------------------------------------
// When you outgrow the browser box (you want chats shared across devices, or
// kept forever), Supabase is the easy next step. The two functions above are
// the ONLY things you'd swap — the rest of the app would not change.
//
// See README ("Upgrading MEMORY to Supabase") for the full walkthrough.
//
// 1) Install is already included in package.json:
//      npm install @supabase/supabase-js
//
// 2) Comment out the localStorage loadMessages/saveMessages above.
//
// 3) Uncomment this block:
//
//   import { createClient } from "@supabase/supabase-js";
//
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   );
//
//   export async function loadMessages(): Promise<Message[]> {
//     if (typeof window === "undefined") return [];
//     const id = getOrCreateSessionId();
//
//     const { data, error } = await supabase
//       .from("chat_sessions")
//       .select("messages")
//       .eq("id", id)
//       .maybeSingle();
//
//     if (error) {
//       console.error("Could not load Supabase chat session:", error);
//       return [];
//     }
//
//     const messages = (data?.messages ?? []) as Message[];
//     return messages.map(normaliseMessage);
//   }
//
//   export async function saveMessages(messages: Message[]): Promise<void> {
//     if (typeof window === "undefined") return;
//     const id = getOrCreateSessionId();
//
//     const { error } = await supabase.from("chat_sessions").upsert({
//       id,
//       messages,
//       updated_at: new Date().toISOString(),
//     });
//
//     if (error) {
//       console.error("Could not save Supabase chat session:", error);
//     }
//   }
// ============================================================================
