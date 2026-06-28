import { describe, expect, it } from "vitest";
import { computeGamificationStats } from "@/lib/gamification";
import { seedDemoMeasurements } from "@/lib/mock/generator";

describe("seedDemoMeasurements", () => {
  it("seeds a realistic number of measurements within 30 days", () => {
    const data = seedDemoMeasurements(30);
    expect(data.length).toBeGreaterThanOrEqual(14);
    expect(data.length).toBeLessThanOrEqual(28);
  });

  it("uses deterministic ids across runs", () => {
    const first = seedDemoMeasurements(30)[0].id;
    const second = seedDemoMeasurements(30)[0].id;
    expect(first).toBe(second);
    expect(first).toMatch(/^00000000-0000-4000-8000-/);
  });

  it("latest reading is high but not maxed out", () => {
    const latest = seedDemoMeasurements(30)[0];
    expect(latest.mq135_value).toBeLessThan(330);
    expect(latest.risk_score).toBeLessThan(0.95);
    expect(latest.risk_level).toBe("high");
    expect(latest.ai_explanation.length).toBeGreaterThan(20);
  });

  it("produces believable gamification stats", () => {
    const stats = computeGamificationStats(seedDemoMeasurements(30));
    expect(stats.current_streak).toBeLessThanOrEqual(7);
    expect(stats.weekly_count).toBeLessThanOrEqual(7);
    expect(stats.challenge_days.filter(Boolean).length).toBeLessThan(14);
  });
});
