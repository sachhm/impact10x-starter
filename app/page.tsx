// ============================================================================
// BOX 1 of 5: INTERFACE
// ----------------------------------------------------------------------------
// This is the ONLY screen the user sees: the chat, the input, and the controls.
// If you want to change WHAT THE USER SEES (wording, colours, layout), this is
// the file to edit.
//
// BOX 2: LOGIC lives in app/api/chat/route.ts.
// BOX 3: INTELLIGENCE is SYSTEM_PROMPT inside app/api/chat/route.ts.
// BOX 4: MEMORY lives in lib/memory.ts.
// BOX 5: CONNECTIONS lives in lib/connections.ts.
// ============================================================================

"use client"; // tells Next.js this screen runs in the browser (it has buttons)

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, RotateCcw, Send } from "lucide-react";
import { useChat, type Message } from "ai/react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { clearMessages, loadMessages, saveMessages } from "@/lib/memory";

const MAX_CHARS = 500;

function messageText(message: Message): string {
  if (message.parts?.length) {
    return message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");
  }

  return message.content;
}

function formatTime(value?: Date): string {
  const date = value instanceof Date ? value : value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1" aria-label="Assistant is typing">
      <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 [animation-delay:300ms]" />
    </div>
  );
}

export default function Home() {
  const [hasLoadedSavedChat, setHasLoadedSavedChat] = useState(false);
  const chatMessagesRef = useRef<Message[]>([]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    setMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages: [],
    maxSteps: 2,
    onFinish: () => {
      // Save after the streamed assistant message has landed in useChat state.
      window.setTimeout(() => {
        void saveMessages(chatMessagesRef.current);
      }, 0);
    },
  });

  const overLimit = input.length > MAX_CHARS;
  const canSubmit = input.trim().length > 0 && !overLimit && !isLoading;
  const lastMessage = messages.at(-1);
  const showSkeleton = isLoading && lastMessage?.role === "user";

  useEffect(() => {
    chatMessagesRef.current = messages;
  }, [messages]);

  // When the screen first loads, pull saved conversation history out of MEMORY (BOX 4).
  useEffect(() => {
    let cancelled = false;

    async function restoreChat() {
      const saved = await loadMessages();
      if (!cancelled) {
        setMessages(saved);
        setHasLoadedSavedChat(true);
      }
    }

    void restoreChat();

    return () => {
      cancelled = true;
    };
  }, [setMessages]);

  const helperText = useMemo(() => {
    if (overLimit) return "Shorten your question before sending.";
    if (isLoading) return "The assistant is replying...";
    return "Mock mode works even when AI_API_KEY is blank.";
  }, [isLoading, overLimit]);

  async function copyMessage(text: string) {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  async function clearChat() {
    setMessages([]);
    await clearMessages();
    toast.success("Chat cleared");
  }

  function submitIfAllowed(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    handleSubmit(event);
  }

  return (
    <main className="flex min-h-[calc(100dvh-73px)] flex-col bg-zinc-50">
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 pb-36 sm:px-6 lg:px-8">
        <Card className="flex min-h-[60dvh] flex-1 flex-col border-zinc-200 shadow-sm">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">AI Assistant</CardTitle>
                  <Badge variant="secondary">Five Boxes</Badge>
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  Ask startup, pitch, customer, and product questions. Answers stream in real time.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearChat}
                disabled={!messages.length}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear chat
              </Button>
            </div>
            <Separator />
          </CardHeader>

          <CardContent className="min-h-0 flex-1">
            <ScrollArea className="h-[calc(100dvh-270px)] min-h-[380px] pr-4">
              {!hasLoadedSavedChat ? (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                  Loading saved chat...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-white p-8 text-center">
                  <div>
                    <p className="text-lg font-semibold text-zinc-900">
                      Hi! I&apos;m your AI assistant for the Impact10x simulator.
                    </p>
                    <p className="mt-2 text-sm text-zinc-600">
                      Type your first question to get started.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pb-4" role="log" aria-live="polite">
                  {messages.map((message) => {
                    const text = messageText(message);
                    const isUser = message.role === "user";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <article
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[72%] ${
                            isUser
                              ? "bg-zinc-900 text-white"
                              : "border border-zinc-200 bg-zinc-100 text-zinc-900"
                          }`}
                        >
                          <div className="whitespace-pre-wrap leading-6">{text}</div>
                          <div
                            className={`mt-2 flex items-center gap-2 text-xs ${
                              isUser ? "text-zinc-300" : "text-zinc-500"
                            }`}
                          >
                            <time>{formatTime(message.createdAt)}</time>
                            {!isUser && text && (
                              <button
                                type="button"
                                onClick={() => void copyMessage(text)}
                                className="inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                                aria-label="Copy assistant message"
                              >
                                <Copy className="h-3 w-3" />
                                Copy
                              </button>
                            )}
                          </div>
                        </article>
                      </div>
                    );
                  })}

                  {showSkeleton && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-3 shadow-sm">
                        <TypingDots />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      <section className="fixed inset-x-0 bottom-0 border-t border-zinc-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur">
        <div className="mx-auto max-w-4xl">
          {error && (
            <Alert variant="destructive" className="mb-3">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-3">
                <span>The assistant could not reply.</span>
                {/* reload() re-sends the last message — no need to retype it. */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void reload()}
                  disabled={isLoading}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={submitIfAllowed} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your idea, customers, pitch, or next step..."
              maxLength={MAX_CHARS + 100}
              aria-label="Chat message"
              className="h-11"
            />
            <Button type="submit" disabled={!canSubmit} className="h-11 px-4">
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </form>

          <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
            <span className={overLimit ? "text-red-600" : undefined}>{helperText}</span>
            <span className={overLimit ? "font-medium text-red-600" : undefined}>
              {input.length} / {MAX_CHARS}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
