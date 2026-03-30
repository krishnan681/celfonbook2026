import { useNavigate } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import "../css/DetailedRelatedProfiles.css";

export default function DetailedRelatedProfiles({ items }) {
  const navigate = useNavigate();

  if (!items?.length) return null;

  return (
    <div className="pd-container pd-related-section">
      <h3>Related Businesses</h3>

      <div className="pd-related-grid">
        {items.map((rel) => (
          <div
            key={rel.id}
            className="pd-related-card"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate(`/profile/${rel.id}`);
            }}
          >
            <div className={`pd-rel-badge ${rel.subscription || "free"}`}>
              {(rel.subscription || "free").toUpperCase()}
            </div>

            <h4>
              {rel.business_name ||
                rel.person_name ||
                "Unnamed"}
            </h4>

            <p className="pd-rel-loc">
              <MdLocationOn size={14} />
              {rel.city || "Not specified"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}