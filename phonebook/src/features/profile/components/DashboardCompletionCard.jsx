import React from "react";
import "../css/Dashboard.css";

export default function DashboardCompletionCard({ profile }) {
  const fields = [
    profile?.person_name,
    profile?.business_name,
    profile?.mobile_number,
    profile?.city,
    profile?.description,
    profile?.profile_image,
    profile?.web_site,
  ];

  const completedFields = fields.filter(
    (field) => field && String(field).trim() !== "",
  ).length;

  const percentage = Math.round((completedFields / fields.length) * 100);

  const getMessage = () => {
    if (percentage === 100) return "Your profile is fully optimized.";

    if (percentage >= 80)
      return "Complete the remaining details to improve visibility.";

    if (percentage >= 50)
      return "Add more information to attract more customers.";

    return "Complete your profile to get more visibility.";
  };

  return (
    <section className="completion-card">
      <div className="completion-header">
        <div>
          <h3>Profile Completion</h3>

          <p>Keep your profile updated to rank higher in searches.</p>
        </div>

        <div className="completion-percentage">{percentage}%</div>
      </div>

      <div className="completion-progress">
        <div
          className="completion-progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="completion-footer">
        <span>{percentage}% Complete</span>

        <p>{getMessage()}</p>
      </div>
    </section>
  );
}
