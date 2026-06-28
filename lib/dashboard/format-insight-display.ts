import type { AppLocale } from "@/lib/preferences/profile-preferences";

export interface ParsedSummary {
  lead: string;
  factors: string[];
  conclusion: string;
}

export function parseInsightSummary(
  summary: string,
  locale: AppLocale
): ParsedSummary {
  if (locale === "en") {
    const conclusionPatterns = [
      /Overall screening risk is assessed as [^.]+\./,
      /Overall screening risk is assessed as .+$/,
    ];
    let conclusion = "";
    for (const pattern of conclusionPatterns) {
      const match = summary.match(pattern);
      if (match) {
        conclusion = match[0].trim();
        break;
      }
    }
    const rest = conclusion
      ? summary.replace(conclusion, "").trim()
      : summary;
    return { lead: rest || summary, factors: [], conclusion };
  }

  const conclusionMatch = summary.match(/ระบบประเมินความเสี่ยง[^]+$/);
  const conclusion = conclusionMatch?.[0]?.trim() ?? "";
  const body = conclusion
    ? summary.slice(0, summary.indexOf(conclusion)).trim()
    : summary;

  const factors = body
    .split(/(?=ประกอบกับ)/)
    .filter((part) => part.startsWith("ประกอบกับ"))
    .map((part) => part.trim());

  const lead = body
    .replace(/ประกอบกับ[^]+/g, "")
    .trim();

  return {
    lead: lead || body || summary,
    factors,
    conclusion,
  };
}
