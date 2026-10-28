import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import ShiftChart from "../components/ShiftChart";
import DataState from "../components/DataState";
import { useApi } from "../hooks/useApi";
import { GAS_READINGS } from "../data/mockData";
import { fmt } from "../utils/helpers";

function Dashboard() {
  const { data, error, loading } = useApi("/dashboard/summary");

  return (
    <DashboardLayout>
      <DataState loading={loading} error={error}>
        {data && (
          <>
            <div className="stats-grid">
              <StatCard icon="⛏" title="Daily Output" value={`${fmt(data.totalTonnes)} T`} subtitle="Sum of all three shifts" />
              <StatCard
                icon="🚛"
                title="Active Fleet"
                value={`${data.fleet.active} / ${data.fleet.total}`}
                subtitle={`${data.fleet.total - data.fleet.active} in scheduled maintenance`}
              />
              <StatCard icon="💥" title="Blast Schedule" value="14:30 IST" subtitle="Pit North - Sector 4B" />
              <StatCard
                icon="🦺"
                title="Safety Record"
                value={data.ltiFreeDays == null ? "—" : `${data.ltiFreeDays} Days`}
                subtitle={`Zero LTI · ${data.openHazards} open hazard${data.openHazards === 1 ? "" : "s"}`}
              />
            </div>

            <div className="charts-grid">
              <div className="chart-panel">
                <h3 className="panel-title">Shift-wise Extraction Output</h3>
                <ShiftChart shifts={data.shifts} />
              </div>

              <div className="chart-panel">
                <h3 className="panel-title">Mine Gas Telemetry &amp; Environmental Sensors</h3>
                <div className="kv-list">
                  {GAS_READINGS.map((r) => (
                    <div className="kv-row" key={r.label}>
                      <span className="kv-label">{r.label}:</span>
                      <strong className={`tone-${r.tone}`}>
                        {r.value} {r.state && `(${r.state})`}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </DataState>
    </DashboardLayout>
  );
}

export default Dashboard;
