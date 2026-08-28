// src/features/clubs/pages/ClubDistrictsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search,
  User,
  Key,
  ArrowLeft,
  RotateCcw,
  Building2,
  Loader2,
  Cake,
} from "lucide-react";
import {
  getDistricts,
  searchClubMembers,
  getClubInfo,
  getClubCelebrations,
} from "../services/clubService";
import ClubProfileCard from "../components/ClubProfileCard";
import FounderCard from "../components/FounderCard";
import "./css/LionsClubPages.css";

const ClubDistrictsPage = () => {
  const { clubSlug: paramSlug } = useParams();
  const navigate = useNavigate();

  const clubSlug = (paramSlug || "lions").toLowerCase();

  const [clubInfo, setClubInfo] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [celebrations, setCelebrations] = useState([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(true);

  const [memberName, setMemberName] = useState("");
  const [memberKey, setMemberKey] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isKeywordFocused, setIsKeywordFocused] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoadingDistricts(true);
      try {
        const [info, distData, celebs] = await Promise.all([
          getClubInfo(clubSlug),
          getDistricts(clubSlug),
          getClubCelebrations(clubSlug),
        ]);

        if (isMounted) {
          setClubInfo(info);
          if (distData && distData.length > 0) {
            setDistricts(distData);
          }
          setCelebrations(celebs || []);
        }
      } catch (err) {
        console.error("Error loading club districts:", err);
      } finally {
        if (isMounted) setIsLoadingDistricts(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [clubSlug]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!memberName.trim() && !memberKey.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchClubMembers(clubSlug, memberName, memberKey);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setMemberName("");
    setMemberKey("");
    setSearchResults(null);
  };

  const clubTitle = clubInfo?.short_name || clubInfo?.name || (clubSlug === "vasavi" ? "Vasavi Club" : "Lions Club");
  const basePath = clubSlug === "lions" ? "/lions-club" : `/clubs/${clubSlug}`;

  const themeClass = clubSlug === "vasavi" ? "theme-vasavi" : "theme-lions";

  return (
    <div className={`lions-pages-container ${themeClass}`}>
      <Helmet>
        <title>{clubTitle} Directory | Districts | Celfonbook</title>
      </Helmet>

      <div className="lions-pages-wrapper">
        {/* Navigation */}
        <div className="lions-nav-bar">
          <button
            type="button"
            className="lions-back-btn"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Founder & Heritage Card with Download PDF */}
        <FounderCard clubSlug={clubSlug} />

        {/* Today's Celebrations Highlights Banner */}
        {celebrations && celebrations.length > 0 && (
          <div
            className="celebrations-banner"
            style={{
              background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
              border: "1px solid #fde68a",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "24px",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.5rem" }}>🎉</span>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.2rem",
                    color: "#92400e",
                    fontWeight: "700",
                  }}
                >
                  Today's Celebrations in {clubTitle} ({celebrations.length})
                </h3>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                overflowX: "auto",
                paddingBottom: "6px",
              }}
            >
              {celebrations.map((c) => {
                const m = c.member;
                const displayName =
                  m.fullName || m.person_name || m.business_name || "Member";
                const isBday = c.type === "BIRTHDAY";
                const rawPhone = (m.mobile_number || m.phone || "").replace(
                  /[^0-9]/g,
                  ""
                );
                const wishMessage = isBday
                  ? `Dear ${displayName}, wishing you a very Happy Birthday! 🎂🎉 - from ${clubTitle}`
                  : `Dear ${displayName} ${
                      c.spouse ? `& ${c.spouse}` : ""
                    }, wishing you both a very Happy Wedding Anniversary! 💍✨ - from ${clubTitle}`;
                const waUrl = rawPhone
                  ? `https://wa.me/91${rawPhone}?text=${encodeURIComponent(
                      wishMessage
                    )}`
                  : null;

                return (
                  <div
                    key={c.id}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      minWidth: "240px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      borderLeft: isBday
                        ? "4px solid #f59e0b"
                        : "4px solid #ec4899",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        color: isBday ? "#b45309" : "#be185d",
                        marginBottom: "4px",
                      }}
                    >
                      {c.title}
                    </div>
                    <div
                      style={{
                        fontWeight: "700",
                        color: "#1e293b",
                        fontSize: "0.95rem",
                      }}
                    >
                      {displayName}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#64748b",
                        margin: "2px 0 8px",
                      }}
                    >
                      {m.clubName || "Club Member"}
                    </div>
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          background: "#25D366",
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        Wish on WhatsApp
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Member Search Box */}
        <div className="lions-search-card">
          <form onSubmit={handleSearch}>
            <div className="lions-search-inputs-grid">
              <div className="lions-input-group">
                <label htmlFor="member-name-input">
                  <User size={16} />
                  Business / Person Name
                </label>
                <div className="lions-input-box">
                  <input
                    id="member-name-input"
                    type="text"
                    className="lions-input-field"
                    placeholder={`Search ${clubTitle} Name or Business`}
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                  />
                </div>
              </div>

              <div className="lions-input-group">
                <label htmlFor="member-key-input">
                  <Key size={16} />
                  Member No / Mobile / Keyword
                </label>
                <div className="lions-input-box">
                  <input
                    id="member-key-input"
                    type="text"
                    className="lions-input-field"
                    placeholder="Search by Member No, Mobile..."
                    value={memberKey}
                    onFocus={() => setIsKeywordFocused(true)}
                    onBlur={() => setIsKeywordFocused(false)}
                    onChange={(e) => setMemberKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="lions-search-actions">
                <button type="submit" className="lions-btn-search" disabled={isSearching}>
                  {isSearching ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}
                  <span>{isSearching ? "Searching..." : "Search"}</span>
                </button>
                {(memberName || memberKey || searchResults) && (
                  <button
                    type="button"
                    className="lions-btn-reset"
                    onClick={handleReset}
                    title="Clear Search"
                  >
                    <RotateCcw size={18} />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Search Results Display if active */}
        {searchResults !== null ? (
          <div className="district-clubs-list-section" style={{ marginTop: "24px" }}>
            <div className="section-head">
              <h3>
                <Search className="section-icon" />
                Search Results ({searchResults.length})
              </h3>
            </div>
            {searchResults.length === 0 ? (
              <div
                style={{
                  padding: "30px",
                  background: "white",
                  borderRadius: "12px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                <p>No {clubTitle} members found matching your search.</p>
                <button
                  type="button"
                  className="lions-back-btn"
                  style={{ margin: "12px auto 0" }}
                  onClick={handleReset}
                >
                  Back to Districts
                </button>
              </div>
            ) : (
              <div className="cards-grid">
                {searchResults.map((member) => (
                  <ClubProfileCard
                    key={member.id}
                    person={member}
                    roleTitle={member.postFull || member.post}
                    isLeadership={member.isLeadership}
                    isKeywordFocused={isKeywordFocused}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Normal Districts Grid */
          <div className="district-clubs-list-section" style={{ marginTop: "24px" }}>
            <div className="section-head">
              <h3>
                <Building2 className="section-icon" />
                {clubTitle} Districts
              </h3>
              {!isLoadingDistricts && (
                <span className="count-pill">{districts.length} Districts</span>
              )}
            </div>

            {isLoadingDistricts ? (
              <div
                style={{ textAlign: "center", padding: "50px", color: "#64748b" }}
              >
                <Loader2
                  size={32}
                  className="animate-spin"
                  style={{ margin: "0 auto 12px" }}
                />
                <p>Loading {clubTitle} districts...</p>
              </div>
            ) : (
              <div className="cards-grid">
                {districts.map((dist) => {
                  const districtName = dist.name || `District ${dist.id}`;
                  return (
                    <div
                      key={dist.id}
                      className="district-card"
                      onClick={() => navigate(`${basePath}/${dist.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigate(`${basePath}/${dist.id}`);
                        }
                      }}
                    >
                      <h3 className="name">{districtName}</h3>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubDistrictsPage;
