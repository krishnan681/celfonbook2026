import React from "react";
import "../css/Dashboard.css";

export default function DashboardStats({
  viewsCount,
  leadsCount,
}) {
  return (
    <section className="modern-stats">

      <div className="metric-card">

        <div className="metric-header">
          <span>Total Views</span>
        </div>

        <div className="metric-value">
          {viewsCount > 999
            ? `${(viewsCount / 1000).toFixed(1)}k`
            : viewsCount}
        </div>

      </div>

      <div className="metric-card">

        <div className="metric-header">
          <span>Total Leads</span>
        </div>

        <div className="metric-value">
          {leadsCount}
        </div>

      </div>

    </section>
  );
}