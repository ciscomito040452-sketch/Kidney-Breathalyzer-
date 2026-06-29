/** Doctor CTA opens guidance sheet — never emergency hotline. */
export const DOCTOR_CTA_ACTION = "guidance-sheet" as const;

export function doctorCtaUsesPhoneLink(): boolean {
  return false;
}
