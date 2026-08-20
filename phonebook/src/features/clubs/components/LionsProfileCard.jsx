// src/features/clubs/components/LionsProfileCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MessageSquare, MapPin, Cake, Gem, Briefcase } from "lucide-react";
import "./css/LionsProfileCard.css";

const LionsProfileCard = ({ person, roleTitle, isLeadership = false }) => {
  const navigate = useNavigate();

  if (!person) return null;

  const name = person.name || "Unnamed Lion";
  const address = person.address || "Coimbatore, Tamil Nadu";
  const phone = person.phone || person.mobile || "";
  const memberNo = person.memberNo || person.memNum || person.key || "";
  const role = roleTitle || person.post || person.role || "Member";
  const birthday = person.birthday || person.dob || "";
  const anniversary = person.anniversary || person.dow || "";
  const profession = person.profession || person.keywords || "";

  const handleCall = (e) => {
    e.stopPropagation();
    if (!phone) {
      alert("No phone number available");
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    if (!phone) {
      alert("No phone number available");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/91${cleanPhone}`, "_blank");
  };

  const handleCardClick = () => {
    if (person.id) {
      navigate(`/lions-club/member/${person.id}`);
    }
  };

  return (
    <div
      className="lions-profile-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Top Header Row with Name & Role Badge */}
      <div className="card-top-row">
        <span className={`lions-role-badge ${isLeadership ? "leadership" : "member"}`}>
          {role}
        </span>
        {memberNo && (
          <span className="card-member-id-pill">
            #{memberNo}
          </span>
        )}
      </div>

      <div className="card-header">
        <h3 className="name">{name}</h3>
      </div>

      {/* Card Info Section */}
      <div className="card-info">
        {address && (
          <p className="type-location">
            <MapPin size={14} className="info-icon" />
            <span>{address}</span>
          </p>
        )}

        {phone && (
          <p className="mobile">
            <Phone size={14} className="info-icon" />
            <span>+91 {phone}</span>
          </p>
        )}

        {profession && (
          <p className="profession">
            <Briefcase size={14} className="info-icon" />
            <span>{profession}</span>
          </p>
        )}

        {(birthday || anniversary) && (
          <div className="dates-row">
            {birthday && (
              <span className="date-badge">
                <Cake size={13} /> {birthday}
              </span>
            )}
            {anniversary && (
              <span className="date-badge">
                <Gem size={13} /> {anniversary}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Actions (Call & WhatsApp) */}
      <div className="card-actions">
        <button type="button" className="btn call" onClick={handleCall}>
          <Phone size={16} />
          <span>Call</span>
        </button>
        <button type="button" className="btn enquire" onClick={handleWhatsApp}>
          <MessageSquare size={16} />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

export default LionsProfileCard;
