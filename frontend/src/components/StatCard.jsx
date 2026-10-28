import React from "react";

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="stat-card-body">
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatCard;