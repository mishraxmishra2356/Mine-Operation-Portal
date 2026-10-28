import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import DataState from "../components/DataState";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { equipmentTone } from "../utils/helpers";

const STATUSES = ["Operating", "Hauling", "Dumping", "Spreading", "Idle", "Maintenance"];
const CAN_EDIT = ["admin", "supervisor"];

const pct = (a, t) => (t ? `${Math.round((a / t) * 100)}% Availability` : "—");
const count = (fleet, prefix) => {
  const units = fleet.filter((u) => u.id.startsWith(prefix));
  return { active: units.filter((u) => u.status !== "Maintenance").length, total: units.length };
};

function Equipment() {
  const { user } = useAuth();
  const { data: fleet, error, loading, setData } = useApi("/equipment");
  const [saveError, setSaveError] = useState("");
  const canEdit = CAN_EDIT.includes(user?.role);

  async function changeStatus(id, status) {
    setSaveError("");
    try {
      const updated = await api(`/equipment/${encodeURIComponent(id)}`, { method: "PATCH", body: { status } });
      setData(fleet.map((u) => (u.id === id ? updated : u)));
    } catch (e) {
      setSaveError(e.message);
    }
  }

  const columns = [
    { key: "id", label: "Unit ID", className: "cell-id" },
    { key: "type", label: "Equipment Type" },
    { key: "location", label: "Current Location" },
    { key: "operator", label: "Operator" },
    { key: "fuel", label: "Fuel / Battery" },
    {
      key: "status",
      label: "Status",
      render: (r) =>
        canEdit ? (
          <select className="status-select" value={r.status} onChange={(e) => changeStatus(r.id, e.target.value)} aria-label={`Status of ${r.id}`}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        ) : (
          <Badge tone={equipmentTone(r.status)}>{r.status}</Badge>
        ),
    },
  ];

  const shovels = fleet ? count(fleet, "SH") : { active: 0, total: 0 };
  const dumpers = fleet ? count(fleet, "DT") : { active: 0, total: 0 };

  return (
    <DashboardLayout>
      <div className="stats-grid">
        <StatCard icon="🚜" title="Shovels Active" value={`${shovels.active} / ${shovels.total}`} subtitle={pct(shovels.active, shovels.total)} />
        <StatCard icon="🚛" title="Dumpers Active" value={`${dumpers.active} / ${dumpers.total}`} subtitle={`${dumpers.total - dumpers.active} in Workshop`} />
        <StatCard icon="⚙" title="Fleet OEE" value="91.4%" subtitle="Overall Equipment Effectiveness" />
        <StatCard icon="⛽" title="Mean Time To Repair" value="1.8 hrs" subtitle="Maintenance KPI" />
      </div>

      <div className="chart-panel section-gap">
        <h3 className="panel-title">Live Heavy Earth Moving Machinery (HEMM) Tracking</h3>
        {canEdit && <p className="panel-note">You can change a unit's status from the dropdown.</p>}
        {saveError && <p className="panel-note tone-bad" role="alert">{saveError}</p>}
        <DataState loading={loading} error={error}>
          {fleet && <DataTable columns={columns} rows={fleet} />}
        </DataState>
      </div>
    </DashboardLayout>
  );
}

export default Equipment;
