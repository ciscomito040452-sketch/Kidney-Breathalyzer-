import { describe, expect, it } from "vitest";
import { parseInsightSummary } from "./format-insight-display";

describe("format-insight-display", () => {
  it("splits Thai summary into lead, factors, and conclusion", () => {
    const summary =
      "แอมโมเนียในลมหายใจ (308 ppb) สูงกว่าเกณฑ์อ้างอิง ขณะที่อะซิโทน (180 ppb) อยู่ในช่วงปกติ ประกอบกับประวัติโรคเบาหวาน ระบบประเมินความเสี่ยงในระดับปานกลาง";

    const parsed = parseInsightSummary(summary, "th");
    expect(parsed.lead).toContain("แอมโมเนีย");
    expect(parsed.factors).toEqual(["ประกอบกับประวัติโรคเบาหวาน"]);
    expect(parsed.conclusion).toContain("ปานกลาง");
  });
});
