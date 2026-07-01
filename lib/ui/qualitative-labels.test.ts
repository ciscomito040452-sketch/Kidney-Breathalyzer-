import { describe, expect, it } from "vitest";
import {
  getRiskQualitativeCaption,
  getRiskQualitativeHeadline,
  getSensorQualitativeHeadline,
} from "@/lib/ui/qualitative-labels";

describe("qualitative-labels", () => {
  it("returns Thai risk headlines without diagnosis wording", () => {
    expect(getRiskQualitativeHeadline("th", "low")).toBe("อยู่ในเกณฑ์ดี");
    expect(getRiskQualitativeHeadline("th", "moderate")).toBe("ควรติดตาม");
    expect(getRiskQualitativeHeadline("th", "high")).toBe("ควรปรึกษาแพทย์");
  });

  it("formats score caption with optional delta", () => {
    expect(getRiskQualitativeCaption("th", 0.72)).toContain("72");
    expect(getRiskQualitativeCaption("th", 0.72, 5)).toContain("เพิ่มขึ้น");
  });

  it("uses reference wording for sensors", () => {
    expect(getSensorQualitativeHeadline("th", "normal")).toBe(
      "อยู่ในเกณฑ์อ้างอิง"
    );
    expect(getSensorQualitativeHeadline("th", "elevated")).toBe(
      "สูงกว่าเกณฑ์อ้างอิง"
    );
  });
});
