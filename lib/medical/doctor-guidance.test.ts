import { describe, expect, it } from "vitest";
import {
  DOCTOR_CTA_ACTION,
  doctorCtaUsesPhoneLink,
} from "./doctor-guidance";

describe("doctor guidance", () => {
  it("does not use emergency phone link", () => {
    expect(doctorCtaUsesPhoneLink()).toBe(false);
    expect(DOCTOR_CTA_ACTION).toBe("guidance-sheet");
  });
});
