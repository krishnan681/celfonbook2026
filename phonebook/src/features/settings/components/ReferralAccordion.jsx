// src/features/settings/components/ReferralAccordion.jsx

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ReferralAccordion = ({ promoCode, users }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="referral-card">
      <div
        className="referral-header"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="promo-badge">{promoCode}</div>

        <span className="member-count">
          {users.length} {users.length === 1 ? "member" : "members"}
        </span>

        <div className="accordion-icon">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && (
        <div className="referral-body">
          {users.map((user, index) => {
            const name =
              user.full_name?.trim() || "Unknown";

            const joinDate = user.created_at
              ? new Date(user.created_at).toLocaleDateString("en-GB")
              : "";

            return (
              <div key={index} className="user-item">
                <div className="avatar">
                  {name.charAt(0).toUpperCase()}
                </div>

                <div className="user-info">
                  <h4>{name}</h4>

                  <p>
                    {user.phone || "-"}
                    {user.city ? ` • ${user.city}` : ""}
                  </p>
                </div>

                <span className="join-date">
                  {joinDate}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReferralAccordion;