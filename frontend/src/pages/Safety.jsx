import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import DataState from "../components/DataState";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { SAFETY_STATS } from "../data/mockData";
import { riskTone, hazardStatusTone } from "../utils/helpers";

const RISKS = ["Low", "Medium", "High"];
const STATUSES = ["Pending", "Active Control", "Resolved"];
const CAN_EDIT = ["admin", "supervisor", "safety_officer"];
const EMPTY = { area: "", hazard: "", risk: "Low", action: "" };

function Safety() {
  const { user } = useAuth();
  const canEdit = CAN_EDIT.includes(user?.role);
  const { data: hazards, error, loading, setData } = useApi("/hazards");
  const { data: summary } = useApi("/dashboard/summary");

  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function addHazard(e) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const body = { area: form.area, hazard: form.hazard, risk: form.risk };
      if (form.action.trim()) body.action = form.action;
      const created = await api("/hazards", { method: "POST", body });
      setData([created, ...hazards]);
      setForm(EMPTY);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(id, status) {
    setFormError("");
    try {
      const updated = await api(`/hazards/${encodeURIComponent(id)}`, { method: "PATCH", body: { status } });
      setData(hazards.map((h) => (h.id === id ? updated : h)));
    } catch (err) {
      setFormError(err.message);
    }
  }

  const columns = [
    { key: "id", label: "Log ID", className: "cell-id" },
    { key: "area", label: "Location" },
    { key: "hazard", label: "Identified Hazard" },
    { key: "risk", label: "Risk Rating", render: (h) => <Badge tone={riskTone(h.risk)}>{h.risk}</Badge> },
    { key: "action", label: "Control Measure", render: (h) => h.action ?? "—" },
    {
      key: "status",
      label: "Status",
      render: (h) =>
        canEdit ? (
          <select className="status-select" value={h.status} onChange={(e) => changeStatus(h.id, e.target.value)} aria-label={`Status of ${h.id}`}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        ) : (
          <Badge tone={hazardStatusTone(h.status)}>{h.status}</Badge>
        ),
    },
  ];

  const lti = summary?.ltiFreeDays;

  return (
    <DashboardLayout>
      <div className="stats-grid">
        <StatCard icon="🦺" title="LTI Free Days" value={lti == null ? "—" : `${lti} Days`} subtitle="Zero Lost Time Incidents" />
        <StatCard icon="⛰" title="Slope Stability Radar" value="0.18 mm" subtitle="Alarm Level: GREEN (Stable)" />
        <StatCard icon="💨" title="Airway Flow" value={`${SAFETY_STATS.airflowMs} m/s`} subtitle="Ventilation status optimal" />
        <StatCard icon="📋" title="DGMS Compliance" value="100%" subtitle="Statutory inspections cleared" />
      </div>

      {canEdit && (
        <div className="chart-panel section-gap">
          <h3 className="panel-title">Report a New Hazard</h3>
          <form className="hazard-form" onSubmit={addHazard}>
            <label className="form-field">
              <span>Location</span>
              <input value={form.area} onChange={update("area")} maxLength={120} required placeholder="e.g. Haul Road Ramp 2" />
            </label>
            <label className="form-field">
              <span>Risk rating</span>
              <select value={form.risk} onChange={update("risk")}>
                {RISKS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="form-field form-wide">
              <span>Identified hazard</span>
              <input value={form.hazard} onChange={update("hazard")} maxLength={300} required placeholder="e.g. Loose rocks on the berm" />
            </label>
            <label className="form-field form-wide">
              <span>Control measure (optional)</span>
              <input value={form.action} onChange={update("action")} maxLength={300} placeholder="e.g. Area barricaded, scaling scheduled" />
            </label>
            <div className="form-actions">
              <button className="btn" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Add hazard"}
              </button>
              {formError && <span className="tone-bad" role="alert">{formError}</span>}
            </div>
          </form>
        </div>
      )}

      <div className="chart-panel section-gap">
        <h3 className="panel-title">Hazard Identification &amp; Risk Assessment (HIRA) Log</h3>
        {!canEdit && <p className="panel-note">You have read-only access. Supervisors, safety officers and admins can add hazards.</p>}
        {!canEdit && formError && <p className="panel-note tone-bad" role="alert">{formError}</p>}
        <DataState loading={loading} error={error}>
          {hazards && <DataTable columns={columns} rows={hazards} />}
        </DataState>
      </div>
    </DashboardLayout>
  );
}

export default Safety;
