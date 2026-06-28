import { describe, expect, it } from "vitest";
import { buildDashboardInsight } from "@/lib/dashboard/build-dashboard-insight";
import { getDefaultDemoRiskFactors } from "@/lib/mock/demo-user";
import { seedDemoMeasurements } from "@/lib/mock/generator";
import { buildResultExplanation } from "@/lib/result/build-result-explanation";

describe("result explanation parity", () => {
  it("matches dashboard insight summary for latest demo reading", () => {
    const riskFactors = getDefaultDemoRiskFactors();
    const measurements = seedDemoMeasurements(30, riskFactors);
    const latest = measurements[0];

    const dashboardInsight = buildDashboardInsight({
      latest,
      measurements,
      riskFactors,
      locale: "th",
    });

    const resultExplanation = buildResultExplanation({
      measurement: latest,
      measurements,
      riskFactors,
      locale: "th",
    });

    expect(resultExplanation).toBe(dashboardInsight.summary);
    expect(resultExplanation).toContain("แอมโมเนีย");
    expect(resultExplanation).toContain("คัดกรองความเสี่ยงโรคไต");
  });
});
