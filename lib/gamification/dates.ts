/** Calendar date key in local timezone (YYYY-MM-DD). */
export function toDateKey(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getUniqueMeasurementDates(
  measuredAtList: string[]
): Set<string> {
  return new Set(measuredAtList.map(toDateKey));
}

/** Monday-start week containing `reference`. */
export function getWeekStart(reference: Date): Date {
  const d = new Date(reference);
  const weekday = d.getDay();
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  d.setDate(d.getDate() - daysFromMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
