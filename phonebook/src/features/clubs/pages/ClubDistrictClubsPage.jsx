// src/features/clubs/pages/ClubDistrictClubsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ChevronRight,
  Building2,
  Loader2,
  Search,
  RotateCcw,
  Crown,
  ShieldCheck,
  Award,
  Compass,
  Briefcase,
  Users,
  User,
  Key,
} from "lucide-react";
import {
  getDistrictData,
  getClubInfo,
  getClubCelebrationsTimeline,
  searchClubMembers,
} from "../services/clubService";
import ClubProfileCard from "../components/ClubProfileCard";
import FounderCard from "../components/FounderCard";
import CelebrationsAside from "../components/CelebrationsAside";
import TabsCarousel from "../components/TabsCarousel";
import "../../search/components/css/SearchBar.css";
import "./css/LionsClubPages.css";

/**
 * Role matching utility for club designation tabs
 */
const matchesRoleFilter = (member, filterKey) => {
  if (!member) return false;
  const post = (member.post || "").trim().toLowerCase();
  const postFull = (member.postFull || "").trim().toLowerCase();
  const combined = `${post} ${postFull}`;

  switch (filterKey) {
    case "DC":
      return (
        post === "dc" ||
        combined.includes("district chairperson") ||
        combined.includes("district chairman") ||
        combined.includes("district coordinator") ||
        /\bdc\b/i.test(post) ||
        post.startsWith("dc ") ||
        post.startsWith("dc-") ||
        post.startsWith("dc/")
      );
    case "RC":
      return (
        post === "rc" ||
        combined.includes("region chairperson") ||
        combined.includes("region chairman") ||
        combined.includes("regional chairperson") ||
        /\brc\b/i.test(post) ||
        post.startsWith("rc ") ||
        post.startsWith("rc-") ||
        post.startsWith("rc/")
      );
    case "ZC":
      return (
        post === "zc" ||
        combined.includes("zone chairperson") ||
        combined.includes("zone chairman") ||
        /\bzc\b/i.test(post) ||
        post.startsWith("zc ") ||
        post.startsWith("zc-") ||
        post.startsWith("zc/")
      );
    case "DG":
      return (
        post === "dg" ||
        (combined.includes("district governor") &&
          !combined.includes("vice") &&
          !combined.includes("vdg")) ||
        /\bdg\b/i.test(post)
      );
    case "CABINET":
      return member.isLeadership === true;
    case "ALL_MEMBERS":
      return true;
    default:
      return true;
  }
};

const ClubDistrictClubsPage = () => {
  const { districtId, clubSlug: paramSlug } = useParams();
  const navigate = useNavigate();

  const clubSlug = (paramSlug || "lions").toLowerCase();
  const [clubInfo, setClubInfo] = useState(null);

  const formattedDistrictName = districtId
    ? districtId.toLowerCase().startsWith("district")
      ? districtId
      : `District ${districtId}`
    : clubSlug === "vasavi"
    ? "District V501A"
    : "District 3242C";

  const [clubs, setClubs] = useState([]);
  const [members, setMembers] = useState([]);
  const [celebrationsTimeline, setCelebrationsTimeline] = useState({
    today: [],
    tomorrow: [],
    thisWeek: [],
    thisMonth: [],
    upcoming: [],
    recentPast: [],
    all: [],
    totalCelebrants: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Active filter tab: "CLUBS", "DC", "RC", "ZC", "DG", "CABINET", "ALL_MEMBERS"
  const [activeFilter, setActiveFilter] = useState("CLUBS");

  // Search state
  const [businessName, setBusinessName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isKeywordFocused, setIsKeywordFocused] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDistrict() {
      setIsLoading(true);
      try {
        const [info, data, timeline] = await Promise.all([
          getClubInfo(clubSlug),
          getDistrictData(districtId, clubSlug),
          getClubCelebrationsTimeline(clubSlug, districtId),
        ]);

        if (isMounted) {
          setClubInfo(info);
          setClubs(data.clubs || []);
          setMembers(data.members || []);
          setCelebrationsTimeline(timeline);
        }
      } catch (err) {
        console.error("Error loading district data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDistrict();
    return () => {
      isMounted = false;
    };
  }, [districtId, clubSlug]);

  const clubTitle =
    clubInfo?.short_name ||
    clubInfo?.name ||
    (clubSlug === "vasavi" ? "Vasavi Club" : "Lions Club");
  const basePath = clubSlug === "lions" ? "/lions-club" : `/clubs/${clubSlug}`;

  const hasSearchQuery = Boolean(
    businessName.trim() || keywords.trim() || searchResults !== null
  );

  // Search handler (Global / Database search with fallback to local district members)
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const bQuery = businessName.trim();
    const kQuery = keywords.trim();

    if (!bQuery && !kQuery) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchClubMembers(clubSlug, bQuery, kQuery);
      setSearchResults(results || []);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetSearch = () => {
    setBusinessName("");
    setKeywords("");
    setSearchResults(null);
    setIsKeywordFocused(false);
  };

  // Real-time matching members for search
  const displayedSearchResults = useMemo(() => {
    const bQuery = businessName.trim().toLowerCase();
    const kQuery = keywords.trim().toLowerCase();

    if (!bQuery && !kQuery) {
      return searchResults || [];
    }

    // Filter local district members
    const localMatches = members.filter((member) => {
      const matchName =
        !bQuery ||
        (member.fullName && member.fullName.toLowerCase().includes(bQuery)) ||
        (member.person_name && member.person_name.toLowerCase().includes(bQuery)) ||
        (member.name && member.name.toLowerCase().includes(bQuery)) ||
        (member.business_name && member.business_name.toLowerCase().includes(bQuery)) ||
        (member.fullBusinessName && member.fullBusinessName.toLowerCase().includes(bQuery)) ||
        (member.club && member.club.toLowerCase().includes(bQuery)) ||
        (member.clubName && member.clubName.toLowerCase().includes(bQuery));

      const matchKeyword =
        !kQuery ||
        (member.keywords && member.keywords.toLowerCase().includes(kQuery)) ||
        (member.profession && member.profession.toLowerCase().includes(kQuery)) ||
        (member.activity && member.activity.toLowerCase().includes(kQuery)) ||
        (member.description && member.description.toLowerCase().includes(kQuery)) ||
        (member.post && member.post.toLowerCase().includes(kQuery)) ||
        (member.postFull && member.postFull.toLowerCase().includes(kQuery)) ||
        (member.memberNo && String(member.memberNo).toLowerCase().includes(kQuery)) ||
        (member.membership_number && String(member.membership_number).toLowerCase().includes(kQuery)) ||
        (member.mobile && member.mobile.includes(kQuery)) ||
        (member.mobile_number && member.mobile_number.includes(kQuery)) ||
        (member.city && member.city.toLowerCase().includes(kQuery)) ||
        (member.club && member.club.toLowerCase().includes(kQuery));

      return matchName && matchKeyword;
    });

    if (searchResults && searchResults.length > 0) {
      const seen = new Set(localMatches.map((m) => m.id));
      const merged = [...localMatches];
      searchResults.forEach((m) => {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          merged.push(m);
        }
      });
      return merged;
    }

    return localMatches;
  }, [members, businessName, keywords, searchResults]);

  // Real-time matching clubs for search
  const displayedMatchingClubs = useMemo(() => {
    const bQuery = businessName.trim().toLowerCase();
    const kQuery = keywords.trim().toLowerCase();

    if (!bQuery && !kQuery) return [];

    return clubs.filter((club) => {
      const matchName =
        !bQuery ||
        (club.name && club.name.toLowerCase().includes(bQuery)) ||
        (club.district && club.district.toLowerCase().includes(bQuery));

      const matchKeyword =
        !kQuery ||
        (club.id && String(club.id).toLowerCase().includes(kQuery)) ||
        (club.name && club.name.toLowerCase().includes(kQuery));

      return matchName && matchKeyword;
    });
  }, [clubs, businessName, keywords]);

  // Compute counts for filter tabs
  const tabCounts = useMemo(() => {
    return {
      CLUBS: clubs.length,
      DC: members.filter((m) => matchesRoleFilter(m, "DC")).length,
      RC: members.filter((m) => matchesRoleFilter(m, "RC")).length,
      ZC: members.filter((m) => matchesRoleFilter(m, "ZC")).length,
      DG: members.filter((m) => matchesRoleFilter(m, "DG")).length,
      CABINET: members.filter((m) => matchesRoleFilter(m, "CABINET")).length,
      ALL_MEMBERS: members.length,
    };
  }, [clubs, members]);

  // Filtered Clubs when "CLUBS" is active
  const filteredClubs = useMemo(() => {
    if (activeFilter !== "CLUBS") return [];
    return clubs;
  }, [clubs, activeFilter]);

  // Filtered Members for other designation tabs
  const filteredMembers = useMemo(() => {
    if (activeFilter === "CLUBS") return [];
    return members.filter((m) => matchesRoleFilter(m, activeFilter));
  }, [members, activeFilter]);

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setBusinessName("");
    setKeywords("");
    setSearchResults(null);
  };

  // Dynamic filter tabs definition (Celebrations is now exclusively on the right aside)
  const filterTabs = [
    { id: "CLUBS", label: "Clubs", count: tabCounts.CLUBS, icon: Building2 },
    {
      id: "DC",
      label: "DC",
      count: tabCounts.DC,
      icon: ShieldCheck,
      title: "District Chairpersons",
    },
    {
      id: "RC",
      label: "RC",
      count: tabCounts.RC,
      icon: Compass,
      title: "Region Chairpersons",
    },
    {
      id: "ZC",
      label: "ZC",
      count: tabCounts.ZC,
      icon: Briefcase,
      title: "Zone Chairpersons",
    },
    {
      id: "DG",
      label: "DG",
      count: tabCounts.DG,
      icon: Crown,
      title: "District Governor",
    },
    {
      id: "CABINET",
      label: "Cabinet Officers",
      count: tabCounts.CABINET,
      icon: Award,
      title: "Designated Cabinet Members",
    },
    {
      id: "ALL_MEMBERS",
      label: "All Members",
      count: tabCounts.ALL_MEMBERS,
      icon: Users,
      title: "Complete Member Roster",
    },
  ];

  // Section title metadata
  const currentSectionMeta = useMemo(() => {
    switch (activeFilter) {
      case "CLUBS":
        return {
          title: `Clubs in ${formattedDistrictName}`,
          count: filteredClubs.length,
          unit: "Clubs",
          icon: <Building2 className="section-icon" />,
        };
      case "DC":
        return {
          title: `District Chairpersons (DC) - ${formattedDistrictName}`,
          count: filteredMembers.length,
          unit: "Chairpersons",
          icon: <ShieldCheck className="section-icon" />,
        };
      case "RC":
        return {
          title: `Region Chairpersons (RC) - ${formattedDistrictName}`,
          count: filteredMembers.length,
          unit: "Chairpersons",
          icon: <Compass className="section-icon" />,
        };
      case "ZC":
        return {
          title: `Zone Chairpersons (ZC) - ${formattedDistrictName}`,
          count: filteredMembers.length,
          unit: "Chairpersons",
          icon: <Briefcase className="section-icon" />,
        };
      case "DG":
        return {
          title: `District Governor (DG) - ${formattedDistrictName}`,
          count: filteredMembers.length,
          unit: "Officers",
          icon: <Crown className="section-icon" />,
        };
      case "CABINET":
        return {
          title: `Cabinet Officers - ${formattedDistrictName}`,
          count: filteredMembers.length,
          unit: "Officers",
          icon: <Award className="section-icon" />,
        };
      case "ALL_MEMBERS":
        return {
          title: `All Directory Members in ${formattedDistrictName}`,
          count: filteredMembers.length,
          unit: "Members",
          icon: <Users className="section-icon" />,
        };
      default:
        return {
          title: "Directory Listing",
          count: 0,
          unit: "Items",
          icon: <Building2 className="section-icon" />,
        };
    }
  }, [activeFilter, filteredClubs, filteredMembers, formattedDistrictName]);

  const themeClass = clubSlug === "vasavi" ? "theme-vasavi" : "theme-lions";

  return (
    <div className={`lions-pages-container ${themeClass}`}>
      <Helmet>
        <title>
          {formattedDistrictName} Clubs & Members | {clubTitle} | Celfonbook
        </title>
      </Helmet>

      <div className="lions-pages-wrapper">
        {/* Navigation & Breadcrumbs */}
        <div className="lions-nav-bar">
          <button
            type="button"
            className="lions-back-btn"
            onClick={() => navigate(basePath)}
          >
            <ArrowLeft size={18} />
            <span>Back to Districts</span>
          </button>

          <div className="lions-breadcrumbs">
            <Link to={basePath} className="breadcrumb-link">
              Districts
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{formattedDistrictName}</span>
          </div>
        </div>

        {/* Founder & Heritage Card with Download PDF */}
        <FounderCard clubSlug={clubSlug} />

        {/* 2-Field Search Bar */}
        <div className="lions-search-card" style={{ marginTop: "10px" }}>
          <form onSubmit={handleSearch}>
            <div className="lions-search-inputs-grid">
              <div className="lions-input-group">
                <label htmlFor="district-member-name-input">
                  <User size={16} />
                  Business / Person Name
                </label>
                <div className="lions-input-box">
                  <input
                    id="district-member-name-input"
                    type="text"
                    className="lions-input-field"
                    placeholder="Business / Person Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              </div>

              <div className="lions-input-group">
                <label htmlFor="district-member-key-input">
                  <Key size={16} />
                  Keyword Search
                </label>
                <div className="lions-input-box">
                  <input
                    id="district-member-key-input"
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
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}
                  <span>{isSearching ? "Searching..." : "Search"}</span>
                </button>
                {hasSearchQuery && (
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

        {/* Designation Filter Tabs Carousel (Shown when not in search mode) */}
        {!hasSearchQuery && (
          <TabsCarousel
            tabs={filterTabs}
            activeTabId={activeFilter}
            onSelectTab={handleFilterChange}
            isLoading={isLoading}
          />
        )}

        {/* 2-Column Content Layout: Main Clubs/Members on Left + Celebrations Aside on Right */}
        <div className="district-content-layout">
          {/* Left Column: Clubs or Members Directory Grid / Search Results */}
          <main className="district-main-content">
            {hasSearchQuery ? (
              /* ACTIVE SEARCH RESULTS */
              <div className="district-clubs-list-section">
                <div className="section-head">
                  <h3>
                    <Search className="section-icon" />
                    Search Results ({displayedSearchResults.length} {displayedSearchResults.length === 1 ? "Member" : "Members"}
                    {displayedMatchingClubs.length > 0 ? `, ${displayedMatchingClubs.length} ${displayedMatchingClubs.length === 1 ? "Club" : "Clubs"}` : ""})
                  </h3>
                  <button
                    type="button"
                    className="lions-back-btn"
                    style={{ fontSize: "0.82rem", padding: "4px 12px" }}
                    onClick={handleResetSearch}
                  >
                    Clear Search
                  </button>
                </div>

                {/* If matching clubs exist */}
                {displayedMatchingClubs.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "#1e293b", margin: "0 0 12px" }}>
                      🏛️ Matching Clubs ({displayedMatchingClubs.length})
                    </h4>
                    <div className="cards-grid">
                      {displayedMatchingClubs.map((club) => (
                        <div
                          key={club.id}
                          className="district-card"
                          onClick={() => navigate(`${basePath}/${districtId}/${club.id}`)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              navigate(`${basePath}/${districtId}/${club.id}`);
                            }
                          }}
                        >
                          <h3 className="name">{club.name}</h3>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* If matching members exist */}
                {displayedSearchResults.length > 0 && (
                  <div>
                    {displayedMatchingClubs.length > 0 && (
                      <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "#1e293b", margin: "0 0 12px" }}>
                        👤 Matching Members ({displayedSearchResults.length})
                      </h4>
                    )}
                    <div className="cards-grid">
                      {displayedSearchResults.map((member) => (
                        <ClubProfileCard
                          key={member.id}
                          person={member}
                          roleTitle={member.postFull || member.post}
                          isLeadership={member.isLeadership}
                          isKeywordFocused={isKeywordFocused}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* If no matches at all */}
                {displayedSearchResults.length === 0 && displayedMatchingClubs.length === 0 && (
                  <div
                    style={{
                      padding: "30px",
                      background: "white",
                      borderRadius: "12px",
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    <p>No {clubTitle} members or clubs found matching your search.</p>
                    <button
                      type="button"
                      className="lions-back-btn"
                      style={{ margin: "12px auto 0" }}
                      onClick={handleResetSearch}
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* REGULAR TAB CONTENT */
              <div className="district-clubs-list-section">
                <div className="section-head">
                  <h3>
                    {currentSectionMeta.icon}
                    {currentSectionMeta.title}
                  </h3>
                  {!isLoading && (
                    <span className="count-pill">
                      {currentSectionMeta.count} {currentSectionMeta.unit}
                    </span>
                  )}
                </div>

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
                    <p>Fetching district data from directory...</p>
                  </div>
                ) : activeFilter === "CLUBS" ? (
                  /* CLUBS GRID */
                  filteredClubs.length === 0 ? (
                    <div
                      style={{
                        padding: "30px",
                        background: "white",
                        borderRadius: "12px",
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      <p>No clubs found in this district.</p>
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {filteredClubs.map((club) => (
                        <div
                          key={club.id}
                          className="district-card"
                          onClick={() =>
                            navigate(`${basePath}/${districtId}/${club.id}`)
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              navigate(`${basePath}/${districtId}/${club.id}`);
                            }
                          }}
                        >
                          <h3 className="name">{club.name}</h3>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  /* MEMBER GRID (For DC, RC, ZC, DG, Cabinet, All Members) */
                  filteredMembers.length === 0 ? (
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
                        No members found under this designation.
                      </p>
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {filteredMembers.map((member) => (
                        <ClubProfileCard
                          key={member.id}
                          person={member}
                          roleTitle={member.postFull || member.post}
                          isLeadership={member.isLeadership}
                          isKeywordFocused={isKeywordFocused}
                        />
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </main>

          {/* Right Column: Celebrations Aside */}
          <aside className="district-celebrations-aside-column">
            <CelebrationsAside
              timeline={celebrationsTimeline}
              clubTitle={formattedDistrictName}
              basePath={basePath}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ClubDistrictClubsPage;
