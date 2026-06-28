import { describe, expect, it } from "vitest";
import { calculateCurrentStreak } from "@/lib/gamification/streak";
import { toDateKey } from "@/lib/gamification/dates";

describe("calculateCurrentStreak", () => {
  it("returns 0 when no dates", () => {
    expect(calculateCurrentStreak(new Set())).toBe(0);
  });

  it("counts consecutive days including today", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const keys = new Set([toDateKey(today), toDateKey(yesterday)]);
    expect(calculateCurrentStreak(keys, today)).toBe(2);
  });
});
