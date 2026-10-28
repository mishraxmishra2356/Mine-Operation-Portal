import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import ShiftChart from "../components/ShiftChart";
import { SHIFTS, GAS_READINGS, SAFETY_STATS, FLEET_SUMMARY } from "../data/mockData";
import { fmt } from "../utils/helpers";

function Dashboard() {
  const totalTonnes = SHIFTS.reduce((sum, s) => sum + s.tonnes, 0);
  const active = FLEET_SUMMARY.shovelsActive + FLEET_SUMMARY.dumpersActive;
  const total = FLEET_SUMMARY.shovelsTotal + FLEET_SUMMARY.dumpersTotal;

  return (
    <DashboardLayout>
      <div className="stats-grid">
        <StatCard icon="⛏" title="Daily Output" value={`${fmt(totalTonnes)} T`} subtitle="Sum of all three shifts" />
        <StatCard icon="🚛" title="Active Fleet" value={`${active} / ${total}`} subtitle={`${total - active} in scheduled maintenance`} />
        <StatCard icon="💥" title="Blast Schedule" value="14:30 IST" subtitle="Pit North - Sector 4B" />
        <StatCard icon="🦺" title="Safety Record" value={`${SAFETY_STATS.ltiFreeDays} Days`} subtitle="Zero lost time injuries (LTI)" />
      </div>

      <div className="charts-grid">
        <div className="chart-panel">
          <h3 className="panel-title">Shift-wise Extraction Output</h3>
          <ShiftChart shifts={SHIFTS} />
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
    </DashboardLayout>
  );
}

export default Dashboard;
