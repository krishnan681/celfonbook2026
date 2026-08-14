import React, { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { fireIndependenceConfetti, fireGrandFireworks } from "../../core/utils/confetti";
import "./independenceCelebration.css";

export default function IndependenceCelebration() {
  const [showBadge, setShowBadge] = useState(true);

  useEffect(() => {
    // Fire festive tricolor confetti on website open
    const timer = setTimeout(() => {
      fireIndependenceConfetti();
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const handleCelebrateClick = () => {
    fireGrandFireworks();
  };

  return (
    <>
      {/* Top Indian Flag Accent Stripe */}
      <div className="indian-flag-topbar" aria-hidden="true">
        <span className="flag-stripe saffron"></span>
        <span className="flag-stripe white">
          <span className="mini-chakra"></span>
        </span>
        <span className="flag-stripe green"></span>
      </div>

      {/* Floating Independence Day Celebration Chip */}
      {showBadge && (
        <div className="independence-floating-badge" role="region" aria-label="Independence Day Celebration">
          <div className="badge-flag-icon">🇮🇳</div>
          <div className="badge-text" onClick={handleCelebrateClick}>
            <span className="badge-title">79th Independence Day</span>
            <span className="badge-sub">
              Tap to Celebrate <Sparkles size={13} className="sparkle-icon" />
            </span>
          </div>
          <button
            className="badge-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowBadge(false);
            }}
            aria-label="Dismiss banner"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </>
  );
}
