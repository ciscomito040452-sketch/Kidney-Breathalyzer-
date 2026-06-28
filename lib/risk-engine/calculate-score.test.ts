import { describe, expect, it } from "vitest";
import { calculateRiskScore } from "@/lib/risk-engine/calculate-score";

describe("calculateRiskScore", () => {
  it("applies diabetes risk multiplier", () => {
    const without = calculateRiskScore({
      mq135_value: 250,
      mq3_value: 0.4,
      riskFactors: { has_diabetes: false },
    });
    const withDiabetes = calculateRiskScore({
      mq135_value: 250,
      mq3_value: 0.4,
      riskFactors: { has_diabetes: true },
    });

    expect(withDiabetes.risk_score).toBeGreaterThan(without.risk_score);
    expect(withDiabetes.risk_score - without.risk_score).toBeCloseTo(0.1, 5);
  });

  it("caps score at 1", () => {
    const result = calculateRiskScore({
      mq135_value: 400,
      mq3_value: 0.8,
      riskFactors: {
        has_diabetes: true,
        has_hypertension: true,
        has_family_history: true,
      },
      history: [
        { mq135_value: 380, mq3_value: 0.7, measured_at: "2026-01-01" },
        { mq135_value: 390, mq3_value: 0.75, measured_at: "2026-01-02" },
        { mq135_value: 395, mq3_value: 0.78, measured_at: "2026-01-03" },
      ],
    });

    expect(result.risk_score).toBeLessThanOrEqual(1);
  });

  it("adds trend bonus when last 3 readings exceed personal average", () => {
    const history = [
      { mq135_value: 400, mq3_value: 0.7, measured_at: "2026-01-04" },
      { mq135_value: 390, mq3_value: 0.65, measured_at: "2026-01-03" },
      { mq135_value: 380, mq3_value: 0.6, measured_at: "2026-01-02" },
      { mq135_value: 100, mq3_value: 0.1, measured_at: "2026-01-01" },
    ];

    const result = calculateRiskScore({
      mq135_value: 410,
      mq3_value: 0.75,
      history,
    });

    expect(result.trend_bonus).toBe(0.15);
  });
});
