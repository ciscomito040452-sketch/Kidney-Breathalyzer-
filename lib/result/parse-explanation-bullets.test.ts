import { describe, expect, it } from "vitest";
import { parseExplanationBullets } from "./parse-explanation-bullets";

describe("parseExplanationBullets", () => {
  it("splits on em dash separators used in Thai explanations", () => {
    const text =
      "แอมโมเนียในลมหายใจ (308 ppb) สูงกว่าเกณฑ์อ้างอิง — ระบบประเมินการคัดกรองความเสี่ยงโรคไตในระดับปานกลาง — ควรติดตามและพิจารณาปรึกษาแพทย์หากค่ายังสูง";
    const bullets = parseExplanationBullets(text);
    expect(bullets.length).toBeGreaterThanOrEqual(2);
    expect(bullets[0]).toContain("แอมโมเนีย");
  });

  it("returns single item when no split points", () => {
    expect(parseExplanationBullets("ข้อความเดียว")).toEqual(["ข้อความเดียว"]);
  });
});
