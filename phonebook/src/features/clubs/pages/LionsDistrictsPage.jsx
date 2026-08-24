// src/features/clubs/pages/LionsDistrictsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search,
  User,
  Key,
  ArrowLeft,
  RotateCcw,
  Building2,
  Loader2,
} from "lucide-react";
import { getDistricts, searchLionsMembers } from "../services/lionsClubService";
import LionsProfileCard from "../components/LionsProfileCard";
import "./css/LionsClubPages.css";

const LionsDistrictsPage = () => {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([{ id: "3424C", name: "District 3424C" }]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(true);

  const [lionsName, setLionsName] = useState("");
  const [lionsKey, setLionsKey] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isKeywordFocused, setIsKeywordFocused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDistricts() {
      setIsLoadingDistricts(true);
      try {
        const data = await getDistricts();
        if (isMounted && data && data.length > 0) {
          setDistricts(data);
        }
      } catch (err) {
        console.error("Error loading districts:", err);
      } finally {
        if (isMounted) setIsLoadingDistricts(false);
      }
    }
    loadDistricts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!lionsName.trim() && !lionsKey.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLionsMembers(lionsName, lionsKey);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setLionsName("");
    setLionsKey("");
    setSearchResults(null);
  };

  return (
    <div className="lions-pages-container">
      <Helmet>
        <title>Lions Club Directory | Districts | Celfonbook</title>
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

        {/* Member Search Box */}
        <div className="lions-search-card">
          <form onSubmit={handleSearch}>
            <div className="lions-search-inputs-grid">
              <div className="lions-input-group">
                <label htmlFor="lions-name-input">
                  <User size={16} />
                  Business / Person Name
                </label>
                <div className="lions-input-box">
                  <input
                    id="lions-name-input"
                    type="text"
                    className="lions-input-field"
                    placeholder="Search by Name or Business"
                    value={lionsName}
                    onChange={(e) => setLionsName(e.target.value)}
                  />
                </div>
              </div>

              <div className="lions-input-group">
                <label htmlFor="lions-key-input">
                  <Key size={16} />
                  Member No / Mobile / Keyword
                </label>
                <div className="lions-input-box">
                  <input
                    id="lions-key-input"
                    type="text"
                    className="lions-input-field"
                    placeholder="Search by Member No, Mobile..."
                    value={lionsKey}
                    onFocus={() => setIsKeywordFocused(true)}
                    onBlur={() => setIsKeywordFocused(false)}
                    onChange={(e) => setLionsKey(e.target.value)}
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
                {(lionsName || lionsKey || searchResults) && (
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
        {searchResults !== null && (
          <div className="lions-search-results-box">
            <div className="search-results-header">
              <h3>Search Results ({searchResults.length})</h3>
              <button
                type="button"
                className="btn-close-search"
                onClick={handleReset}
              >
                Clear Results
              </button>
            </div>

            {searchResults.length === 0 ? (
              <p className="no-results-msg">
                No matching Lions members found in the directory.
              </p>
            ) : (
              <div className="cards-grid">
                {searchResults.map((person) => (
                  <LionsProfileCard
                    key={person.id}
                    person={person}
                    roleTitle={person.postFull || person.post_of_member || "Member"}
                    isLeadership={person.isLeadership}
                    isKeywordFocused={isKeywordFocused}
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
            {!isLoadingDistricts && (
              <span className="count-pill">
                {districts.length} {districts.length === 1 ? "District" : "Districts"}
              </span>
            )}
          </div>

          {isLoadingDistricts ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 10px" }} />
              <p>Loading districts from directory...</p>
            </div>
          ) : (
            <div className="cards-grid">
              {districts.map((dist) => (
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
                  <h3 className="name">{dist.name}</h3>
                  {dist.totalClubs !== undefined && dist.totalClubs > 0 && (
                    <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                      {dist.totalClubs} {dist.totalClubs === 1 ? "Club" : "Clubs"} • {dist.totalMembers} Lions
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LionsDistrictsPage;
