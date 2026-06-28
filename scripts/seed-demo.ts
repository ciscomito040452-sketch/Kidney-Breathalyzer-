import { seedDemoMeasurements } from "@/lib/mock/generator";

const measurements = seedDemoMeasurements(30);
console.log(`Seeded ${measurements.length} demo measurements`);
console.log("Latest:", measurements[0]?.risk_level, measurements[0]?.measured_at);
