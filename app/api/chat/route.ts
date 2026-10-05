import { CHECKS } from "@/lib/checks";
import { ChatRequest } from "@/lib/types";

// Streams a plain-text reply. Everything Claude-specific lives in
// generateReply(); swap its body for the Claude API and nothing else changes.

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!isChatRequest(body)) {
    return new Response("Expected { messages, context }", { status: 400 });
  }

  const stream = toStream(generateReply(body, request.signal));
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// Mock: a canned reply built from the audit, yielded word by word.
async function* generateReply(
  { messages, context }: ChatRequest,
  signal: AbortSignal,
): AsyncGenerator<string> {
  const question = messages[messages.length - 1].content.toLowerCase();
  const reply = mockReply(question, context);

  for (const word of reply.split(/(?<=\s)/)) {
    await sleep(40);
    if (signal.aborted) return;
    yield word;
  }
}

function mockReply(question: string, context: ChatRequest["context"]): string {
  const { business, checks, reviews, score } = context;

  if (question.includes("fix first")) {
    const todo = checks
      .filter((c) => c.status === "fail" || c.status === "warn")
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === "fail" ? -1 : 1;
        return CHECKS[b.id].weight - CHECKS[a.id].weight;
      });
    if (todo.length === 0) {
      return "Every check passed. Keep adding photos and asking for reviews to stay ahead.";
    }
    const lines = todo.map(
      (c, i) => `${i + 1}. ${CHECKS[c.id].label} (${c.status}): ${c.detail}`,
    );
    return `Start with the failing checks, highest weight first:\n\n${lines.join("\n")}`;
  }

  if (question.includes("description")) {
    const where = business.city ? ` in ${business.city}` : "";
    return (
      `Here's a draft description for ${business.name}:\n\n<draft>\n` +
      `${business.name} is a ${business.primaryCategory.toLowerCase() || "local business"}${where}. ` +
      `We focus on clear communication, fair pricing, and work done right the first time. ` +
      `Call us for a free estimate.\n</draft>\n\nEdit it before you use it.`
    );
  }

  if (question.includes("review") || question.includes("reply")) {
    if (reviews.length === 0) return "This listing has no reviews to reply to yet.";
    const review = [...reviews].sort((a, b) => a.rating - b.rating)[0];
    return (
      `The lowest-rated review is ${review.rating} stars from ${review.author}: "${review.text}"\n\n` +
      `Here's a draft reply:\n\n<draft>\n` +
      `Hi ${review.author}, thank you for the feedback. We're sorry we fell short here. ` +
      `Please call us so we can make it right.\n</draft>`
    );
  }

  const count = (status: string) => checks.filter((c) => c.status === status).length;
  const scoreText = score === null ? "no score (every check errored)" : `a score of ${score} / 100`;
  return (
    `${business.name} has ${scoreText}. ${count("pass")} checks passed, ` +
    `${count("warn")} warned, and ${count("fail")} failed. ` +
    `Ask me what to fix first, or for a draft description or review reply.`
  );
}

// Pull-based, so the next chunk is only produced when the client is ready
// for it. cancel() runs when the client aborts and stops the generator.
function toStream(iterator: AsyncGenerator<string>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();
        if (done) controller.close();
        else controller.enqueue(encoder.encode(value));
      } catch (error) {
        controller.error(error);
      }
    },
    async cancel() {
      await iterator.return(undefined);
    },
  });
}

function isChatRequest(body: unknown): body is ChatRequest {
  const b = body as ChatRequest;
  return (
    Array.isArray(b?.messages) &&
    b.messages.length > 0 &&
    b.messages[b.messages.length - 1]?.role === "user" &&
    typeof b.messages[b.messages.length - 1]?.content === "string" &&
    typeof b.context?.business?.name === "string" &&
    Array.isArray(b.context.checks) &&
    Array.isArray(b.context.reviews)
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
