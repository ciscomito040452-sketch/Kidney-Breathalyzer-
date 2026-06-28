import { describe, expect, it } from "vitest";
import { buildHolisticInsight } from "./build-holistic-insight";
import { analyzeMeasurements } from "./analyze-measurements";
import { seedDemoMeasurements } from "@/lib/mock/generator";

describe("analyzeMeasurements", () => {
  it("aggregates all demo measurements", () => {
    const measurements = seedDemoMeasurements(30);
    const analytics = analyzeMeasurements(measurements);

    expect(analytics).not.toBeNull();
    expect(analytics!.count).toBeGreaterThan(10);
    expect(analytics!.daySpan).toBeGreaterThanOrEqual(7);
    expect(analytics!.avgRiskScore).toBeGreaterThan(0);
    expect(analytics!.avgMq135).toBeGreaterThan(0);
  });
});

describe("buildHolisticInsight", () => {
  it("builds narrative from full history, not latest only", () => {
    const measurements = seedDemoMeasurements(30);
    const insight = buildHolisticInsight({
      measurements,
      locale: "th",
    });

    expect(insight).not.toBeNull();
    expect(insight!.summary).toContain("จากการวัด");
    expect(insight!.summary).not.toContain(measurements[0].ai_explanation);
    expect(insight!.highlights.length).toBeGreaterThanOrEqual(4);
    expect(insight!.periodCaption).toMatch(/\d+/);
    expect(insight!.researchNote).toContain("งานวิจัย");
    expect(insight!.trendNarrative.length).toBeGreaterThan(10);
  });

  it("returns English copy when locale is en", () => {
    const measurements = seedDemoMeasurements(30);
    const insight = buildHolisticInsight({
      measurements,
      locale: "en",
    });

    expect(insight!.summary).toContain("Across");
    expect(insight!.researchNote).toContain("Breath research");
  });
});
