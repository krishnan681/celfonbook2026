// src/features/clubs/components/FounderBookModal.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  Printer,
  Quote,
  Award,
  Bookmark,
  Share2,
  Check,
} from "lucide-react";
import { downloadFounderPdf } from "../utils/founderPdfHelper";
import "./css/FounderBookModal.css";

export default function FounderBookModal({ isOpen, onClose, founderData }) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !founderData) return null;

  const pages = founderData.pages || [];
  const isVasavi = (founderData.clubSlug || "").toLowerCase() === "vasavi";
  const themeColor = isVasavi ? "#7c2d12" : "#005a36";
  const accentColor = isVasavi ? "#ea580c" : "#f2a900";

  // Filter pages by search query if present
  const filteredPages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter((p) => {
      const titleMatch = (p.title || "").toLowerCase().includes(q);
      const chapterMatch = (p.chapter || "").toLowerCase().includes(q);
      const contentMatch = (p.content || []).some((para) =>
        para.toLowerCase().includes(q)
      );
      return titleMatch || chapterMatch || contentMatch;
    });
  }, [pages, searchQuery]);

  const currentPage = pages[activePageIndex] || pages[0] || {};

  const handlePrev = () => {
    if (activePageIndex > 0) {
      setActivePageIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (activePageIndex < pages.length - 1) {
      setActivePageIndex((prev) => prev + 1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${founderData.founderName} - ${founderData.clubName} Heritage Book`,
          text: `Explore the official ${founderData.clubName} Heritage Chronicle book online!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="founder-book-overlay" onClick={onClose}>
      <div
        className="founder-book-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${founderData.founderName} Book`}
      >
        {/* Top Accent Strip */}
        <div
          className="founder-book-top-bar"
          style={{
            background: isVasavi
              ? "linear-gradient(90deg, #7c2d12, #ea580c, #f59e0b)"
              : "linear-gradient(90deg, #005a36, #059669, #f2a900)",
          }}
        />

        {/* Modal Header */}
        <div className="founder-book-header">
          <div className="founder-book-header-left">
            <div
              className="founder-book-icon-badge"
              style={{
                background: isVasavi ? "rgba(124, 45, 18, 0.1)" : "rgba(0, 90, 54, 0.1)",
                color: themeColor,
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <span
                className="founder-book-club-tag"
                style={{ color: themeColor }}
              >
                {founderData.clubName} &bull; Heritage Chronicle
              </span>
              <h2 className="founder-book-main-title">
                {founderData.founderName}
              </h2>
            </div>
          </div>

          <div className="founder-book-header-actions">
            <button
              type="button"
              className="founder-book-action-btn"
              onClick={handleShare}
              title="Share Book"
            >
              {copied ? <Check size={16} color="#16a34a" /> : <Share2 size={16} />}
              <span className="btn-label">{copied ? "Copied" : "Share"}</span>
            </button>

            <button
              type="button"
              className="founder-book-action-btn"
              onClick={() => downloadFounderPdf(founderData)}
              title="Print or Save PDF"
            >
              <Printer size={16} />
              <span className="btn-label">Print / PDF</span>
            </button>

            <button
              type="button"
              className="founder-book-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar + Main Content */}
        <div className="founder-book-body">
          {/* Table of Contents / Sidebar */}
          <aside className="founder-book-toc">
            <div className="founder-book-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search topics / text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="founder-book-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="clear-search-btn"
                >
                  &times;
                </button>
              )}
            </div>

            <div className="founder-book-chapters-list">
              <div className="toc-header">
                <Bookmark size={14} />
                <span>Table of Contents ({pages.length} Chapters)</span>
              </div>

              {filteredPages.map((page, idx) => {
                const originalIndex = pages.findIndex(
                  (p) => p.pageNumber === page.pageNumber
                );
                const isActive = originalIndex === activePageIndex;

                return (
                  <button
                    key={page.pageNumber || idx}
                    type="button"
                    className={`toc-chapter-item ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setActivePageIndex(originalIndex);
                    }}
                    style={{
                      borderLeftColor: isActive ? themeColor : "transparent",
                    }}
                  >
                    <span
                      className="toc-chapter-num"
                      style={{
                        background: isActive ? themeColor : "#f1f5f9",
                        color: isActive ? "#ffffff" : "#475569",
                      }}
                    >
                      {page.pageNumber || idx + 1}
                    </span>
                    <div className="toc-chapter-info">
                      <span className="toc-chapter-tag">{page.chapter}</span>
                      <strong className="toc-chapter-title">{page.title}</strong>
                    </div>
                  </button>
                );
              })}

              {filteredPages.length === 0 && (
                <div className="toc-no-results">
                  <p>No chapters match "{searchQuery}"</p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="reset-filter-btn"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Main Reading View */}
          <main className="founder-book-content">
            <div className="founder-book-content-inner">
              {/* Chapter Badge & Title */}
              <div className="reading-chapter-header">
                <div
                  className="reading-chapter-badge"
                  style={{
                    background: isVasavi ? "rgba(124, 45, 18, 0.08)" : "rgba(0, 90, 54, 0.08)",
                    color: themeColor,
                  }}
                >
                  <Award size={13} />
                  <span>{currentPage.chapter || `Chapter ${activePageIndex + 1}`}</span>
                </div>
                <h3 className="reading-chapter-title">{currentPage.title}</h3>
              </div>

              {/* Chapter Content Paragraphs */}
              <div className="reading-paragraphs">
                {(currentPage.content || []).map((para, pIdx) => (
                  <p key={pIdx} className="reading-para">
                    {para}
                  </p>
                ))}
              </div>

              {/* Famous Quote Banner if on Chapter 1 or last chapter */}
              {(founderData.famousQuote || founderData.quote) && (
                <div
                  className="reading-quote-box"
                  style={{
                    borderLeft: `4px solid ${themeColor}`,
                    background: isVasavi ? "rgba(124, 45, 18, 0.04)" : "rgba(0, 90, 54, 0.04)",
                  }}
                >
                  <Quote size={20} style={{ color: themeColor, flexShrink: 0 }} />
                  <div>
                    <span className="reading-quote-text">
                      "{founderData.famousQuote || founderData.quote}"
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Chapter Navigation Bar */}
            <div className="founder-book-footer">
              <button
                type="button"
                className="nav-btn prev-btn"
                onClick={handlePrev}
                disabled={activePageIndex === 0}
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>

              <div className="page-indicator">
                <span>
                  Chapter <strong>{activePageIndex + 1}</strong> of{" "}
                  <strong>{pages.length}</strong>
                </span>
                <div className="progress-dots">
                  {pages.map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`dot ${dotIdx === activePageIndex ? "active" : ""}`}
                      onClick={() => setActivePageIndex(dotIdx)}
                      style={{
                        background:
                          dotIdx === activePageIndex ? themeColor : "#cbd5e1",
                      }}
                      title={`Go to chapter ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="nav-btn next-btn"
                onClick={handleNext}
                disabled={activePageIndex === pages.length - 1}
                style={{
                  background: activePageIndex === pages.length - 1 ? "#f1f5f9" : themeColor,
                  color: activePageIndex === pages.length - 1 ? "#94a3b8" : "#ffffff",
                }}
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
