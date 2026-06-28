import { describe, expect, it } from "vitest";
import { shouldShowDoctorCta } from "./should-show-doctor-cta";

describe("shouldShowDoctorCta", () => {
  it("shows primary CTA for high risk", () => {
    expect(shouldShowDoctorCta({ riskLevel: "high" })).toEqual({
      show: true,
      variant: "primary",
    });
  });

  it("shows soft CTA for moderate risk with rising ammonia trend", () => {
    expect(
      shouldShowDoctorCta({
        riskLevel: "moderate",
        ammoniaTrend: "rising",
      })
    ).toEqual({
      show: true,
      variant: "soft",
    });
  });

  it("shows soft CTA for moderate risk with elevated ammonia", () => {
    expect(
      shouldShowDoctorCta({
        riskLevel: "moderate",
        mq135Value: 308,
      })
    ).toEqual({
      show: true,
      variant: "soft",
    });
  });

  it("hides CTA for low risk with stable trend", () => {
    expect(
      shouldShowDoctorCta({
        riskLevel: "low",
        ammoniaTrend: "stable",
        mq135Value: 180,
      })
    ).toEqual({
      show: false,
      variant: "soft",
    });
  });
});
