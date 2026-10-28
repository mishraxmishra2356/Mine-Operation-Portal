import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import { HAZARDS, SAFETY_STATS } from "../data/mockData";
import { riskTone, hazardStatusTone } from "../utils/helpers";

const COLUMNS = [
  { key: "id", label: "Log ID", className: "cell-id" },
  { key: "area", label: "Location" },
  { key: "hazard", label: "Identified Hazard" },
  { key: "risk", label: "Risk Rating", render: (h) => <Badge tone={riskTone(h.risk)}>{h.risk}</Badge> },
  { key: "action", label: "Control Measure" },
  { key: "status", label: "Status", render: (h) => <Badge tone={hazardStatusTone(h.status)}>{h.status}</Badge> },
];

function Safety() {
  return (
    <DashboardLayout>
      <div className="stats-grid">
        <StatCard icon="🦺" title="LTI Free Days" value={`${SAFETY_STATS.ltiFreeDays} Days`} subtitle="Zero Lost Time Incidents" />
        <StatCard icon="⛰" title="Slope Stability Radar" value="0.18 mm" subtitle="Alarm Level: GREEN (Stable)" />
        <StatCard icon="💨" title="Airway Flow" value={`${SAFETY_STATS.airflowMs} m/s`} subtitle="Ventilation status optimal" />
        <StatCard icon="📋" title="DGMS Compliance" value="100%" subtitle="Statutory inspections cleared" />
      </div>

      <div className="chart-panel section-gap">
        <h3 className="panel-title">Hazard Identification &amp; Risk Assessment (HIRA) Log</h3>
        <DataTable columns={COLUMNS} rows={HAZARDS} />
      </div>
    </DashboardLayout>
  );
}

export default Safety;
