// Values that have no backend table yet (sensor readings, blast model constants).
// Everything else (production, equipment, hazards, dashboard totals) comes from the API.

export const SAFETY_STATS = { airflowMs: 2.4 };

export const GAS_READINGS = [
  { label: "Methane (CH4) Level", value: "0.14%", state: "Safe", tone: "good" },
  { label: "Carbon Monoxide (CO)", value: "12 PPM", state: "Normal", tone: "good" },
  { label: "Intake Air Velocity", value: `${SAFETY_STATS.airflowMs} m/s`, state: "", tone: "neutral" },
  { label: "Statutory Alert Threshold", value: "0.75% CH4", state: "", tone: "warn" },
];

// Blast vibration screening model: PPV = K * SD^-beta, SD = distance / sqrt(charge).
// K and BETA are SITE-SPECIFIC: calibrate them from your own blast-monitoring data.
export const BLAST_MODEL = { K: 1140, BETA: 1.6, PPV_LIMIT_MM_S: 10 };
