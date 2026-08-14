import { useEffect, useState } from "react";
import { Gift, X, ArrowRight, Sparkles, Shield, Award, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fireIndependenceConfetti, fireGrandFireworks } from "../../../core/utils/confetti";
import "../pages/css/referralPopup.css";

export default function ReferralPopup() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
      // Celebrate when popup appears
      fireIndependenceConfetti({ particleCount: 80, spread: 90 });
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

  const triggerCelebration = () => {
    fireGrandFireworks();
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

        {/* Top Tricolor Decorative Line */}
        <div className="popup-tricolor-bar">
          <span className="p-bar saffron" />
          <span className="p-bar white" />
          <span className="p-bar green" />
        </div>

        {/* 2-Column Grid Layout */}
        <div className="referral-popup-grid">
          {/* ===================================================
              LEFT COLUMN (col-6): Indian Armed Forces & Independence Day
             =================================================== */}
          <div className="referral-col referral-col-left">
            {/* Ashoka Chakra Background SVG Watermark */}
            <div className="chakra-watermark" aria-hidden="true">
              <svg viewBox="0 0 100 100" className="chakra-svg">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#000088" strokeWidth="3" />
                <circle cx="50" cy="50" r="8" fill="#000088" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                    stroke="#000088"
                    strokeWidth="1.6"
                  />
                ))}
              </svg>
            </div>

            <div className="col-badge left-badge">
              <span>🇮🇳 80-வது சுதந்திர தினம்</span>
            </div>

            <div className="armed-forces-header">
              <div className="armed-icon-wrap">
                <Shield size={20} className="shield-icon" />
              </div>
              <h2 className="armed-forces-title">INDIAN ARMED FORCES</h2>
            </div>

            <div className="salute-box">
              <p className="salute-lead">
                வீரம், தியாகம், தேசபக்தி!
              </p>
              <p className="salute-sub">
                நமது இந்திய இராணுவத்திற்கு வீர வணக்கம்! 🫡🇮🇳
              </p>
            </div>

            <div className="wishes-box">
              <p className="wishes-text">
                உங்கள் அனைவருக்கும் இனிய 80-வது சுதந்திரதின நல்வாழ்த்துக்கள்! 🇮🇳
              </p>
              <div className="slogan-badge">
                <span>🇮🇳 வந்தே மாதரம் | ஜெய் ஹிந்த் 🇮🇳</span>
              </div>
            </div>

            <div className="left-footer-brand">
              <span className="brand-tagline">CelfonBook - Connects For Growth</span>
              <button
                type="button"
                className="btn-confetti-mini"
                onClick={triggerCelebration}
                title="Celebrate Independence Day!"
              >
                <Sparkles size={14} /> Celebrate 🇮🇳
              </button>
            </div>
          </div>

          {/* ===================================================
              RIGHT COLUMN (col-6): Referral Program & Win EV Scooter
             =================================================== */}
          <div className="referral-col referral-col-right">
            <div className="col-badge right-badge">
              <Gift size={13} />
              <span>Independence Special Contest</span>
            </div>

            <div className="right-heading-group">
              <h3 className="referral-main-title">
                Refer & Win an <span className="highlight-ev">EV Scooter! 🛵</span>
              </h3>
              <p className="referral-subhead">
                Refer Mobile Users & Win Big Rewards 🎉
              </p>
            </div>

            <div className="contest-points">
              <div className="contest-item">
                <div className="c-icon-pill">
                  <Users size={16} />
                </div>
                <div className="c-text">
                  <strong>Invite Friends & Businesses</strong> to join <span>CELFON BOOK</span>
                </div>
              </div>

              <div className="contest-item highlight-item">
                <div className="c-icon-pill gold">
                  <Award size={16} />
                </div>
                <div className="c-text">
                  <strong>Every 3 Successful Referrals</strong> earns you <strong>1 Lucky Draw Coupon</strong>
                </div>
              </div>

              <div className="contest-item">
                <div className="c-icon-pill scooter">
                  <Gift size={16} />
                </div>
                <div className="c-text">
                  <strong>Grand Independence Prize:</strong> Win a Brand New <strong>EV Scooter</strong>!
                </div>
              </div>
            </div>

            <p className="chances-note">
              ✨ More Coupons = Higher Chance to Win!
            </p>

            <button className="popup-btn" onClick={goToReferral}>
              <span>Refer Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}