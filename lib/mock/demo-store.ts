import type { Measurement } from "@/types/measurement";
import { seedDemoMeasurements } from "./generator";

let demoMeasurements: Measurement[] = [];

export function getDemoMeasurements(): Measurement[] {
  if (demoMeasurements.length === 0) {
    demoMeasurements = seedDemoMeasurements(30);
  }
  return demoMeasurements;
}

export function addDemoMeasurement(measurement: Measurement): Measurement {
  demoMeasurements = [measurement, ...demoMeasurements];
  return measurement;
}

export function getDemoMeasurementById(id: string): Measurement | undefined {
  return getDemoMeasurements().find((m) => m.id === id);
}

export function resetDemoMeasurements(): void {
  demoMeasurements = seedDemoMeasurements(30);
}
