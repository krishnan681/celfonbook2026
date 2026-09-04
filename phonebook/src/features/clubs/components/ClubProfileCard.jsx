import React from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MessageSquare, MapPin } from "lucide-react";
import { maskPhoneNumber } from "../../../core/utils/maskHelper";
import { formatPersonNameWithPrefix } from "../../../core/utils/nameHelper";
import "../../search/components/css/profilecard.css";

const ClubProfileCard = ({
  person,
  roleTitle,
  isLeadership = false,
  isKeywordFocused = false,
}) => {
  const navigate = useNavigate();

  if (!person) return null;

  const formattedPersonName = formatPersonNameWithPrefix(person);
  const name =
    person.fullName ||
    formattedPersonName ||
    person.person_name ||
    person.business_name ||
    person.name ||
    "Club Member";

  const city = person.city || "Coimbatore";
  const rawMobile = person.mobile_number || person.phone || person.mobile || "";

  // Masked mobile format
  const mobile = maskPhoneNumber(rawMobile || "96857xxxxx");

  const keywords = person.keywords || person.profession || person.activity || "";
  const role = roleTitle || person.postFull || person.post_of_member || person.post || "";
  const isLeader = isLeadership || person.isLeadership;

  const borderClass = isLeader
    ? "card-business"
    : person.is_prime
    ? "card-prime"
    : "card-default";

  const handleCall = (e) => {
    e.stopPropagation();
    if (!rawMobile) {
      alert("No phone number available");
      return;
    }
    window.location.href = `tel:${rawMobile}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    if (!rawMobile) {
      alert("No phone number available");
      return;
    }
    const cleanPhone = rawMobile.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/91${cleanPhone}`, "_blank");
  };

  const handleCardClick = () => {
    if (person.id) {
      const slug =
        person.clubSlug ||
        ((person.assn || "").toLowerCase().includes("vasavi") ? "vasavi" : "lions");
      const targetUrl =
        slug === "lions"
          ? `/lions-club/member/${person.id}`
          : `/clubs/${slug}/member/${person.id}`;
      navigate(targetUrl);
    }
  };

  return (
    <div
      className={`profile-card ${borderClass}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="card-header">
        <h3 className="name">{name}</h3>
      </div>

      <div className="card-info">
        <p className="type-location">
          <MapPin size={14} /> {city}
        </p>

        {/* Show mobile only when keyword is NOT focused */}
        {!isKeywordFocused && rawMobile && (
          <p className="mobile">📞 {mobile}</p>
        )}

        {/* Show keywords ONLY when product/keyword input is focused */}
        {isKeywordFocused && keywords && (
          <p className="keywords">
            {keywords
              .split(",")
              .slice(0, 3)
              .map((k) => k.trim())
              .filter(Boolean)
              .join(" • ")}
          </p>
        )}

 
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="btn call"
          onClick={handleCall}
          title="Call Member"
        >
          <Phone size={16} />
          <span>Call</span>
        </button>

        <button
          type="button"
          className="btn enquire"
          onClick={handleWhatsApp}
          title="Enquire Member"
        >
          <MessageSquare size={16} />
          <span>Enquire</span>
        </button>
      </div>
    </div>
  );
};

export default ClubProfileCard;
