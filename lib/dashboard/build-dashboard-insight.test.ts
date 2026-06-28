import { describe, expect, it } from "vitest";
import { buildDashboardInsight } from "./build-dashboard-insight";
import { seedDemoMeasurements } from "@/lib/mock/generator";

describe("buildDashboardInsight", () => {
  it("returns highlights for ammonia and acetone from latest reading", () => {
    const measurements = seedDemoMeasurements(30);
    const insight = buildDashboardInsight({
      latest: measurements[0],
      measurements,
    });

    expect(insight.highlights.length).toBeGreaterThanOrEqual(3);
    expect(insight.summary.length).toBeGreaterThan(20);
    expect(insight.researchNote).toContain("งานวิจัย");
    expect(insight.suggestion.length).toBeGreaterThan(10);
  });
});
