import { DEMO_USER_ID, MQ135_RANGE, MQ3_RANGE } from "@/lib/constants";
import type { Measurement, RiskLevel } from "@/types/measurement";
import { calculateRiskScore } from "@/lib/risk-engine";
import { generateExplanation } from "@/lib/risk-engine/explanations";
import { getDefaultDemoRiskFactors } from "@/lib/mock/demo-user";

export { DEMO_USER_ID };

function randomInRange(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

export function generateMockSensorValues(): {
  mq135_value: number;
  mq3_value: number;
} {
  return {
    mq135_value: randomInRange(MQ135_RANGE.min, MQ135_RANGE.max),
    mq3_value: randomInRange(MQ3_RANGE.min, MQ3_RANGE.max),
  };
}

const DEMO_RISK_CYCLE: RiskLevel[] = ["low", "moderate", "high"];

export function createMockMeasurement(
  overrides: Partial<Measurement> = {}
): Measurement {
  const { mq135_value, mq3_value } = generateMockSensorValues();
  const riskFactors = getDefaultDemoRiskFactors();
  const { risk_score, risk_level } = calculateRiskScore({
    mq135_value,
    mq3_value,
    riskFactors,
  });

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  return {
    id,
    user_id: DEMO_USER_ID,
    measured_at: now,
    mq135_value,
    mq3_value,
    risk_score,
    risk_level,
    is_mock: true,
    ai_explanation: generateExplanation({
      risk_level,
      mq135_value,
      mq3_value,
      riskFactors,
    }),
    created_at: now,
    ...overrides,
  };
}

export function seedDemoMeasurements(days = 30): Measurement[] {
  const measurements: Measurement[] = [];
  const now = new Date();
  const riskFactors = getDefaultDemoRiskFactors();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - 1 - i));

    if (Math.random() > 0.3) {
      const cycleLevel = DEMO_RISK_CYCLE[i % DEMO_RISK_CYCLE.length];
      const mq135 =
        cycleLevel === "low"
          ? randomInRange(150, 220)
          : cycleLevel === "moderate"
            ? randomInRange(220, 320)
            : randomInRange(320, 400);

      const mq3 =
        cycleLevel === "low"
          ? randomInRange(0.1, 0.3)
          : cycleLevel === "moderate"
            ? randomInRange(0.3, 0.55)
            : randomInRange(0.55, 0.8);

      const { risk_score, risk_level } = calculateRiskScore({
        mq135_value: mq135,
        mq3_value: mq3,
        riskFactors,
      });

      const measured_at = date.toISOString();
      measurements.push({
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        measured_at,
        mq135_value: mq135,
        mq3_value: mq3,
        risk_score,
        risk_level,
        is_mock: true,
        ai_explanation: generateExplanation({
          risk_level,
          mq135_value: mq135,
          mq3_value: mq3,
          riskFactors,
        }),
        created_at: measured_at,
      });
    }
  }

  return measurements.sort(
    (a, b) =>
      new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
  );
}
