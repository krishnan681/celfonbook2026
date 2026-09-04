// src/features/clubs/utils/founderPdfHelper.js

/**
 * Opens Founder Heritage Book PDF online directly in a new tab for reading
 */
export const openFounderPdf = (founderData) => {
  if (!founderData) return;

  const url = founderData.pdfDownloadUrl || founderData.pdfUrl;
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  // Fallback to online formatted HTML view in new tab if no PDF file
  viewFormattedChronicle(founderData);
};

/**
 * Generates and triggers download of Founder Heritage Chronicle
 */
export const downloadFounderPdf = (founderData) => {
  if (!founderData) return;

  if (founderData.pdfDownloadUrl) {
    const link = document.createElement("a");
    link.href = founderData.pdfDownloadUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const filename = `${(founderData.clubName || "Club").replace(/\s+/g, "_")}_Book.pdf`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  viewFormattedChronicle(founderData);
};

function viewFormattedChronicle(founderData) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to view the book online.");
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
          text-align: center;
          border-bottom: 3px solid ${founderData.themeColor || "#005a36"};
          padding-bottom: 20px;
          margin-bottom: 24px;
        }
        .club-tag {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
          color: ${founderData.themeColor || "#005a36"};
          margin-bottom: 6px;
        }
        .founder-name {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .founder-dates {
          font-size: 14px;
          color: #64748b;
          font-weight: 600;
        }
        .motto-box {
          background: #f8fafc;
          border-left: 4px solid ${founderData.themeColor || "#005a36"};
          padding: 12px 18px;
          margin-bottom: 24px;
          border-radius: 0 8px 8px 0;
        }
        .motto-text {
          font-size: 14px;
          font-style: italic;
          color: #334155;
          font-weight: 600;
        }
        .chapter-card {
          margin-bottom: 20px;
          padding: 16px 20px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
          page-break-inside: avoid;
        }
        .chapter-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: ${founderData.themeColor || "#005a36"};
          background: #f0fdf4;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
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
          margin-bottom: 8px;
          text-align: justify;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 11px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          padding-top: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="club-tag">${founderData.clubName} Heritage Chronicle</div>
        <h1 class="founder-name">${founderData.founderName}</h1>
        <div class="founder-dates">${founderData.title || ""}${founderData.birthYear && founderData.deathYear ? ` (${founderData.birthYear} - ${founderData.deathYear})` : ""}</div>
      </div>

      <div class="motto-box">
        <div class="motto-text">"${founderData.famousQuote || founderData.quote || ""}"</div>
      </div>

      <div class="chapters-container">
        ${chaptersHtml}
      </div>

      <div class="footer">
        Official Heritage Publication &bull; Celfonbook 2026 Directory Archive
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
