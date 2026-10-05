// Replies mark a draft fix by wrapping it in <draft>…</draft>. The real Claude
// system prompt will ask for the same tags.
export type ReplySegment = {
  type: "text" | "draft";
  text: string;
  complete: boolean;  // false while a draft's closing tag hasn't streamed in yet
};

const OPEN = "<draft>";
const CLOSE = "</draft>";

export function splitDrafts(text: string): ReplySegment[] {
  const segments: ReplySegment[] = [];
  let rest = text;

  while (rest.length > 0) {
    const start = rest.indexOf(OPEN);
    if (start === -1) {
      segments.push({ type: "text", text: trimPartialTag(rest), complete: true });
      break;
    }
    if (start > 0) {
      segments.push({ type: "text", text: rest.slice(0, start), complete: true });
    }

    const body = rest.slice(start + OPEN.length);
    const end = body.indexOf(CLOSE);
    if (end === -1) {
      segments.push({ type: "draft", text: body.trim(), complete: false });
      break;
    }
    segments.push({ type: "draft", text: body.slice(0, end).trim(), complete: true });
    rest = body.slice(end + CLOSE.length);
  }

  return segments.filter((s) => s.type === "draft" || s.text.trim() !== "");
}

// Mid-stream, a reply can end in part of an opening tag ("<dra"). Hide it
// until the rest arrives so it doesn't flash on screen.
function trimPartialTag(text: string): string {
  for (let len = OPEN.length - 1; len > 0; len--) {
    if (text.endsWith(OPEN.slice(0, len))) return text.slice(0, -len);
  }
  return text;
}
