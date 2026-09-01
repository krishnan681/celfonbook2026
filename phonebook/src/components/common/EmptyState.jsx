// src/components/common/EmptyState.jsx
import React from "react";
import { FolderOpen } from "lucide-react";

export default function EmptyState({
  icon: Icon = FolderOpen,
  iconSize = 44,
  iconColor = "#94a3b8",
  title = "No records found",
  description = "There are no items matching your criteria at this moment.",
  actionLabel = null,
  onAction = null,
  secondaryActionLabel = null,
  onSecondaryAction = null,
  style = {},
  className = "",
}) {
  return (
    <div
      className={`celfon-empty-state-card ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
        background: "#ffffff",
        border: "1px dashed #cbd5e1",
        borderRadius: "16px",
        margin: "16px 0",
        ...style,
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Icon size={iconSize} color={iconColor} />
      </div>

      <h3
        style={{
          margin: "0 0 8px 0",
          fontSize: "1.15rem",
          fontWeight: "700",
          color: "#1e293b",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "0 0 20px 0",
          fontSize: "0.9rem",
          color: "#64748b",
          maxWidth: "420px",
          lineHeight: "1.5",
        }}
      >
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              style={{
                background: "#005a36",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "9px 20px",
                fontSize: "0.88rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 90, 54, 0.2)",
                transition: "background 0.2s ease",
              }}
            >
              {actionLabel}
            </button>
          )}

          {secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              style={{
                background: "#f1f5f9",
                color: "#475569",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "9px 18px",
                fontSize: "0.88rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
