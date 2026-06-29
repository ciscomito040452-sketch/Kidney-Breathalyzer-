/**
 * Split rule-based explanation into scannable bullets for Result UI.
 */
export function parseExplanationBullets(explanation: string): string[] {
  const trimmed = explanation.trim();
  if (!trimmed) return [];

  const byEmDash = trimmed
    .split(/\s+—\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (byEmDash.length >= 2) return byEmDash;

  const assessIdx = trimmed.search(
    /ระบบประเมิน|Kidney disease screening risk is assessed/
  );
  if (assessIdx > 0) {
    const lead = trimmed.slice(0, assessIdx).trim();
    const verdict = trimmed.slice(assessIdx).trim();
    return [lead, verdict].filter(Boolean);
  }

  const bySentence = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (bySentence.length >= 2) return bySentence;

  return [trimmed];
}
