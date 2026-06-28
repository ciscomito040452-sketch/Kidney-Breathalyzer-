import { describe, expect, it } from "vitest";
import { getOnboardingDisclaimerSections } from "./onboarding-disclaimer";

describe("getOnboardingDisclaimerSections", () => {
  it("returns five detailed sections in Thai", () => {
    const sections = getOnboardingDisclaimerSections("th");

    expect(sections).toHaveLength(5);
    expect(sections[0].title).toContain("วัตถุประสงค์");
    expect(sections[1].points.some((p) => p.includes("ไม่ใช่อุปกรณ์ทางการแพทย์"))).toBe(
      true
    );
    expect(
      sections[2].points.some((p) => p.includes("ไม่ใช่การวินิจฉัยโรค"))
    ).toBe(false);
    expect(
      sections[2].points.some((p) => p.includes("คัดกรอง"))
    ).toBe(true);
  });

  it("returns English sections when locale is en", () => {
    const sections = getOnboardingDisclaimerSections("en");

    expect(sections[0].title).toBe("Purpose of the system");
    expect(sections[4].id).toBe("privacy");
  });
});
