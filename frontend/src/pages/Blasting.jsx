import React, { useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import { BLAST_MODEL } from "../data/mockData";

const { K, BETA, PPV_LIMIT_MM_S } = BLAST_MODEL;

const PATTERN = [
  ["Hole Diameter", "250 mm"],
  ["Burden × Spacing", "6.0 m × 7.5 m"],
  ["Bench Height & Stemming", "12.0 m / 4.5 m"],
  ["Initiation Sequence", "Non-electric Shocktube (25ms surface / 42ms down-the-hole)"],
];

function Blasting() {
  const [distance, setDistance] = useState(350);
  const [chargeWeight, setChargeWeight] = useState(120);

  const { scaledDistance, estimatedPPV, exceedsLimit } = useMemo(() => {
    const sd = chargeWeight > 0 ? distance / Math.sqrt(chargeWeight) : 0;
    const ppv = sd > 0 ? K * Math.pow(sd, -BETA) : 0;
    return { scaledDistance: sd, estimatedPPV: ppv, exceedsLimit: ppv > PPV_LIMIT_MM_S };
  }, [distance, chargeWeight]);

  return (
    <DashboardLayout>
      <div className="stats-grid">
        <StatCard icon="💥" title="Next Scheduled Blast" value="Pit North - 4B" subtitle="Window: 14:30 - 15:00 IST" />
        <StatCard icon="🧨" title="Total Charge" value="4,200 kg" subtitle="Emulsion / ANFO Blend" />
        <StatCard icon="📡" title="PPV Screening Limit" value={`< ${PPV_LIMIT_MM_S.toFixed(1)} mm/s`} subtitle="Verify against current DGMS circular" />
        <StatCard icon="🚧" title="Clearance Radius" value="500 m" subtitle="Status: Sirens armed" />
      </div>

      <div className="charts-grid section-gap">
        <div className="chart-panel">
          <h3 className="panel-title">Blast Geometry &amp; Pattern Details</h3>
          <div className="kv-list">
            {PATTERN.map(([label, value]) => (
              <div className="kv-row" key={label}>
                <span className="kv-label">{label}:</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-panel">
          <h3 className="panel-title">Ground Vibration (PPV) Estimator</h3>
          <div className="range-field">
            <label htmlFor="distance-input">
              Distance to Nearest Structure (m): <strong>{distance} m</strong>
            </label>
            <input id="distance-input" type="range" min="100" max="1000" value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
          </div>
          <div className="range-field" style={{ marginTop: 12 }}>
            <label htmlFor="charge-input">
              Max Charge Weight Per Delay (kg): <strong>{chargeWeight} kg</strong>
            </label>
            <input id="charge-input" type="range" min="20" max="400" value={chargeWeight} onChange={(e) => setChargeWeight(Number(e.target.value))} />
          </div>

          <div className="estimate-box">
            <div className="kv-row" style={{ padding: "0 0 4px", border: "none" }}>
              <span className="kv-label">Scaled Distance (SD):</span>
              <strong>{scaledDistance.toFixed(1)} m/√kg</strong>
            </div>
            <div className="kv-row" style={{ padding: 0, border: "none" }}>
              <span className="kv-label">Estimated Peak PPV:</span>
              <strong className={exceedsLimit ? "tone-bad" : "tone-good"}>
                {estimatedPPV.toFixed(2)} mm/s {exceedsLimit ? "(Exceeds screening limit)" : "(Estimated within limit)"}
              </strong>
            </div>
          </div>
          <p className="panel-note">
            Screening estimate only (PPV = {K} × SD<sup>−{BETA}</sup>). The constants are site-specific and should be
            calibrated from your own blast-monitoring records. Permissible limits depend on structure type and vibration
            frequency, so confirm against the current DGMS circular before any blast decision.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Blasting;
