// src/components/common/NoInternetScreen.jsx
import React, { useState } from "react";
import { WifiOff, RefreshCw, Smartphone, ShieldCheck, ArrowRight } from "lucide-react";
import { useNetworkStatus } from "../../core/hooks/useNetworkStatus";

export default function NoInternetScreen({ onRetry = null }) {
  const { isOnline } = useNetworkStatus();
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckConnection = async () => {
    setIsChecking(true);
    try {
      // Ping check
      await fetch("/favicon.ico", { cache: "no-store", method: "HEAD" });
      window.location.reload();
    } catch {
      setTimeout(() => {
        setIsChecking(false);
      }, 1000);
    }
  };

  return (
    <div
      className="celfon-no-internet-screen"
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Animated Radar Pulse Icon */}
        <div
          style={{
            position: "relative",
            width: "90px",
            height: "90px",
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "rgba(225, 29, 72, 0.12)",
              animation: "celfon-pulse 2s infinite",
            }}
          />
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "#ffe4e6",
              color: "#e11d48",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <WifiOff size={34} />
          </div>
        </div>

        <style>{`
          @keyframes celfon-pulse {
            0% { transform: scale(0.9); opacity: 0.8; }
            50% { transform: scale(1.25); opacity: 0.3; }
            100% { transform: scale(0.9); opacity: 0.8; }
          }
        `}</style>

        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: "800",
            color: "#0f172a",
            margin: "0 0 10px 0",
          }}
        >
          No Internet Connection
        </h2>

        <p
          style={{
            fontSize: "0.92rem",
            color: "#64748b",
            lineHeight: "1.6",
            margin: "0 auto 24px",
            maxWidth: "420px",
          }}
        >
          It looks like your device is currently offline. Please check your network connection, Wi-Fi, or mobile data to continue browsing live directory updates.
        </p>

        {/* Diagnostic Checklist */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            padding: "16px 18px",
            textAlign: "left",
            marginBottom: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "0.86rem",
            color: "#475569",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Smartphone size={16} color="#0284c7" />
            <span>Check if Mobile Data or Wi-Fi is turned ON</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>Turn Airplane Mode ON and OFF to refresh connection</span>
          </div>
        </div>

        {/* Retry Action */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <button
            type="button"
            onClick={onRetry || handleCheckConnection}
            disabled={isChecking}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#005a36",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              padding: "12px 28px",
              fontSize: "0.92rem",
              fontWeight: "700",
              cursor: isChecking ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(0, 90, 54, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            <RefreshCw size={16} className={isChecking ? "animate-spin" : ""} />
            <span>{isChecking ? "Checking Connection..." : "Retry Connection"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
