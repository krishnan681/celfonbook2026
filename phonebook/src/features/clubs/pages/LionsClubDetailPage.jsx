// src/features/clubs/pages/LionsClubDetailPage.jsx
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
} from "lucide-react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbTag } from "react-icons/tb";
import { getClubMembers } from "../services/lionsClubService";
import LionsProfileCard from "../components/LionsProfileCard";
import "../../search/components/css/SearchBar.css";
import "./css/LionsClubPages.css";

const LionsClubDetailPage = () => {
  const { districtId, clubId } = useParams();
  const navigate = useNavigate();

  const decodedClubName = decodeURIComponent(clubId || "");
  const formattedDistrictName = districtId
    ? districtId.toLowerCase().startsWith("district")
      ? districtId
      : `District ${districtId}`
    : "District 3242C";

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search state
  const [businessName, setBusinessName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isKeywordFocused, setIsKeywordFocused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMembers() {
      setIsLoading(true);
      try {
        const data = await getClubMembers(districtId, clubId);
        if (isMounted) {
          setMembers(data || []);
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
  }, [districtId, clubId]);

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
        (m.businessName && m.businessName.toLowerCase().includes(bQuery));

      const matchKeyword =
        !kQuery ||
        (m.keywords && m.keywords.toLowerCase().includes(kQuery)) ||
        (m.profession && m.profession.toLowerCase().includes(kQuery)) ||
        (m.memberNo && m.memberNo.toLowerCase().includes(kQuery)) ||
        (m.mobile && m.mobile.includes(kQuery));

      return matchBusiness && matchKeyword;
    });
  }, [members, businessName, keywords]);

  const leadershipOfficers = filteredMembers.filter((m) => m.isLeadership);
  const generalMembers = filteredMembers.filter((m) => !m.isLeadership);
  const hasBothSections = leadershipOfficers.length > 0 && generalMembers.length > 0;

  const handleResetSearch = () => {
    setBusinessName("");
    setKeywords("");
    setIsKeywordFocused(false);
  };

  return (
    <div className="lions-pages-container">
      <Helmet>
        <title>{decodedClubName} | Directory Roster | Celfonbook</title>
      </Helmet>

      <div className="lions-pages-wrapper">
        {/* Navigation & Breadcrumbs */}
        <div className="lions-nav-bar">
          <button
            type="button"
            className="lions-back-btn"
            onClick={() => navigate(`/lions-club/${districtId || "3242C"}`)}
          >
            <ArrowLeft size={18} />
            <span>Back to Clubs</span>
          </button>

          <div className="lions-breadcrumbs">
            <Link to="/lions-club" className="breadcrumb-link">
              Districts
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to={`/lions-club/${districtId || "3242C"}`} className="breadcrumb-link">
              {formattedDistrictName}
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{decodedClubName}</span>
          </div>
        </div>

        {/* 2-Field Search Bar (Matching SearchPage design) */}
        <div className="directory-search-bar" style={{ marginTop: "10px" }}>
          <div className="search-input-group">
            <div className="search-input-field">
              <HiOutlineBuildingOffice2 className="search-icon" />
              <input
                type="text"
                placeholder="Search Business / Person"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div className="search-input-field">
              <TbTag className="search-icon" />
              <input
                type="text"
                placeholder="Search Keywords / Product"
                value={keywords}
                onFocus={() => setIsKeywordFocused(true)}
                onBlur={() => setIsKeywordFocused(false)}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="search-btn"
              onClick={(e) => e.preventDefault()}
            >
              <Search size={16} />
              Search
            </button>
            {(businessName || keywords) && (
              <button
                type="button"
                className="lions-btn-reset"
                onClick={handleResetSearch}
                title="Reset Filters"
                style={{ height: "42px", padding: "0 14px", borderRadius: "10px" }}
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px" }} />
            <p>Loading member roster from Supabase...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div
            style={{
              padding: "30px",
              background: "white",
              borderRadius: "12px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            <p>No matching member records found for this club.</p>
          </div>
        ) : hasBothSections ? (
          <>
            {/* 1. Leadership Officers Section */}
            <div className="club-leadership-section">
              <div className="section-head">
                <h3>
                  <Crown size={22} color="#005a36" />
                  Results
                </h3>
              </div>

              <div className="cards-grid">
                {leadershipOfficers.map((officer) => (
                  <LionsProfileCard
                    key={officer.id}
                    person={officer}
                    roleTitle={officer.postFull || officer.post_of_member}
                    isLeadership={true}
                    isKeywordFocused={isKeywordFocused}
                  />
                ))}
              </div>
            </div>

            {/* 2. General Members Section */}
            <div className="club-members-section">
              <div className="section-head">
                <h3>
                  <Users size={22} color="#005a36" />
                  Club Members
                </h3>
                <span className="count-pill">{generalMembers.length} Lions</span>
              </div>

              <div className="cards-grid">
                {generalMembers.map((member) => (
                  <LionsProfileCard
                    key={member.id}
                    person={member}
                    roleTitle={member.postFull || member.post_of_member || "Member"}
                    isLeadership={false}
                    isKeywordFocused={isKeywordFocused}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Single Complete Roster Section */
          <div className="club-members-section">
            <div className="section-head">
              <h3>
                <Users size={22} color="#005a36" />
                Club Member Roster
              </h3>
              <span className="count-pill">{filteredMembers.length} Lions</span>
            </div>

            <div className="cards-grid">
              {filteredMembers.map((member) => (
                <LionsProfileCard
                  key={member.id}
                  person={member}
                  roleTitle={member.postFull || member.post_of_member || "Member"}
                  isLeadership={member.isLeadership}
                  isKeywordFocused={isKeywordFocused}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LionsClubDetailPage;
