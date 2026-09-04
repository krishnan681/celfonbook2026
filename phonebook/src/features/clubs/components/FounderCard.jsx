// src/features/clubs/components/FounderCard.jsx
import React from "react";
import { Download, BookOpen, Quote } from "lucide-react";
import { getClubFounderInfo } from "../services/clubService";
import { openFounderPdf, downloadFounderPdf } from "../utils/founderPdfHelper";

export default function FounderCard({ clubSlug = "lions" }) {
  const founderData = getClubFounderInfo(clubSlug);
  if (!founderData) return null;

  const isVasavi = (clubSlug || "").toLowerCase() === "vasavi";

  return (
    <div
      className="founder-static-card"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%)",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "28px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Accent Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5px",
          background: isVasavi
            ? "linear-gradient(90deg, #7c2d12, #ea580c)"
            : "linear-gradient(90deg, #005a36, #f2a900)",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <h3
            style={{
              fontSize: "1.35rem",
              fontWeight: "800",
              color: "#0f172a",
              margin: "0 0 6px 0",
              lineHeight: 1.3,
            }}
          >
            {founderData.founderName}
          </h3>

          {founderData.title && (
            <p
              style={{
                fontSize: "0.88rem",
                color: "#64748b",
                fontWeight: "600",
                margin: "0 0 14px 0",
              }}
            >
              {founderData.title}
              {founderData.birthYear && founderData.deathYear
                ? ` (${founderData.birthYear} - ${founderData.deathYear})`
                : ""}
            </p>
          )}

          <p
            style={{
              fontSize: "0.92rem",
              color: "#334155",
              lineHeight: "1.6",
              margin: "0 0 16px 0",
            }}
          >
            {founderData.shortSummary} <br /> {founderData.secondpara}
          </p>
        </div>

        {/* Action Buttons: View Book (PDF) & Download PDF */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={() => openFounderPdf(founderData)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: isVasavi ? "#7c2d12" : "#005a36",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "10px 18px",
              fontSize: "0.88rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <BookOpen size={17} />
            <span>Read Book Online (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => downloadFounderPdf(founderData)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#f8fafc",
              color: "#475569",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "0.82rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.color = "#0f172a";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.color = "#475569";
            }}
            title="Download or Save PDF"
          >
            <Download size={15} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Quote Banner */}
      {(founderData.famousQuote || founderData.quote) && (
        <div
          style={{
            marginTop: "14px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: isVasavi ? "rgba(124, 45, 18, 0.06)" : "rgba(0, 90, 54, 0.05)",
            borderLeft: `4px solid ${isVasavi ? "#7c2d12" : "#005a36"}`,
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <Quote
            size={18}
            style={{
              color: isVasavi ? "#7c2d12" : "#005a36",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <span
            style={{
              fontSize: "0.88rem",
              fontStyle: "italic",
              fontWeight: "600",
              color: "#1e293b",
            }}
          >
            "{founderData.famousQuote || founderData.quote}"
          </span>
        </div>
      )}
    </div>
  );
}
