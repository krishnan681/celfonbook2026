import React from "react";
import "../css/Dashboard.css";

export default function RecentLeads({
  recentLeads,
}) {
  return (
    <section className="recent-section">

      <div className="section-header">
        <h3>Recent Leads</h3>
      </div>

      {recentLeads.length === 0 ? (
        <div className="empty-state">
          No leads received yet
        </div>
      ) : (
        recentLeads.map((lead) => (
          <div
            key={lead.id}
            className="lead-row"
          >

            <div className="lead-user">

              <div className="lead-circle">
                {(lead.viewer_name || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <h4>
                  {lead.viewer_name || "Unknown User"}
                </h4>

               
              </div>

            </div>

            <div className="lead-date">
              {new Date(
                lead.created_at
              ).toLocaleDateString()}
            </div>

          </div>
        ))
      )}

    </section>
  );
}