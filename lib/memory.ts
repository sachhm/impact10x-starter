// ============================================================================
// BOX 4 of 5: MEMORY
// ----------------------------------------------------------------------------
// This is where results are SAVED so they survive a page refresh.
//
// By default we use the browser's built-in "localStorage" — a tiny box of
// text that lives inside the user's browser. Zero setup, no database, no key.
//
// To change WHERE things are saved (e.g. a real database), edit this file only.
// ============================================================================

// The shape of one saved result. Both boxes (interface + logic) agree on this.
export type Result = {
  id: string; // a unique label so React can tell rows apart
  prompt: string; // what the user typed
  answer: string; // what the AI replied
};

// The single name of our box in localStorage. Change it and old saves hide.
const STORAGE_KEY = "ai-mvp-results";

// READ everything we've saved so far. Returns an empty list if nothing's there.
export function loadResults(): Result[] {
  // localStorage only exists in the browser, so guard against running on the server.
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Result[]) : [];
  } catch {
    // If the saved text is somehow corrupt, start fresh instead of crashing.
    return [];
  }
}

// SAVE the whole list back into the browser box.
// We always write a brand-new list (never edit the old one in place) — this is
// the "immutable" style: safer and easier to reason about.
export function saveResults(results: Result[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

// ============================================================================
// UPGRADE PATH: swap localStorage for a real Supabase database.
// ----------------------------------------------------------------------------
// When you outgrow the browser box (you want results shared across devices, or
// kept forever), Supabase is the easy next step. The two functions above are
// the ONLY things you'd rewrite — the rest of the app would not change.
//
// See README ("Upgrading MEMORY to Supabase") for the full walkthrough.
//
//   import { createClient } from "@supabase/supabase-js";
//
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//   );
//
//   export async function loadResults(): Promise<Result[]> {
//     const { data } = await supabase
//       .from("results")
//       .select("*")
//       .order("created_at", { ascending: false });
//     return data ?? [];
//   }
//
//   export async function saveResult(result: Result): Promise<void> {
//     await supabase.from("results").insert(result);
//   }
// ============================================================================
