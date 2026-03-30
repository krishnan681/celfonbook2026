import { useEffect, useState } from "react";
import "../components/css/discount.css";
import { DiscountService } from "../Service/discountService";

export default function DiscountModal({ card, onClose }) {
  const [remaining, setRemaining] = useState("");
  const [claimed, setClaimed] = useState(!!card.claimedAt);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(card.expiryDate) - new Date();

      if (diff <= 0) {
        clearInterval(interval);
        onClose();
      }

      setRemaining(formatDuration(diff));
    }, 1000);

    return () => clearInterval(interval);
  }, [card]);

  const formatDuration = (ms) => {
    if (ms <= 0) return "Expired";

    const total = Math.floor(ms / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  const handleClaim = async () => {
    await DiscountService.claimDiscount(card.id);
    setClaimed(true);
  };

  return (
    <div className="discount-overlay">
      <div className="discount-card-new">

        {/* CLOSE */}
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* HEADER */}
        <div className="discount-header">
          <span className="badge">LIMITED TIME</span>
          <h1>{card.title}</h1>
        </div>

        {/* MESSAGE */}
        <p className="discount-message">{card.message}</p>

        {/* TIMER BAR */}
        <div className="timer-box">
          <span>Offer ends in</span>
          <div className="time">{remaining}</div>
        </div>

        {/* CLAIM BUTTON */}
        <button
          className={`claim-btn-new ${claimed ? "claimed" : ""}`}
          disabled={claimed}
          onClick={handleClaim}
        >
          {claimed ? "✔ Claimed" : card.buttonText}
        </button>

      </div>
    </div>
  );
}