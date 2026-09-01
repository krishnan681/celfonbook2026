// src/components/common/OfflineBanner.jsx
import React, { useEffect, useState } from "react";
import { WifiOff, Wifi, CheckCircle2 } from "lucide-react";
import { useNetworkStatus } from "../../core/hooks/useNetworkStatus";

export default function OfflineBanner() {
  const { isOnline, wasOffline, resetWasOffline } = useNetworkStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        resetWasOffline();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, resetWasOffline]);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        fontSize: "0.88rem",
        fontWeight: "600",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        background: isOnline ? "#16a34a" : "#dc2626",
        color: "#ffffff",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        animation: "celfon-slide-down 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes celfon-slide-down {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      {isOnline ? (
        <>
          <CheckCircle2 size={18} />
          <span>You're back online. Live data refreshed!</span>
        </>
      ) : (
        <>
          <WifiOff size={18} />
          <span>You are currently offline. Displaying cached records.</span>
        </>
      )}
    </div>
  );
}
