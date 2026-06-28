import type { Measurement } from "@/types/measurement";
import type { DemoRiskFactors } from "@/lib/profile/onboarding-storage";
import { getDefaultDemoRiskFactors } from "@/lib/mock/demo-user";
import { seedDemoMeasurements } from "./generator";

let demoMeasurements: Measurement[] = [];
let cachedFactorsKey: string | null = null;

function factorsKey(factors: DemoRiskFactors): string {
  return JSON.stringify(factors);
}

export function getDemoMeasurements(
  riskFactors: DemoRiskFactors = getDefaultDemoRiskFactors()
): Measurement[] {
  const key = factorsKey(riskFactors);
  if (demoMeasurements.length === 0 || cachedFactorsKey !== key) {
    demoMeasurements = seedDemoMeasurements(30, riskFactors);
    cachedFactorsKey = key;
  }
  return demoMeasurements;
}

export function addDemoMeasurement(measurement: Measurement): Measurement {
  demoMeasurements = [measurement, ...demoMeasurements];
  return measurement;
}

export function getDemoMeasurementById(
  id: string,
  riskFactors: DemoRiskFactors = getDefaultDemoRiskFactors()
): Measurement | undefined {
  return getDemoMeasurements(riskFactors).find((m) => m.id === id);
}

export function resetDemoMeasurements(
  riskFactors: DemoRiskFactors = getDefaultDemoRiskFactors()
): void {
  demoMeasurements = seedDemoMeasurements(30, riskFactors);
  cachedFactorsKey = factorsKey(riskFactors);
}
