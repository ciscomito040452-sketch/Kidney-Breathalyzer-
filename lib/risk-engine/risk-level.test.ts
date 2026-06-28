import { describe, expect, it } from "vitest";
import { scoreToRiskLevel } from "@/lib/risk-engine/risk-level";

describe("scoreToRiskLevel", () => {
  it("maps low boundary", () => {
    expect(scoreToRiskLevel(0)).toBe("low");
    expect(scoreToRiskLevel(0.39)).toBe("low");
  });

  it("maps moderate boundary", () => {
    expect(scoreToRiskLevel(0.4)).toBe("moderate");
    expect(scoreToRiskLevel(0.69)).toBe("moderate");
  });

  it("maps high boundary", () => {
    expect(scoreToRiskLevel(0.7)).toBe("high");
    expect(scoreToRiskLevel(1)).toBe("high");
  });
});
