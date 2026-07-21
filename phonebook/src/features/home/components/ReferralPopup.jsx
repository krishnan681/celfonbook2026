import { useEffect, useState } from "react";
import { Gift, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../pages/css/referralPopup.css";

export default function ReferralPopup() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 1000);

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

      <div className="referral-popup">
        <button
          className="referral-close"
          onClick={closePopup}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="popup-icon">
          <Gift size={40} />
        </div>

        <h2>Refer to Win</h2>

        <h3>Refer Mobile Users, <br /> 🎉 Win an EV Scooter</h3>

        <p>
          Invite your friends to use <strong>CELFON BOOK</strong>.
        </p>

        <p>
          <strong>Every 3 successful referrals</strong> earns you
          <strong> 1 Coupon</strong>.
        </p>

        <p>More coupons = More chances to win!</p>

        <button className="popup-btn" onClick={goToReferral}>
          Refer Now
          <ArrowRight size={18} />
        </button>
      </div>
    </>
  );
}