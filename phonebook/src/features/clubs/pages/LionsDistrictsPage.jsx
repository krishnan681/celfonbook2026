// src/features/clubs/pages/LionsDistrictsPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, User, Key, ArrowLeft, RotateCcw, Building2, ChevronRight, Award, Users } from "lucide-react";
import lionsLogo from "../../../assets/images/Clubs/Lions_Clubs_International_logo.jpg";
import { DISTRICT_DATA, ALL_LIONS_MEMBERS } from "../data/lionsData";
import LionsProfileCard from "../components/LionsProfileCard";
import "./css/LionsClubPages.css";

const LionsDistrictsPage = () => {
  const navigate = useNavigate();
  const [lionsName, setLionsName] = useState("");
  const [lionsKey, setLionsKey] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setHasSearched(true);
  };

  const handleReset = () => {
    setLionsName("");
    setLionsKey("");
    setHasSearched(false);
  };

  const globalSearchResults = useMemo(() => {
    if (!hasSearched && !lionsName && !lionsKey) return null;
    const nameQuery = lionsName.trim().toLowerCase();
    const keyQuery = lionsKey.trim().toLowerCase();

    if (!nameQuery && !keyQuery) return null;

    return ALL_LIONS_MEMBERS.filter((mem) => {
      const matchName =
        !nameQuery ||
        (mem.name && mem.name.toLowerCase().includes(nameQuery)) ||
        (mem.fullName && mem.fullName.toLowerCase().includes(nameQuery)) ||
        (mem.businessName && mem.businessName.toLowerCase().includes(nameQuery));

      const matchKey =
        !keyQuery ||
        (mem.memberNo && mem.memberNo.toLowerCase().includes(keyQuery)) ||
        (mem.mobile && mem.mobile.includes(keyQuery));

      return matchName && matchKey;
    });
  }, [hasSearched, lionsName, lionsKey]);

  return (
    <div className="lions-pages-container">
      <Helmet>
        <title>Lions Club Directory | Districts | Celfonbook</title>
      </Helmet>

      <div className="lions-pages-wrapper">
        {/* Navigation */}
        <div className="lions-nav-bar">
          <button type="button" className="lions-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="lions-hero-header">
          <div className="lions-hero-logo-box">
            <img src={lionsLogo} alt="Lions Clubs International" />
          </div>
          <div className="lions-hero-info">
            <h1>
              Lions Clubs International
              <span className="badge-motto">We Serve</span>
            </h1>
            <p>
              Official Lions District Registry. Search for Lion leaders, member numbers, and explore chartered district clubs.
            </p>
          </div>
        </div>

        {/* Member Search Box */}
        <div className="lions-search-card">
          <div className="lions-search-header">
            <h2>
              <Search size={22} color="#005a36" />
              Member &amp; Officer Search
            </h2>
            <p>
              Enter the Lion Name, Business, or Member Number to search across all clubs.
            </p>
          </div>

          <form onSubmit={handleSearch}>
            <div className="lions-search-inputs-grid">
              <div className="lions-input-group">
                <label htmlFor="lions-name-input">
                  <User size={16} />
                  Lions Name / Business
                </label>
                <div className="lions-input-box">
                  <input
                    id="lions-name-input"
                    type="text"
                    className="lions-input-field"
                    placeholder="e.g. Mani, Muthukumar, Srinivasa Fire"
                    value={lionsName}
                    onChange={(e) => setLionsName(e.target.value)}
                  />
                </div>
              </div>

              <div className="lions-input-group">
                <label htmlFor="lions-key-input">
                  <Key size={16} />
                  Member No. / Mobile
                </label>
                <div className="lions-input-box">
                  <input
                    id="lions-key-input"
                    type="text"
                    className="lions-input-field"
                    placeholder="e.g. 5993702, 9442146076"
                    value={lionsKey}
                    onChange={(e) => setLionsKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="lions-search-actions">
                <button type="submit" className="lions-btn-search">
                  <Search size={18} />
                  <span>Search</span>
                </button>
                {(lionsName || lionsKey || hasSearched) && (
                  <button
                    type="button"
                    className="lions-btn-reset"
                    onClick={handleReset}
                    title="Reset Search"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Global Search Results */}
        {globalSearchResults && (
          <div className="lions-search-results-box">
            <div className="search-results-header">
              <h3>Search Results ({globalSearchResults.length})</h3>
              <button
                type="button"
                className="btn-close-search"
                onClick={handleReset}
              >
                Clear Results
              </button>
            </div>

            {globalSearchResults.length === 0 ? (
              <p className="no-results-msg">
                No matching Lions members found. Try searching with a different name or number.
              </p>
            ) : (
              <div className="cards-grid">
                {globalSearchResults.map((person) => (
                  <LionsProfileCard
                    key={person.id}
                    person={person}
                    roleTitle={person.postFull || person.post || "Member"}
                    isLeadership={person.isLeadership}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Districts Section */}
        <div className="districts-list-section">
          <div className="section-head">
            <h3>
              <Building2 size={24} color="#005a36" />
              Lions Multiple Districts
            </h3>
            <span className="count-pill">{DISTRICT_DATA.length} Active Districts</span>
          </div>

          <div className="cards-grid">
            {DISTRICT_DATA.map((dist) => (
              <div
                key={dist.id}
                className="district-card"
                onClick={() => navigate(`/lions-club/${dist.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/lions-club/${dist.id}`);
                  }
                }}
              >
                <div className="district-badge-row">
                  <span className="district-tag">{dist.tag}</span>
                  <span className="status-pill">{dist.clubsCount}</span>
                </div>

                <h3 className="name">{dist.name}</h3>
                <p className="type-location">
                  <Building2 size={14} /> {dist.region}
                </p>

                <div className="card-info">
                  <p className="district-lead">
                    <Award size={14} /> Governor: <strong>{dist.governor}</strong>
                  </p>
                  <p className="district-strength">
                    <Users size={14} /> Strength: <strong>{dist.membersCount}</strong>
                  </p>
                  <p className="district-desc">{dist.description}</p>
                </div>

                <div className="card-actions">
                  <button type="button" className="btn call">
                    <span>View District Clubs</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LionsDistrictsPage;
