import { describe, expect, it } from "vitest";
import { seedDemoMeasurements } from "@/lib/mock/generator";

describe("seedDemoMeasurements", () => {
  it("seeds exactly 30 measurements", () => {
    const data = seedDemoMeasurements(30);
    expect(data).toHaveLength(30);
  });

  it("uses deterministic ids across runs", () => {
    const first = seedDemoMeasurements(30)[0].id;
    const second = seedDemoMeasurements(30)[0].id;
    expect(first).toBe(second);
    expect(first).toMatch(/^00000000-0000-4000-8000-/);
  });

  it("includes rising trend narrative on latest reading", () => {
    const latest = seedDemoMeasurements(30)[0];
    expect(latest.mq135_value).toBeGreaterThan(350);
    expect(latest.ai_explanation.length).toBeGreaterThan(20);
  });
});
