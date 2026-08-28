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
} from "lucide-react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbTag } from "react-icons/tb";
import {
  getDistrictData,
  getClubInfo,
  getClubCelebrationsTimeline,
} from "../services/clubService";
import ClubProfileCard from "../components/ClubProfileCard";
import FounderCard from "../components/FounderCard";
import CelebrationsAside from "../components/CelebrationsAside";
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
    const bQuery = businessName.trim().toLowerCase();
    const kQuery = keywords.trim().toLowerCase();

    if (!bQuery && !kQuery) return clubs;

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
  }, [clubs, activeFilter, businessName, keywords]);

  // Filtered Members for other designation tabs
  const filteredMembers = useMemo(() => {
    if (activeFilter === "CLUBS") return [];

    let list = members.filter((m) => matchesRoleFilter(m, activeFilter));

    const bQuery = businessName.trim().toLowerCase();
    const kQuery = keywords.trim().toLowerCase();

    if (!bQuery && !kQuery) return list;

    return list.filter((member) => {
      const matchName =
        !bQuery ||
        (member.fullName && member.fullName.toLowerCase().includes(bQuery)) ||
        (member.person_name &&
          member.person_name.toLowerCase().includes(bQuery)) ||
        (member.business_name &&
          member.business_name.toLowerCase().includes(bQuery)) ||
        (member.clubName && member.clubName.toLowerCase().includes(bQuery));

      const matchKeyword =
        !kQuery ||
        (member.post && member.post.toLowerCase().includes(kQuery)) ||
        (member.postFull && member.postFull.toLowerCase().includes(kQuery)) ||
        (member.profession &&
          member.profession.toLowerCase().includes(kQuery)) ||
        (member.category && member.category.toLowerCase().includes(kQuery)) ||
        (member.membership_number &&
          String(member.membership_number).toLowerCase().includes(kQuery)) ||
        (member.mobile_number && member.mobile_number.includes(kQuery)) ||
        (member.city && member.city.toLowerCase().includes(kQuery));

      return matchName && matchKeyword;
    });
  }, [members, activeFilter, businessName, keywords]);

  const handleResetSearch = () => {
    setBusinessName("");
    setKeywords("");
  };

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setBusinessName("");
    setKeywords("");
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
        <div className="directory-search-bar" style={{ marginTop: "10px" }}>
          <div className="search-input-group">
            <div className="search-input-field">
              <HiOutlineBuildingOffice2 className="search-icon" />
              <input
                type="text"
                placeholder={
                  activeFilter === "CLUBS"
                    ? `Search Club Name in ${formattedDistrictName}`
                    : `Search Person or Business Name in ${formattedDistrictName}`
                }
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div className="search-input-field">
              <TbTag className="search-icon" />
              <input
                type="text"
                placeholder={
                  activeFilter === "CLUBS"
                    ? "Search by Club Number / Keyword"
                    : "Search by Profession, Post, Member No..."
                }
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
                title="Reset Search"
                style={{
                  height: "42px",
                  padding: "0 14px",
                  borderRadius: "10px",
                }}
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Designation Filter Buttons */}
        <div className="district-filter-tabs-container">
          <div className="district-filter-tabs">
            {filterTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`filter-tab-btn ${isActive ? "active" : ""}`}
                  onClick={() => handleFilterChange(tab.id)}
                  title={tab.title || tab.label}
                >
                  <IconComponent size={16} />
                  <span>{tab.label}</span>
                  {!isLoading && (
                    <span className="filter-tab-count">{tab.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Content Layout: Main Clubs/Members on Left + Celebrations Aside on Right */}
        <div className="district-content-layout">
          {/* Left Column: Clubs or Members Directory Grid */}
          <main className="district-main-content">
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
                    <p>No clubs found matching your search.</p>
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
                      No members found under this designation or search filter.
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
          </main>

          {/* Right Column: Celebrations Aside */}
          <aside className="district-celebrations-aside-column">
            <CelebrationsAside
              timeline={celebrationsTimeline}
              clubTitle={clubTitle}
              basePath={basePath}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ClubDistrictClubsPage;
