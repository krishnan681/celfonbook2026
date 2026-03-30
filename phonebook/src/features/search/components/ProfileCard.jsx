// import { useState } from "react";
// import { Heart, Phone, MessageSquare, MapPin } from "lucide-react";

// const ProfileCard = ({ profile }) => {
//   const [isSaved, setIsSaved] = useState(false);

//   const name = profile.business_name || profile.person_name || "Unnamed";
//   const city = profile.city || "Not specified";
//   const keywords = profile.keywords || "";

//   const handleCall = () => {
//   const phone = profile.mobile_number;

//   if (!phone) {
//     alert("No phone number available");
//     return;
//   }

//   window.location.href = `tel:${phone}`;
// };


//   const handleEnquire = () => {
//     alert(`Enquiry for ${name}`);
//     // Later: open modal / WhatsApp / form
//   };

//   return (
//     <div className="profile-card">
//       {/* Heart button - top right */}
//       <button
//         className={`heart-btn ${isSaved ? "saved" : ""}`}
//         onClick={() => setIsSaved(!isSaved)}
//         aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
//       >
//         <Heart
//           size={20}
//           fill={isSaved ? "currentColor" : "none"}
//           stroke={isSaved ? "none" : "currentColor"}
//         />
//       </button>

//       {/* Prime badge - top left, small & non-overlapping */}
//       {profile.is_prime && (
//         <div className="prime-badge">
//           <span className="star">★</span> Prime
//         </div>
//       )}

//       {/* Main content */}
//       <div className="card-header">
//         <h3 className="name">{name}</h3>
//       </div>

//       <div className="card-info">
//         <p className="type-location">
//             <MapPin size={14} /> {city}
//         </p>

//         {keywords && (
//           <p className="keywords">
//             {keywords.split(",").slice(0, 3).map((kw, i) => (
//               <span key={i}>
//                 {kw.trim()}
//                 {i < 2 && "  "}
//               </span>
//             ))}
//           </p>
//         )}

//         <p className="views">
//           <span role="img" aria-label="eye">👁</span> {profile.views || 0} views
//         </p>
//       </div>

//       {/* Buttons */}
//       <div className="card-actions">
//         <button className="btn call" onClick={handleCall}>
//           <Phone size={16} /> Call
//         </button>
//         <button className="btn enquire" onClick={handleEnquire}>
//           <MessageSquare size={16} /> Enquire
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfileCard;




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Phone, MessageSquare, MapPin } from "lucide-react";
// import FavoriteButton from "./FavoriteButton";
// import FavoriteModal from "./FavoriteModal";
// import EnquiryModal from "./EnquiryModal";
// import { supabase } from "../../../core/config/supabaseClient";

// const ProfileCard = ({ profile, isKeywordFocused }) => {
//   const navigate = useNavigate();

//   const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
//   const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);

//   const name = profile.business_name || profile.person_name || "Unnamed";
//   const city = profile.city || "Not specified";

//   // Safer keyword handling
//   const keywords = profile.keywords?.trim() || "";

//   // Masked mobile number
//   const mobile =
//     profile.mobile_number && profile.mobile_number.length >= 5
//       ? profile.mobile_number.slice(0, 5) + "xxxxx"
//       : "96857xxxxx";

//   const handleCall = (e) => {
//     e.stopPropagation(); // Prevent card navigation
//     if (!profile.mobile_number) {
//       alert("No phone number available");
//       return;
//     }
//     window.location.href = `tel:${profile.mobile_number}`;
//   };

//   const handleFavoriteClick = async (e) => {
//     e.stopPropagation(); // Prevent card navigation
//     try {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error || !user) {
//         alert("Please login to save favorites");
//         return;
//       }
//       setIsFavoriteOpen(true);
//     } catch (err) {
//       console.error("Auth check failed:", err);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   const handleEnquireClick = (e) => {
//     e.stopPropagation(); // Prevent card navigation
//     setIsEnquiryOpen(true);
//   };

//   const handleCardClick = () => {
//     // Navigate to detailed profile page
//     navigate(`/profile/${profile.id}`, { state: { profile } });
//   };

//   return (
//     <>
//       <div
//         className="profile-card"
//         onClick={handleCardClick}
//         role="button"
//         tabIndex={0}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") {
//             e.preventDefault();
//             handleCardClick();
//           }
//         }}
//         style={{ cursor: "pointer" }}
//       >
//         <FavoriteButton onClick={handleFavoriteClick} />

//         {profile.is_prime && (
//           <div className="prime-badge">
//             <span className="star">★</span> Prime
//           </div>
//         )}

//         <div className="card-header">
//           <h3 className="name">{name}</h3>
//         </div>

//         <div className="card-info">
//           <p className="type-location">
//             <MapPin size={14} /> {city}
//           </p>

//           {/* Show mobile only when keyword is NOT focused */}
//           {!isKeywordFocused && (
//             <p className="mobile">📞 {mobile}</p>
//           )}

//           {/* Show keywords ONLY when keyword is focused */}
//           {isKeywordFocused && keywords.length > 0 && (
//             <p className="keywords">
//               {keywords
//                 .split(",")
//                 .slice(0, 3)
//                 .map((kw, i) => (
//                   <span key={i}>{kw.trim()}</span>
//                 ))}
//             </p>
//           )}

//           <p className="views">👁 {profile.views || 0} views</p>
//         </div>

//         <div className="card-actions">
//           <button className="btn call" onClick={handleCall}>
//             <Phone size={16} /> Call
//           </button>

//           <button className="btn enquire" onClick={handleEnquireClick}>
//             <MessageSquare size={16} /> Enquire
//           </button>
//         </div>
//       </div>

//       {/* Modals */}
//       <FavoriteModal
//         show={isFavoriteOpen}
//         onClose={() => setIsFavoriteOpen(false)}
//         selectedItem={profile}
//       />

//       <EnquiryModal
//         isOpen={isEnquiryOpen}
//         onClose={() => setIsEnquiryOpen(false)}
//         profile={profile}
//       />
//     </>
//   );
// };

// export default ProfileCard;









import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MessageSquare, MapPin } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import FavoriteModal from "./FavoriteModal";
import EnquiryModal from "./EnquiryModal";
import Swal from "sweetalert2";
import { supabase } from "../../../core/config/supabaseClient";
import "../components/css/ProfileCard.css";

import DiscountModal from "./DiscountModal";
import { DiscountService } from "../Service/discountService";

const ProfileCard = ({ profile, isKeywordFocused }) => {
  const navigate = useNavigate();

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);

  // ✅ NEW STATE (Discount)
  const [discountCard, setDiscountCard] = useState(null);

  if (!profile) return null;

  const name = profile.business_name || profile.person_name || "Unnamed";
  const city = profile.city || "Not specified";
  const keywords = profile.keywords?.trim() || "";

  const mobile =
    profile.mobile_number && profile.mobile_number.length >= 5
      ? profile.mobile_number.slice(0, 5) + "xxxxx"
      : "96857xxxxx";

  /* ---------------- BORDER TYPE ---------------- */

  let borderClass = "card-default";

  if (profile.is_prime) {
    borderClass = "card-prime";
  } else if (profile.is_business) {
    borderClass = "card-business";
  } else if (profile.normal_list) {
    borderClass = "card-normal";
  }

  /* ---------------- LOGIN CHECK ---------------- */

  const checkLogin = async () => {
    try {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        const result = await Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "You need to login first to continue.",
          confirmButtonText: "Login",
          showCancelButton: true,
        });

        if (result.isConfirmed) {
          navigate("/login");
        }

        return false;
      }

      return true;
    } catch (error) {
      console.error("Auth check error:", error);

      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Unable to verify login.",
      });

      return false;
    }
  };

  /* ---------------- CALL ---------------- */

  const handleCall = async (e) => {
    e.stopPropagation();

    const loggedIn = await checkLogin();
    if (!loggedIn) return;

    if (!profile.mobile_number) {
      Swal.fire({
        icon: "info",
        title: "No Phone Number",
        text: "No phone number available.",
      });
      return;
    }

    window.location.href = `tel:${profile.mobile_number}`;
  };

  /* ---------------- FAVORITE ---------------- */

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    const loggedIn = await checkLogin();
    if (!loggedIn) return;

    setIsFavoriteOpen(true);
  };

  /* ---------------- ENQUIRY ---------------- */

  const handleEnquireClick = async (e) => {
    e.stopPropagation();

    const loggedIn = await checkLogin();
    if (!loggedIn) return;

    setIsEnquiryOpen(true);
  };

  /* ---------------- CARD CLICK ---------------- */

  const handleCardClick = async () => {
    const loggedIn = await checkLogin();
    if (!loggedIn) return;

    navigate(`/profile/${profile.id}`);
  };

  /* ---------------- DISCOUNT CLICK ---------------- */

  const handleDiscountClick = async (e) => {
    e.stopPropagation();

    const loggedIn = await checkLogin();
    if (!loggedIn) return;

    try {
      // ✅ Save view (like Flutter)
      await DiscountService.saveDiscountView(profile.id);

      // ✅ Fetch card
      const card = await DiscountService.fetchGreetingCard(profile.id);

      if (card) {
        setDiscountCard(card);
      } else {
        Swal.fire({
          icon: "info",
          title: "No Discount",
          text: "No active discount available.",
        });
      }
    } catch (err) {
      console.error("Discount error:", err);
    }
  };

  return (
    <>
      <div
        className={`profile-card ${borderClass}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
      >
        <FavoriteButton onClick={handleFavoriteClick} />

        {/* ✅ DISCOUNT BADGE */}
        {profile.discount && (
          <div className="discount-badge" onClick={handleDiscountClick}>
            💸 Discount
          </div>
        )}

        <div className="card-header">
          <h3 className="name">{name}</h3>
        </div>

        <div className="card-info">
          <p className="type-location">
            <MapPin size={14} /> {city}
          </p>

          {!isKeywordFocused && (
            <p className="mobile">📞 {mobile}</p>
          )}

          {isKeywordFocused && keywords.length > 0 && (
            <p className="keywords">
              {keywords
                .split(",")
                .slice(0, 3)
                .map((kw, i) => (
                  <span key={i}>{kw.trim()}</span>
                ))}
            </p>
          )}
        </div>

        <div className="card-actions">
          <button className="btn call" onClick={handleCall}>
            <Phone size={16} /> Call
          </button>

          <button className="btn enquire" onClick={handleEnquireClick}>
            <MessageSquare size={16} /> Enquire
          </button>
        </div>
      </div>

      {/* FAVORITE */}
      <FavoriteModal
        show={isFavoriteOpen}
        onClose={() => setIsFavoriteOpen(false)}
        selectedItem={profile}
        onSaved={() =>
          window.dispatchEvent(new Event("favorites-updated"))
        }
      />

      {/* ENQUIRY */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        profile={profile}
      />

      {/* ✅ DISCOUNT MODAL */}
      {discountCard && (
        <DiscountModal
          card={discountCard}
          onClose={() => setDiscountCard(null)}
        />
      )}
    </>
  );
};

export default ProfileCard;






// 9791955157