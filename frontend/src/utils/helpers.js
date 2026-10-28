export const fmt = (n) => n.toLocaleString("en-IN");

export function benchStatus({ actual, target }) {
  const ratio = actual / target;
  if (ratio >= 1) return { label: "Ahead", tone: "good" };
  if (ratio >= 0.95) return { label: "On Track", tone: "good" };
  return { label: "Behind", tone: "warn" };
}

export const riskTone = (risk) => (risk === "High" ? "bad" : risk === "Medium" ? "warn" : "good");
export const hazardStatusTone = (s) => (s === "Resolved" ? "good" : s === "Pending" ? "neutral" : "warn");
export const equipmentTone = (s) => (s === "Maintenance" ? "bad" : "good");
