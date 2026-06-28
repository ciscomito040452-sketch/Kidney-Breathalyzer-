import { describe, expect, it } from "vitest";
import { computeGamificationStats } from "@/lib/gamification";
import { seedDemoMeasurements } from "@/lib/mock/generator";

describe("seedDemoMeasurements", () => {
  it("seeds a realistic number of measurements within 30 days", () => {
    const data = seedDemoMeasurements(30);
    expect(data.length).toBeGreaterThanOrEqual(14);
    expect(data.length).toBeLessThanOrEqual(35);
  });

  it("uses deterministic ids across runs", () => {
    const first = seedDemoMeasurements(30)[0].id;
    const second = seedDemoMeasurements(30)[0].id;
    expect(first).toBe(second);
    expect(first).toMatch(/^00000000-0000-4000-8000-/);
  });

  it("latest reading shows demo mix: elevated ammonia, normal acetone", () => {
    const latest = seedDemoMeasurements(30)[0];
    expect(latest.mq135_value).toBe(308);
    expect(latest.mq3_value).toBe(0.36);
    expect(Math.round(latest.mq3_value * 500)).toBeLessThan(225);
    expect(latest.risk_score).toBeLessThan(0.95);
    expect(latest.risk_level).toBe("moderate");
    expect(latest.ai_explanation.length).toBeGreaterThan(20);
    expect(latest.ai_explanation).toContain("แอมโมเนีย");
    expect(latest.ai_explanation).not.toContain(
      "อยู่ในแนวโน้มที่ควรติดตามอย่างต่อเนื่อง"
    );
  });

  it("curated last 3 days keep acetone below elevated threshold", () => {
    const data = seedDemoMeasurements(30);
    const curated = data.filter((m) =>
      [308, 288, 268].includes(m.mq135_value)
    );
    expect(curated.length).toBeGreaterThanOrEqual(3);
    for (const m of curated) {
      expect(Math.round(m.mq3_value * 500)).toBeLessThan(225);
    }
    const mq135Values = new Set(curated.map((m) => m.mq135_value));
    expect(mq135Values.has(308)).toBe(true);
    expect(mq135Values.has(288)).toBe(true);
    expect(mq135Values.has(268)).toBe(true);
  });

  it("includes low, moderate, and high risk levels across 30 days", () => {
    const levels = new Set(seedDemoMeasurements(30).map((m) => m.risk_level));
    expect(levels.has("low")).toBe(true);
    expect(levels.has("moderate")).toBe(true);
    expect(levels.has("high")).toBe(true);
  });

  it("produces varied measurement times", () => {
    const data = seedDemoMeasurements(30);
    const times = new Set(
      data.map((m) => {
        const d = new Date(m.measured_at);
        return `${d.getHours()}:${d.getMinutes()}`;
      })
    );
    expect(times.size).toBeGreaterThanOrEqual(3);
  });

  it("produces believable gamification stats", () => {
    const stats = computeGamificationStats(seedDemoMeasurements(30));
    expect(stats.current_streak).toBeLessThanOrEqual(7);
    expect(stats.weekly_count).toBeLessThanOrEqual(14);
    expect(stats.challenge_days.filter(Boolean).length).toBeLessThan(14);
  });
});
