import { MapPin, Phone, MessageSquare, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../components/css/tngovcard.css";

const TNGovCard = ({ profile }) => {
  const navigate = useNavigate();

  const maskNumber = (number) => {
    if (!number) return "";
    const digits = number.replace(/\D/g, "");
    if (digits.length < 5) return digits;
    return `${digits.slice(0, 5)}xxxxx`;
  };

  return (
    <div
      className="tn-gov-card"
      onClick={() => navigate(`/profile/${profile.id}`)}
    >
      <div className="tn-gov-header">
        <img
          src={profile.profile_image}
          alt={profile.person_name}
          className="tn-gov-avatar"
        />

        <div className="tn-gov-details">
          <h3 className="gov-name">
            {profile.business_name || profile.person_name}
          </h3>

          <div className="gov-city">
            <MapPin size={14} />
            <span>{profile.city}</span>
          </div>

          <div className="gov-mobile">
            📞 {maskNumber(profile.mobile_number)}
          </div>
        </div>

        <button
          className="fav-btn"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="gov-actions">
        <button
          className="call-btn"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone size={16} />
          Call
        </button>

        <button
          className="enquiry-btn"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageSquare size={16} />
          Enquire
        </button>
      </div>

      {profile.description && (
        <p className="gov-description">
          {profile.description}
        </p>
      )}
    </div>
  );
};

export default TNGovCard;