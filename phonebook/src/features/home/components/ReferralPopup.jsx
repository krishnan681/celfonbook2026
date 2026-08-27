import { useEffect, useState } from "react";
import { Gift, X, ArrowRight, Award, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../pages/css/referralPopup.css";

export default function ReferralPopup() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setOpen(false);
  };

  const goToReferral = () => {
    setOpen(false);
    navigate("/my-referrals");
  };

  if (!open) return null;

  return (
    <>
      <div className="referral-overlay" onClick={closePopup} />

      <div className="referral-popup" role="dialog" aria-modal="true">
        {/* Close Button */}
        <button
          className="referral-close"
          onClick={closePopup}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Promo Content Container */}
        <div className="referral-popup-single">
          <div className="referral-popup-header">
            <div className="col-badge ev-promo-badge">
              <Gift size={14} />
              <span>Mega Referral Contest</span>
            </div>

            <h2 className="referral-main-title">
              Refer &amp; Win a Brand New <span className="highlight-ev">EV Scooter! 🛵</span>
            </h2>
            <p className="referral-subhead">
              Invite businesses &amp; contacts to join CelfonBook and earn lucky draw entries!
            </p>
          </div>

          <div className="contest-points">
            <div className="contest-item">
              <div className="c-icon-pill">
                <Users size={18} />
              </div>
              <div className="c-text">
                <strong>Invite Friends &amp; Businesses</strong> to register on <span>CELFON BOOK</span>
              </div>
            </div>

            <div className="contest-item highlight-item">
              <div className="c-icon-pill gold">
                <Award size={18} />
              </div>
              <div className="c-text">
                <strong>Every 3 Successful Referrals</strong> earns you <strong>1 Lucky Draw Coupon</strong>
              </div>
            </div>

            <div className="contest-item grand-prize-item">
              <div className="c-icon-pill scooter">
                <Sparkles size={18} />
              </div>
              <div className="c-text">
                <strong>Bumper Lucky Draw:</strong> Stand a chance to win a stylish <strong>EV Electric Scooter</strong>!
              </div>
            </div>
          </div>

          <div className="chances-note">
            🚀 More Referrals = More Coupons = Higher Chance to Win!
          </div>

          <button className="popup-btn" onClick={goToReferral}>
            <span>Start Referring Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
}