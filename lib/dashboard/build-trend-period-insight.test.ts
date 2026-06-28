import { describe, expect, it } from "vitest";
import { buildTrendPeriodInsight } from "./build-trend-period-insight";
import { seedDemoMeasurements } from "@/lib/mock/generator";

describe("buildTrendPeriodInsight", () => {
  it("returns narrative and next step for demo data", () => {
    const measurements = seedDemoMeasurements(30);
    const insight = buildTrendPeriodInsight(measurements, "th", 30);

    expect(insight).not.toBeNull();
    expect(insight!.narrative.length).toBeGreaterThan(10);
    expect(insight!.latestRiskLabel.length).toBeGreaterThan(0);
    expect(insight!.nextStep.length).toBeGreaterThan(5);
    expect(insight!.recommendationTone).toBeDefined();
  });

  it("returns null when fewer than 2 readings", () => {
    const measurements = seedDemoMeasurements(30).slice(0, 1);
    expect(buildTrendPeriodInsight(measurements, "th", 7)).toBeNull();
  });
});
