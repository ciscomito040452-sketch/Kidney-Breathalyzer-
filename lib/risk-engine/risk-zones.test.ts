import { describe, expect, it } from "vitest";
import {
  RISK_ZONE_BOUNDS,
  scorePercent,
  visualMarkerPercent,
  zoneDividerPercents,
} from "./risk-zones";

describe("risk-zones", () => {
  it("scorePercent clamps and rounds", () => {
    expect(scorePercent(0.61)).toBe(61);
    expect(scorePercent(1.2)).toBe(100);
    expect(scorePercent(-0.1)).toBe(0);
  });

  it("zone boundaries match risk-level thresholds", () => {
    expect(RISK_ZONE_BOUNDS.lowMax).toBe(40);
    expect(RISK_ZONE_BOUNDS.moderateMax).toBe(70);
    expect(zoneDividerPercents()).toEqual([40, 70]);
  });

  it("visualMarkerPercent maps scores into equal thirds", () => {
    expect(visualMarkerPercent(0)).toBe(0);
    expect(visualMarkerPercent(0.4)).toBeCloseTo(100 / 3, 1);
    expect(visualMarkerPercent(0.55)).toBeCloseTo(50, 1);
    expect(visualMarkerPercent(0.7)).toBeCloseTo((200 / 3), 1);
    expect(visualMarkerPercent(1)).toBe(100);
  });
});
