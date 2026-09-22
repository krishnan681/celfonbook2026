// src/features/clubs/pages/ClubDetailPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ChevronRight,
  Crown,
  Users,
  Search,
  RotateCcw,
  Loader2,
  User,
  Key,
  Award,
  MessageSquare,
} from "lucide-react";
import {
  getClubMembers,
  getClubInfo,
  getClubCelebrationsTimeline,
  getDistinctPostTabs,
  matchesPostFilter,
} from "../services/clubService";
import ClubProfileCard from "../components/ClubProfileCard";
import CelebrationsAside from "../components/CelebrationsAside";
import TabsCarousel from "../components/TabsCarousel";
import BulkSmsModal from "../components/BulkSmsModal";
import "../../search/components/css/SearchBar.css";
import "./css/LionsClubPages.css";

const ClubDetailPage = () => {
  const { districtId, clubId, clubSlug: paramSlug } = useParams();
  const navigate = useNavigate();

  const clubSlug = (paramSlug || "lions").toLowerCase();
  const [clubInfo, setClubInfo] = useState(null);

  const decodedClubName = decodeURIComponent(clubId || "");
  const formattedDistrictName = districtId
    ? districtId.toLowerCase().startsWith("district")
      ? districtId
      : `District ${districtId}`
    : clubSlug === "vasavi"
    ? "District V501A"
    : "District 3242C";

  const [members, setMembers] = useState([]);
  const [celebrationsTimeline, setCelebrationsTimeline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Active filter tab (e.g. "ALL_MEMBERS", "POST_president", "POST_secretary", etc.)
  const [activeFilter, setActiveFilter] = useState("ALL_MEMBERS");
  const [isBulkSmsOpen, setIsBulkSmsOpen] = useState(false);

  // Search state
  const [businessName, setBusinessName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isKeywordFocused, setIsKeywordFocused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMembers() {
      setIsLoading(true);
      try {
        const [info, data, timeline] = await Promise.all([
          getClubInfo(clubSlug),
          getClubMembers(districtId, clubId, clubSlug),
          getClubCelebrationsTimeline(clubSlug, districtId),
        ]);

        if (isMounted) {
          setClubInfo(info);
          setMembers(data || []);
          setCelebrationsTimeline(timeline);
        }
      } catch (err) {
        console.error("Error loading club members:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadMembers();
    return () => {
      isMounted = false;
    };
  }, [districtId, clubId, clubSlug]);

  const clubTitle =
    clubInfo?.short_name ||
    clubInfo?.name ||
    (clubSlug === "vasavi" ? "Vasavi Club" : "Lions Club");
  const basePath = clubSlug === "lions" ? "/lions-club" : `/clubs/${clubSlug}`;

  // Dynamic filter tabs generated from backend post_of_member data (without Clubs tab)
  const filterTabs = useMemo(() => {
    return getDistinctPostTabs(members, [], false);
  }, [members]);

  // Ensure active filter is valid
  useEffect(() => {
    if (!isLoading && filterTabs.length > 0) {
      const exists = filterTabs.some((t) => t.id === activeFilter);
      if (!exists) {
        setActiveFilter("ALL_MEMBERS");
      }
    }
  }, [filterTabs, activeFilter, isLoading]);

  // Filtered members based on search inputs
  const filteredMembers = useMemo(() => {
    const bQuery = businessName.trim().toLowerCase();
    const kQuery = keywords.trim().toLowerCase();

    if (!bQuery && !kQuery) return members;

    return members.filter((m) => {
      const matchBusiness =
        !bQuery ||
        (m.name && m.name.toLowerCase().includes(bQuery)) ||
        (m.fullName && m.fullName.toLowerCase().includes(bQuery)) ||
        (m.businessName && m.businessName.toLowerCase().includes(bQuery)) ||
        (m.person_name && m.person_name.toLowerCase().includes(bQuery));

      const matchKeyword =
        !kQuery ||
        (m.keywords && m.keywords.toLowerCase().includes(kQuery)) ||
        (m.profession && m.profession.toLowerCase().includes(kQuery)) ||
        (m.activity && m.activity.toLowerCase().includes(kQuery)) ||
        (m.memberNo && m.memberNo.toLowerCase().includes(kQuery)) ||
        (m.membership_number &&
          String(m.membership_number).toLowerCase().includes(kQuery)) ||
        (m.mobile && m.mobile.includes(kQuery)) ||
        (m.mobile_number && m.mobile_number.includes(kQuery));

      return matchBusiness && matchKeyword;
    });
  }, [members, businessName, keywords]);

  const hasSearchQuery = Boolean(businessName || keywords);

  // Members filtered by search AND active designation tab
  const displayedMembers = useMemo(() => {
    if (activeFilter === "ALL_MEMBERS" || hasSearchQuery) {
      return filteredMembers;
    }
    return filteredMembers.filter((m) => matchesPostFilter(m, activeFilter));
  }, [filteredMembers, activeFilter, hasSearchQuery]);

  const leadershipOfficers = displayedMembers.filter((m) => m.isLeadership);
  const generalMembers = displayedMembers.filter((m) => !m.isLeadership);
  const hasBothSections =
    activeFilter === "ALL_MEMBERS" &&
    leadershipOfficers.length > 0 &&
    generalMembers.length > 0;

  const handleResetSearch = () => {
    setBusinessName("");
    setKeywords("");
    setIsKeywordFocused(false);
  };

  const currentTabMeta = useMemo(() => {
    if (activeFilter === "ALL_MEMBERS") {
      return {
        label: `Members of ${decodedClubName}`,
        icon: Users,
      };
    }
    const tabObj = filterTabs.find((t) => t.id === activeFilter);
    return {
      label: tabObj ? `${tabObj.label} - ${decodedClubName}` : decodedClubName,
      icon: tabObj?.icon || Award,
    };
  }, [activeFilter, decodedClubName, filterTabs]);

  const themeClass = clubSlug === "vasavi" ? "theme-vasavi" : "theme-lions";

  return (
    <div className={`lions-pages-container ${themeClass}`}>
      <Helmet>
        <title>
          {decodedClubName} | {clubTitle} Directory | Celfonbook
        </title>
      </Helmet>

      <div className="lions-pages-wrapper">
        {/* Navigation & Breadcrumbs */}
        <div className="lions-nav-bar">
          <button
            type="button"
            className="lions-back-btn"
            onClick={() => navigate(`${basePath}/${districtId || "3242C"}`)}
          >
            <ArrowLeft size={18} />
            <span>Back to Clubs</span>
          </button>

          <div className="lions-breadcrumbs">
            <Link to={basePath} className="breadcrumb-link">
              Districts
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link
              to={`${basePath}/${districtId || "3242C"}`}
              className="breadcrumb-link"
            >
              {formattedDistrictName}
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{decodedClubName}</span>
          </div>
        </div>

        {/* Club Detail Hero Header Banner (Green for Lions / Red for Vasavi) */}
        <div className="club-detail-banner-card">
          <div className="club-banner-top">
            <span className="club-district-tag">{formattedDistrictName}</span>
            <span className="club-milestone-tag">
              🏛️ {members.length} Registered Members
            </span>
          </div>
          <h2>{decodedClubName}</h2>
        </div>

        {/* 2-Column Responsive Layout: Left Main Column & Right Celebrations Aside */}
        <div className="district-content-layout">
          {/* LEFT MAIN COLUMN */}
          <div className="district-main-column">
            {/* 2-Field Search Bar */}
            <div className="lions-search-card" style={{ marginTop: "0", marginBottom: "20px" }}>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="lions-search-inputs-grid">
                  <div className="lions-input-group">
                    <label htmlFor="club-detail-name-input">
                      <User size={16} />
                      Business / Person Name
                    </label>
                    <div className="lions-input-box">
                      <input
                        id="club-detail-name-input"
                        type="text"
                        className="lions-input-field"
                        placeholder="Business / Person Name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="lions-input-group">
                    <label htmlFor="club-detail-key-input">
                      <Key size={16} />
                      Keyword Search
                    </label>
                    <div className="lions-input-box">
                      <input
                        id="club-detail-key-input"
                        type="text"
                        className="lions-input-field"
                        placeholder="Keyword Search"
                        value={keywords}
                        onFocus={() => setIsKeywordFocused(true)}
                        onBlur={() => setIsKeywordFocused(false)}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="lions-search-actions">
                    <button
                      type="submit"
                      className="lions-btn-search"
                    >
                      <Search size={18} />
                      <span>Search</span>
                    </button>
                    {(businessName || keywords) && (
                      <button
                        type="button"
                        className="lions-btn-reset"
                        onClick={handleResetSearch}
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

            {/* Dynamic post_of_member Filter Tabs in Rows (Shown when not searching and multiple tabs exist) */}
            {!hasSearchQuery && filterTabs.length > 2 && (
              <TabsCarousel
                tabs={filterTabs}
                activeTabId={activeFilter}
                onSelectTab={setActiveFilter}
                isLoading={isLoading}
              />
            )}

            {/* Main Club Roster Content */}
            <div className="district-clubs-list-section">
              {isLoading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "50px",
                    color: "#64748b",
                  }}
                >
                  <Loader2
                    size={32}
                    className="animate-spin"
                    style={{ margin: "0 auto 12px" }}
                  />
                  <p>Loading members for {decodedClubName}...</p>
                </div>
              ) : displayedMembers.length === 0 ? (
                <div
                  style={{
                    padding: "30px",
                    background: "white",
                    borderRadius: "12px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  <p>
                    {hasSearchQuery
                      ? `No members found in ${decodedClubName} matching your search.`
                      : `No members found with this designation in ${decodedClubName}.`}
                  </p>
                  {(businessName || keywords) && (
                    <button
                      type="button"
                      className="lions-back-btn"
                      style={{ margin: "12px auto 0" }}
                      onClick={handleResetSearch}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : hasBothSections ? (
                /* Split layout: Leadership first, then General members */
                <>
                  {leadershipOfficers.length > 0 && (
                    <div style={{ marginBottom: "32px" }}>
                      <div className="section-head">
                        <h3>
                          <Crown className="section-icon" />
                          Club Leadership &amp; Board Officers
                        </h3>
                        <span className="count-pill">
                          {leadershipOfficers.length} Officers
                        </span>
                      </div>
                      <div className="cards-grid">
                        {leadershipOfficers.map((member) => (
                          <ClubProfileCard
                            key={member.id}
                            person={member}
                            roleTitle={member.postFull || member.post}
                            isLeadership={true}
                            isKeywordFocused={isKeywordFocused}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {generalMembers.length > 0 && (
                    <div>
                      <div className="section-head">
                        <h3>
                          <Users className="section-icon" />
                          Club Members
                        </h3>
                        <span className="count-pill">
                          {generalMembers.length} Members
                        </span>
                      </div>
                      <div className="cards-grid">
                        {generalMembers.map((member) => (
                          <ClubProfileCard
                            key={member.id}
                            person={member}
                            roleTitle={member.postFull || member.post}
                            isLeadership={false}
                            isKeywordFocused={isKeywordFocused}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Unified single grid */
                <>
                  <div className="section-head">
                    <h3>
                      {React.createElement(currentTabMeta.icon, { className: "section-icon" })}
                      {currentTabMeta.label}
                    </h3>
                    <div className="section-actions">
                      <span className="count-pill">
                        {displayedMembers.length} {displayedMembers.length === 1 ? "Member" : "Members"}
                      </span>
                      {displayedMembers.length > 0 && (
                        <button
                          type="button"
                          className="lions-bulk-sms-btn"
                          onClick={() => setIsBulkSmsOpen(true)}
                          title={`Send Bulk SMS to ${displayedMembers.length} members`}
                        >
                          <MessageSquare size={15} />
                          <span>Bulk SMS</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="cards-grid">
                    {displayedMembers.map((member) => (
                      <ClubProfileCard
                        key={member.id}
                        person={member}
                        roleTitle={member.postFull || member.post}
                        isLeadership={member.isLeadership}
                        isKeywordFocused={isKeywordFocused}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Constant Celebrations & Wishes Card */}
          <div className="district-celebrations-aside-column">
            <CelebrationsAside
              timeline={celebrationsTimeline}
              clubTitle={formattedDistrictName}
              basePath={basePath}
            />
          </div>
        </div>
      </div>

      {/* Bulk SMS Modal */}
      <BulkSmsModal
        isOpen={isBulkSmsOpen}
        onClose={() => setIsBulkSmsOpen(false)}
        members={displayedMembers}
        title={
          currentTabMeta.label
            ? currentTabMeta.label.split(" - ")[0]
            : "Members"
        }
        clubOrDistrictName={decodedClubName}
        themeClass={themeClass}
      />
    </div>
  );
};

export default ClubDetailPage;
