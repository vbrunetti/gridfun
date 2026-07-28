import type { ReactNode } from "react";

/**
 * Lightweight inline markup for portfolio copy:
 * - `**bold**` → <strong>
 * - `*italic*` → <em>
 * Bold is matched first so `**…**` is not eaten by the italic rule.
 */
export function InlineText({ text }: { text: string }): ReactNode {
  const parts: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={key++}>{match[1]}</strong>);
    } else {
      parts.push(<em key={key++}>{match[2]}</em>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts.length === 1 ? parts[0] : parts;
}

/** Strip `*` / `**` markers for plain-text contexts (alt, aria). */
export function stripInlineMarkup(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*|\*([^*]+)\*/g, (_, bold, italic) => bold ?? italic);
}
