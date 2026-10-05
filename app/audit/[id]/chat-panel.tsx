"use client";

import { useEffect, useId, useRef, useState } from "react";
import { splitDrafts } from "@/lib/drafts";
import { ChatContext, ChatMessage } from "@/lib/types";

type Message = ChatMessage & {
  id: string;
  status?: "stopped" | "error";
};

const SUGGESTIONS = [
  "What should I fix first?",
  "Draft a new business description.",
  "Draft a reply to my lowest-rated review.",
];

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export default function ChatPanel({ context }: { context: ChatContext }) {
  const headingId = useId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Keep the newest text in view as it streams in.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  function updateLast(update: (m: Message) => Message) {
    setMessages((prev) => [...prev.slice(0, -1), update(prev[prev.length - 1])]);
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || isStreaming) return;

    // Skip replies that errored or were stopped before any text arrived.
    const history: ChatMessage[] = [
      ...messages.filter((m) => m.content).map(({ role, content }) => ({ role, content })),
      { role: "user", content: question },
    ];
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: question },
      { id: crypto.randomUUID(), role: "assistant", content: "" },
    ]);
    setInput("");
    setIsStreaming(true);
    setAnnouncement("Assistant is replying…");
    inputRef.current?.focus();

    const controller = new AbortController();
    abortRef.current = controller;
    let reply = "";
    let ok = false;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`Chat request failed: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        // stream: true keeps a multi-byte character split across chunks intact.
        // The final decode() with no input flushes any bytes it held back.
        const chunk = done ? decoder.decode() : decoder.decode(value, { stream: true });
        if (chunk) {
          reply += chunk;
          updateLast((m) => ({ ...m, content: m.content + chunk }));
        }
        if (done) break;
      }
      ok = true;
    } catch (error) {
      if (controller.signal.aborted) {
        updateLast((m) => ({ ...m, status: "stopped" }));
        setAnnouncement("Response stopped.");
      } else {
        console.error(error);
        updateLast((m) => ({ ...m, status: "error" }));
        setAnnouncement("Something went wrong. Try again.");
      }
    } finally {
      abortRef.current = null;
      setIsStreaming(false);
      if (ok) setAnnouncement(`Assistant: ${reply.replace(/<\/?draft>/g, "")}`);
      inputRef.current?.focus();
    }
  }

  function stop() {
    abortRef.current?.abort();
    inputRef.current?.focus();
  }

  return (
    <section aria-labelledby={headingId} className="mt-10 rounded border p-4">
      <h2 id={headingId} className="text-xl font-semibold">
        Ask about this audit
      </h2>

      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {messages.length > 0 && (
        <div
          ref={logRef}
          tabIndex={0}
          role="region"
          aria-label="Conversation"
          className={`mt-4 max-h-112 overflow-y-auto rounded bg-gray-50 p-3 ${FOCUS}`}
        >
          <ol aria-busy={isStreaming} className="space-y-4">
            {messages.map((m) => (
              <li key={m.id}>
                <p className="text-sm font-semibold">
                  {m.role === "user" ? "You" : "Assistant"}
                </p>
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <AssistantReply message={m} />
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            disabled={isStreaming}
            className={`rounded-full border px-3 py-1 text-sm disabled:opacity-50 ${FOCUS}`}
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-4"
      >
        <label htmlFor="chat-input" className="block font-medium">
          Your question
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            className={`w-full rounded border p-2 ${FOCUS}`}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className={`rounded bg-black px-4 py-2 text-white disabled:opacity-50 ${FOCUS}`}
          >
            Send
          </button>
          {isStreaming && (
            <button
              type="button"
              onClick={stop}
              className={`rounded border px-4 py-2 ${FOCUS}`}
            >
              Stop
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function AssistantReply({ message }: { message: Message }) {
  return (
    <div className="space-y-2">
      {splitDrafts(message.content).map((segment, i) =>
        segment.type === "text" ? (
          <p key={i} className="whitespace-pre-wrap">
            {segment.text.trim()}
          </p>
        ) : (
          <div key={i} className="rounded border border-gray-400 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Draft</p>
              {segment.complete && <CopyButton text={segment.text} />}
            </div>
            <p className="mt-1 whitespace-pre-wrap">{segment.text}</p>
          </div>
        ),
      )}
      {message.status === "stopped" && (
        <p className="text-sm text-gray-600">Stopped.</p>
      )}
      {message.status === "error" && (
        <p className="text-sm text-red-700">Something went wrong. Try again.</p>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState("Copy");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setLabel("Copied");
    } catch {
      setLabel("Copy failed");
    }
    setTimeout(() => setLabel("Copy"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`rounded border px-2 py-0.5 text-sm ${FOCUS}`}
    >
      {label}
    </button>
  );
}
