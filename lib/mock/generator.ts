import { DEMO_USER_ID, MQ135_RANGE, MQ3_RANGE } from "@/lib/constants";
import type { Measurement, RiskLevel } from "@/types/measurement";
import { calculateRiskScore } from "@/lib/risk-engine";
import { generateExplanation } from "@/lib/risk-engine/explanations";
import { getDefaultDemoRiskFactors } from "@/lib/mock/demo-user";

export { DEMO_USER_ID };

function randomInRange(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

/** Seeded PRNG for stable demo data across serverless cold starts */
function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInRangeSeeded(
  rand: () => number,
  min: number,
  max: number
): number {
  return Math.round((min + rand() * (max - min)) * 100) / 100;
}

function demoMeasurementId(dayIndex: number): string {
  return `00000000-0000-4000-8000-${String(dayIndex).padStart(12, "0")}`;
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
  const rand = createSeededRandom(42);

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - 1 - i));

    if (rand() > 0.3) {
      const cycleLevel = DEMO_RISK_CYCLE[i % DEMO_RISK_CYCLE.length];
      const mq135 =
        cycleLevel === "low"
          ? randomInRangeSeeded(rand, 150, 220)
          : cycleLevel === "moderate"
            ? randomInRangeSeeded(rand, 220, 320)
            : randomInRangeSeeded(rand, 320, 400);

      const mq3 =
        cycleLevel === "low"
          ? randomInRangeSeeded(rand, 0.1, 0.3)
          : cycleLevel === "moderate"
            ? randomInRangeSeeded(rand, 0.3, 0.55)
            : randomInRangeSeeded(rand, 0.55, 0.8);

      const { risk_score, risk_level } = calculateRiskScore({
        mq135_value: mq135,
        mq3_value: mq3,
        riskFactors,
      });

      const measured_at = date.toISOString();
      measurements.push({
        id: demoMeasurementId(i),
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
