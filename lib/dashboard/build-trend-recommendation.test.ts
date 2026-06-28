import { describe, expect, it } from "vitest";
import { buildTrendRecommendation } from "./build-trend-recommendation";
import { seedDemoMeasurements } from "@/lib/mock/generator";
import { analyzeMeasurements } from "@/lib/ai-insight/analyze-measurements";

describe("buildTrendRecommendation", () => {
  it("recommends doctor visit for high risk with rising trend", () => {
    const rec = buildTrendRecommendation("th", "high", "rising");
    expect(rec.nextStep).toContain("แพทย์");
    expect(rec.tone).toBe("attention");
  });

  it("recommends re-test for moderate risk with rising trend", () => {
    const rec = buildTrendRecommendation("th", "moderate", "rising");
    expect(rec.nextStep).toContain("วัดซ้ำ");
    expect(rec.tone).toBe("attention");
  });

  it("uses reassuring tone for low risk with falling trend", () => {
    const rec = buildTrendRecommendation("th", "low", "falling");
    expect(rec.nextStep).toContain("แนวโน้ม");
    expect(rec.tone).toBe("good");
  });

  it("matches demo latest reading to a contextual recommendation", () => {
    const measurements = seedDemoMeasurements(30);
    const analytics = analyzeMeasurements(measurements)!;
    const rec = buildTrendRecommendation(
      "th",
      measurements[0].risk_level,
      analytics.ammoniaTrend
    );

    expect(rec.nextStep.length).toBeGreaterThan(10);
    expect(rec.nextStep).not.toContain("ควรติดตามใกล้ชิด");
  });
});
