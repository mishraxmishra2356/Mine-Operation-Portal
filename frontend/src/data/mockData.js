// Single source of truth for demo data. Replace these exports with API calls
// (see src/utils/helpers.js and the backend plan) once the server exists.

export const SHIFTS = [
  { name: "Shift A (Morning)", tonnes: 14200 },
  { name: "Shift B (Evening)", tonnes: 12800 },
  { name: "Shift C (Night)", tonnes: 9500 },
];

export const SAFETY_STATS = { ltiFreeDays: 142, airflowMs: 2.4 };

export const FLEET_SUMMARY = { shovelsActive: 6, shovelsTotal: 6, dumpersActive: 22, dumpersTotal: 26 };

export const GAS_READINGS = [
  { label: "Methane (CH4) Level", value: "0.14%", state: "Safe", tone: "good" },
  { label: "Carbon Monoxide (CO)", value: "12 PPM", state: "Normal", tone: "good" },
  { label: "Intake Air Velocity", value: `${SAFETY_STATS.airflowMs} m/s`, state: "", tone: "neutral" },
  { label: "Statutory Alert Threshold", value: "0.75% CH4", state: "", tone: "warn" },
];

export const BENCHES = [
  { id: "B1", bench: "Bench 1 (Top Overburden)", material: "Sandstone / OB", unit: "m³", target: 18000, actual: 17400 },
  { id: "B2", bench: "Bench 2 (Mid Overburden)", material: "Shale", unit: "m³", target: 12000, actual: 12800 },
  { id: "B3", bench: "Bench 3 (Coal Seam Top)", material: "Grade G-11 Coal", unit: "T", target: 20000, actual: 19200 },
  { id: "B4", bench: "Bench 4 (Coal Seam Bottom)", material: "Grade G-9 Coal", unit: "T", target: 16500, actual: 17300 },
];

export const FLEET = [
  { id: "SH-01", type: "Electric Rope Shovel (20m³)", location: "Bench 3 Coal", operator: "R. Sharma", fuel: "94% Grid", status: "Operating" },
  { id: "SH-02", type: "Hydraulic Excavator (12m³)", location: "Bench 1 OB", operator: "V. Kumar", fuel: "78% Diesel", status: "Operating" },
  { id: "DT-101", type: "CAT 777E Dumper (100T)", location: "Haul Road North", operator: "A. Singh", fuel: "65%", status: "Hauling" },
  { id: "DT-104", type: "CAT 777E Dumper (100T)", location: "Pit Crusher Hopper", operator: "M. Patel", fuel: "82%", status: "Dumping" },
  { id: "DZ-05", type: "Crawler Dozer (D375A)", location: "OB Dump Yard 2", operator: "K. Das", fuel: "40%", status: "Spreading" },
  { id: "DT-108", type: "CAT 777E Dumper (100T)", location: "Central Workshop", operator: "—", fuel: "—", status: "Maintenance" },
];

export const HAZARDS = [
  { id: "HZ-401", area: "Highwall Sector 2B", hazard: "Tension crack detected by SSR radar", risk: "Medium", action: "15m berm setback enforced", status: "Active Control" },
  { id: "HZ-398", area: "Haul Road Ramp 3", hazard: "Excessive fugitive dust reducing visibility", risk: "Low", action: "Water bowsers dispatched", status: "Resolved" },
  { id: "HZ-395", area: "Substation 33kV", hazard: "Earthing pit resistance check due", risk: "Low", action: "Electrical safety audit booked", status: "Pending" },
];

// Blast vibration screening model: PPV = K * SD^-beta, SD = distance / sqrt(charge).
// K and BETA are SITE-SPECIFIC: calibrate them from your own blast-monitoring data.
export const BLAST_MODEL = { K: 1140, BETA: 1.6, PPV_LIMIT_MM_S: 10 };
