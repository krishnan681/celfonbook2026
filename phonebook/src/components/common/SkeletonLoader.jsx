// src/components/common/SkeletonLoader.jsx
import React from "react";

export function SkeletonBox({ width = "100%", height = "20px", borderRadius = "6px", style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "celfon-shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

export function CardSkeleton({ count = 1 }) {
  return (
    <>
      <style>{`
        @keyframes celfon-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <SkeletonBox width="46px" height="46px" borderRadius="10px" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              <SkeletonBox width="65%" height="16px" />
              <SkeletonBox width="40%" height="12px" />
            </div>
          </div>
          <SkeletonBox width="90%" height="14px" />
          <SkeletonBox width="50%" height="14px" />
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <SkeletonBox width="50%" height="36px" borderRadius="8px" />
            <SkeletonBox width="50%" height="36px" borderRadius="8px" />
          </div>
        </div>
      ))}
    </>
  );
}

export function RowSkeleton({ count = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            background: "#f8fafc",
            borderRadius: "10px",
            border: "1px solid #f1f5f9",
          }}
        >
          <SkeletonBox width="34px" height="34px" borderRadius="8px" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            <SkeletonBox width="60%" height="14px" />
            <SkeletonBox width="35%" height="10px" />
          </div>
          <SkeletonBox width="70px" height="24px" borderRadius="6px" />
        </div>
      ))}
    </div>
  );
}

export default function SkeletonLoader({ type = "card", count = 3 }) {
  if (type === "row") return <RowSkeleton count={count} />;
  return <CardSkeleton count={count} />;
}
