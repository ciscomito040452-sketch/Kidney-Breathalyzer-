import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetDemoMeasurements } from "@/lib/mock/demo-store";
import { ingestMeasurement } from "./ingest";

vi.mock("@/lib/profile/effective-risk-factors", () => ({
  getEffectiveRiskFactors: () => ({
    has_diabetes: true,
    has_hypertension: false,
    has_family_history: true,
  }),
}));

describe("ingestMeasurement", () => {
  beforeEach(() => {
    resetDemoMeasurements({
      has_diabetes: true,
      has_hypertension: false,
      has_family_history: true,
    });
  });

  it("returns scored measurement with Thai explanation", () => {
    const result = ingestMeasurement({
      mq135_value: 200,
      mq3_value: 0.25,
      is_mock: true,
    });

    expect(result.id).toBeTruthy();
    expect(result.risk_level).toBeDefined();
    expect(result.ai_explanation).toContain("ระบบประเมินการคัดกรอง");
  });

  it("mentions elevated ammonia when reading is above 280 ppb", () => {
    const result = ingestMeasurement({
      mq135_value: 320,
      mq3_value: 0.35,
      is_mock: true,
    });

    expect(result.ai_explanation).toMatch(/สูงกว่า|ติดต่อกัน|เกณฑ์/);
    expect(result.ai_explanation).toContain("แอมโมเนีย");
  });
});
