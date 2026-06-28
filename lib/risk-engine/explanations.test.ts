import { describe, expect, it } from "vitest";
import { generateExplanation } from "./explanations";

describe("generateExplanation", () => {
  const base = {
    risk_level: "moderate" as const,
    mq135_value: 200,
    mq3_value: 0.3,
  };

  it("describes elevated ammonia when status is elevated", () => {
    const text = generateExplanation({
      ...base,
      mq135_value: 308,
      mq3_value: 0.36,
      ammoniaStatus: "elevated",
      acetoneStatus: "normal",
      ammoniaPpb: 308,
      acetonePpb: 180,
    });
    expect(text).toContain("308 ppb");
    expect(text).toContain("สูงกว่าเกณฑ์อ้างอิง");
    expect(text).toContain("ปานกลาง");
  });

  it("prioritizes consecutive high days over elevated status", () => {
    const text = generateExplanation({
      ...base,
      mq135_value: 308,
      ammoniaStatus: "elevated",
      acetoneStatus: "normal",
      consecutiveHighDays: 3,
      trendPercent: 12,
    });
    expect(text).toContain("ติดต่อกัน 3 วัน");
    expect(text).not.toContain("สูงกว่าเกณฑ์อ้างอิง");
  });

  it("mentions risk factors when provided", () => {
    const text = generateExplanation({
      ...base,
      ammoniaStatus: "normal",
      acetoneStatus: "normal",
      riskFactors: {
        has_diabetes: true,
        has_family_history: true,
      },
    });
    expect(text).toContain("โรคเบาหวาน");
    expect(text).toContain("โรคไตในครอบครัว");
  });

  it("uses generic monitoring text when sensors are normal", () => {
    const text = generateExplanation({
      ...base,
      risk_level: "low",
      ammoniaStatus: "normal",
      acetoneStatus: "normal",
    });
    expect(text).toContain("อยู่ในแนวโน้มที่ควรติดตามอย่างต่อเนื่อง");
    expect(text).toContain("ระดับต่ำ");
  });
});
