import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import { FLEET, FLEET_SUMMARY as F } from "../data/mockData";
import { equipmentTone } from "../utils/helpers";

const COLUMNS = [
  { key: "id", label: "Unit ID", className: "cell-id" },
  { key: "type", label: "Equipment Type" },
  { key: "location", label: "Current Location" },
  { key: "operator", label: "Operator" },
  { key: "fuel", label: "Fuel / Battery" },
  { key: "status", label: "Status", render: (r) => <Badge tone={equipmentTone(r.status)}>{r.status}</Badge> },
];

const pct = (a, t) => `${Math.round((a / t) * 100)}% Availability`;

function Equipment() {
  return (
    <DashboardLayout>
      <div className="stats-grid">
        <StatCard icon="🚜" title="Shovels Active" value={`${F.shovelsActive} / ${F.shovelsTotal}`} subtitle={pct(F.shovelsActive, F.shovelsTotal)} />
        <StatCard icon="🚛" title="Dumpers Active" value={`${F.dumpersActive} / ${F.dumpersTotal}`} subtitle={`${F.dumpersTotal - F.dumpersActive} in Workshop`} />
        <StatCard icon="⚙" title="Fleet OEE" value="91.4%" subtitle="Overall Equipment Effectiveness" />
        <StatCard icon="⛽" title="Mean Time To Repair" value="1.8 hrs" subtitle="Maintenance KPI" />
      </div>

      <div className="chart-panel section-gap">
        <h3 className="panel-title">Live Heavy Earth Moving Machinery (HEMM) Tracking</h3>
        <DataTable columns={COLUMNS} rows={FLEET} />
      </div>
    </DashboardLayout>
  );
}

export default Equipment;
