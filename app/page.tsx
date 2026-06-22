// ============================================================================
// BOX 1 of 5: INTERFACE
// ----------------------------------------------------------------------------
// This is the ONLY screen the user sees: a text box, a button, and the list
// of past answers. If you want to change WHAT THE USER SEES (wording, colours,
// layout), this is the file to edit.
// ============================================================================

"use client"; // tells Next.js this screen runs in the browser (it has buttons)

import { useEffect, useState } from "react";
import { loadResults, saveResults, type Result } from "@/lib/memory";

export default function Home() {
  // --- The app's live state (what's on screen right now) ---
  const [input, setInput] = useState(""); // text in the box
  const [results, setResults] = useState<Result[]>([]); // past answers
  const [loading, setLoading] = useState(false); // is the AI thinking?
  const [error, setError] = useState(""); // any message to show the user

  // When the screen first loads, pull saved answers out of MEMORY (BOX 4).
  useEffect(() => {
    loadResults().then(setResults);
  }, []);

  // Runs when the user clicks "Ask".
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // stop the browser from reloading the page
    setError("");

    const prompt = input.trim();
    if (!prompt) return;

    setLoading(true);
    try {
      // Send the text to LOGIC (BOX 2) and wait for the answer.
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Something went wrong.");

      // Build a brand-new list with the new answer on top (immutable style),
      // then save it to MEMORY (BOX 4) so it survives a refresh.
      const next: Result[] = [
        {
          id: crypto.randomUUID(),
          prompt,
          answer: data.answer,
          created_at: new Date().toISOString(),
        },
        ...results,
      ];
      setResults(next);
      await saveResults(next);
      setInput(""); // clear the box for the next question
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">AI Assistant</h1>
      <p className="mt-1 text-gray-600">
        Type something and the AI will reply. Answers are saved automatically.
      </p>

      {/* The text box + button */}
      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 px-5 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {/* Error message, only shown when there is one */}
      {error && <p className="mt-3 text-red-600">{error}</p>}

      {/* The list of past answers (newest first) */}
      <ul className="mt-8 space-y-4">
        {results.map((r) => (
          <li key={r.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="font-medium">{r.prompt}</p>
            <p className="mt-1 whitespace-pre-wrap text-gray-700">{r.answer}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
