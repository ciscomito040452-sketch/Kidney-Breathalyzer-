import { seedDemoMeasurements } from "@/lib/mock/generator";

const measurements = seedDemoMeasurements(30);
const levels = new Set(measurements.map((m) => m.risk_level));

console.log(`Demo seed: ${measurements.length} measurements`);
console.log("Risk levels:", [...levels].join(", "));
console.log("Latest:", {
  risk_level: measurements[0]?.risk_level,
  mq135: measurements[0]?.mq135_value,
  mq3: measurements[0]?.mq3_value,
  measured_at: measurements[0]?.measured_at,
});
console.log("AI excerpt:", measurements[0]?.ai_explanation.slice(0, 120));
