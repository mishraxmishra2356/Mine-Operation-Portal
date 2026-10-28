import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import DataState from "../components/DataState";
import { useApi } from "../hooks/useApi";
import { benchStatus, fmt } from "../utils/helpers";

const COLUMNS = [
  { key: "bench", label: "Bench Location", className: "cell-strong" },
  { key: "material", label: "Material Type" },
  { key: "target", label: "Shift Target", render: (r) => `${fmt(r.target)} ${r.unit}` },
  { key: "actual", label: "Actual Excavated", className: "cell-actual", render: (r) => `${fmt(r.actual)} ${r.unit}` },
  {
    key: "status",
    label: "Status",
    render: (r) => {
      const s = benchStatus(r);
      return <Badge tone={s.tone}>{s.label}</Badge>;
    },
  },
];

function Production() {
  const { data: benches, error, loading } = useApi("/production/benches");

  return (
    <DashboardLayout>
      <div className="stats-grid">
        <StatCard icon="📦" title="Monthly Tonnage" value="842,000 T" subtitle="Annual Target: 10.5 MT" />
        <StatCard icon="⚖" title="Current Strip Ratio" value="3.4 : 1" subtitle="Overburden (m³) to Mineral (T)" />
        <StatCard icon="⏱" title="Avg Haul Cycle" value="22.5 mins" subtitle="Pit North to Coal Handling Plant" />
        <StatCard icon="📈" title="Crusher Feed Rate" value="1,850 TPH" subtitle="Primary Sizer operational" />
      </div>

      <div className="chart-panel section-gap">
        <h3 className="panel-title">Active Bench Excavation Progress</h3>
        <DataState loading={loading} error={error}>
          {benches && <DataTable columns={COLUMNS} rows={benches} />}
        </DataState>
      </div>
    </DashboardLayout>
  );
}

export default Production;
