// src/components/common/ErrorState.jsx
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorState({
  title = "Unable to load data",
  message = "An unexpected error occurred while fetching records. Please check your connection and try again.",
  onRetry = null,
  retryLabel = "Try Again",
  style = {},
}) {
  return (
    <div
      className="celfon-error-state-card"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        background: "#fff1f2",
        border: "1px solid #fecdd3",
        borderRadius: "16px",
        margin: "16px 0",
        ...style,
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#ffe4e6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "14px",
          color: "#e11d48",
        }}
      >
        <AlertTriangle size={30} />
      </div>

      <h3
        style={{
          margin: "0 0 6px 0",
          fontSize: "1.1rem",
          fontWeight: "700",
          color: "#9f1239",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "0 0 18px 0",
          fontSize: "0.88rem",
          color: "#881337",
          maxWidth: "400px",
          lineHeight: "1.5",
        }}
      >
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#e11d48",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "9px 18px",
            fontSize: "0.88rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(225, 29, 72, 0.25)",
            transition: "background 0.2s ease",
          }}
        >
          <RefreshCw size={15} />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
}
