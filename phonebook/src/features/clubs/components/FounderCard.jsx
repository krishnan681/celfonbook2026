// src/features/clubs/components/FounderCard.jsx
import React from "react";
import { Download, Award, Quote } from "lucide-react";
import { getClubFounderInfo } from "../services/clubService";

/**
 * Generates and triggers download / print-to-PDF of Founder Heritage Chronicle
 */
export const downloadFounderPdf = (founderData) => {
  if (!founderData) return;

  if (founderData.pdfDownloadUrl) {
    window.open(founderData.pdfDownloadUrl, "_blank");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download or print the PDF.");
    return;
  }

  const chaptersHtml = (founderData.pages || [])
    .map(
      (p) => `
      <div class="chapter-card">
        <div class="chapter-badge">${p.chapter || `Chapter ${p.pageNumber}`}</div>
        <h3 class="chapter-title">${p.title || ""}</h3>
        ${(p.content || [])
          .map((para) => `<p class="chapter-para">${para}</p>`)
          .join("")}
      </div>
    `
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${founderData.founderName} - ${founderData.clubName} Heritage Chronicle</title>
      <style>
        @page {
          size: A4;
          margin: 18mm 15mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          line-height: 1.6;
          background: #ffffff;
          padding: 24px;
        }
        .header {
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .club-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #b45309;
          background: #fef3c7;
          padding: 3px 10px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 6px;
        }
        .founder-name {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .founder-title {
          font-size: 13.5px;
          color: #64748b;
          font-weight: 500;
        }
        .quote-box {
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #92400e;
          font-size: 14.5px;
          margin-bottom: 20px;
        }
        .summary-box {
          font-size: 14px;
          color: #334155;
          margin-bottom: 24px;
          line-height: 1.6;
          background: #f8fafc;
          padding: 14px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .chapters-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .chapter-card {
          padding: 14px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          page-break-inside: avoid;
        }
        .chapter-badge {
          font-size: 11px;
          font-weight: 700;
          color: #0369a1;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .chapter-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .chapter-para {
          font-size: 13px;
          color: #475569;
          margin-bottom: 6px;
          line-height: 1.55;
        }
        .chapter-para:last-child {
          margin-bottom: 0;
        }
        .footer {
          margin-top: 32px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
          font-size: 11px;
          color: #94a3b8;
          display: flex;
          justify-content: space-between;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <span class="club-tag">${founderData.clubName}</span>
        <h1 class="founder-name">${founderData.founderName}</h1>
        <div class="founder-title">${founderData.title || "Founder Heritage Chronicle"}</div>
      </div>

      ${founderData.quote ? `<div class="quote-box">"${founderData.quote}"</div>` : ""}

      <div class="summary-box">
        <strong>Overview:</strong> ${founderData.shortSummary}
      </div>

      <div class="chapters-container">
        ${chaptersHtml}
      </div>

      <div class="footer">
        <span>${founderData.clubName} — Heritage & History Archive</span>
        <span>Celfonbook Directory Edition</span>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

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
        padding: "20px 24px",
        marginBottom: "24px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: isVasavi
                ? "linear-gradient(135deg, #dc2626, #991b1b)"
                : "linear-gradient(135deg, #d97706, #b45309)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: isVasavi
                ? "0 4px 12px rgba(220, 38, 38, 0.25)"
                : "0 4px 12px rgba(217, 119, 6, 0.25)",
              flexShrink: 0,
            }}
          >
            <Award size={24} />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "2px",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: isVasavi ? "#991b1b" : "#b45309",
                  background: isVasavi
                    ? "rgba(220, 38, 38, 0.1)"
                    : "rgba(245, 158, 11, 0.12)",
                  padding: "2px 8px",
                  borderRadius: "6px",
                }}
              >
                Founder & Heritage
              </span>
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "1.15rem",
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              {founderData.founderName}
            </h3>
          </div>
        </div>

        {/* Download PDF Button */}
        <button
          type="button"
          onClick={() => downloadFounderPdf(founderData)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: isVasavi
              ? "linear-gradient(135deg, #dc2626, #991b1b)"
              : "linear-gradient(135deg, #0284c7, #0369a1)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "9px 18px",
            fontSize: "0.86rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: isVasavi
              ? "0 2px 10px rgba(220, 38, 38, 0.25)"
              : "0 2px 10px rgba(2, 132, 199, 0.25)",
            transition: "all 0.2s ease",
          }}
          title="Download Founder Heritage & Biography (PDF)"
        >
          <Download size={16} />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Summary Description */}
      <p
        style={{
          margin: "0 0 10px 0",
          fontSize: "0.92rem",
          color: "#475569",
          lineHeight: "1.6",
        }}
      >
        {founderData.shortSummary}
      </p>

      {/* Quote Banner */}
      {founderData.quote && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: isVasavi ? "#fef2f2" : "#fffbeb",
            borderLeft: `4px solid ${isVasavi ? "#dc2626" : "#f59e0b"}`,
            padding: "8px 14px",
            borderRadius: "0 8px 8px 0",
            fontSize: "0.88rem",
            color: isVasavi ? "#991b1b" : "#92400e",
            fontStyle: "italic",
          }}
        >
          <Quote size={14} style={{ flexShrink: 0, opacity: 0.7 }} />
          <span>"{founderData.quote}"</span>
        </div>
      )}
    </div>
  );
}
