// src/features/clubs/pages/LionsDistrictClubsPage.jsx
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
import { getDistrictData } from "../services/lionsClubService";
import LionsProfileCard from "../components/LionsProfileCard";
import "../../search/components/css/SearchBar.css";
import "./css/LionsClubPages.css";

/**
 * Role matching utility for Lions designation tabs
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

const LionsDistrictClubsPage = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();

  const formattedDistrictName = districtId
    ? districtId.toLowerCase().startsWith("district")
      ? districtId
      : `District ${districtId}`
    : "District 3242C";

  const [clubs, setClubs] = useState([]);
  const [members, setMembers] = useState([]);
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
        const { clubs: loadedClubs, members: loadedMembers } =
          await getDistrictData(districtId);
        if (isMounted) {
          setClubs(loadedClubs || []);
          setMembers(loadedMembers || []);
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
  }, [districtId]);

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
        (club.shortName && club.shortName.toLowerCase().includes(bQuery));

      const matchKey =
        !kQuery ||
        (club.name && club.name.toLowerCase().includes(kQuery)) ||
        (club.clubNo && club.clubNo.toLowerCase().includes(kQuery));

      return matchName && matchKey;
    });
  }, [clubs, activeFilter, businessName, keywords]);

  // Filtered Members when a designation filter is active
  const filteredMembers = useMemo(() => {
    if (activeFilter === "CLUBS") return [];
    const bQuery = businessName.trim().toLowerCase();
    const kQuery = keywords.trim().toLowerCase();

    return members.filter((m) => {
      const roleMatch = matchesRoleFilter(m, activeFilter);
      if (!roleMatch) return false;

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
  }, [members, activeFilter, businessName, keywords]);

  const handleResetSearch = () => {
    setBusinessName("");
    setKeywords("");
    setIsKeywordFocused(false);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  // Filter button configurations
  const filterTabs = [
    { id: "CLUBS", label: "Clubs", icon: Building2, count: tabCounts.CLUBS },
    {
      id: "DC",
      label: "DC",
      title: "District Chairperson (DC)",
      icon: ShieldCheck,
      count: tabCounts.DC,
    },
    {
      id: "RC",
      label: "RC",
      title: "Region Chairperson (RC)",
      icon: Award,
      count: tabCounts.RC,
    },
    {
      id: "ZC",
      label: "ZC",
      title: "Zone Chairperson (ZC)",
      icon: Compass,
      count: tabCounts.ZC,
    },
    {
      id: "DG",
      label: "DG",
      title: "District Governor (DG)",
      icon: Crown,
      count: tabCounts.DG,
    },
    {
      id: "CABINET",
      label: "Cabinet / Officers",
      title: "Cabinet Officers",
      icon: Briefcase,
      count: tabCounts.CABINET,
    },
    {
      id: "ALL_MEMBERS",
      label: "All Members",
      title: "All District Members",
      icon: Users,
      count: tabCounts.ALL_MEMBERS,
    },
  ];

  // Active section metadata
  const currentSectionMeta = useMemo(() => {
    switch (activeFilter) {
      case "DC":
        return {
          title: `District Chairpersons (DC) in ${formattedDistrictName}`,
          icon: <ShieldCheck size={24} color="#005a36" />,
          count: filteredMembers.length,
          unit: "Lions",
        };
      case "RC":
        return {
          title: `Region Chairpersons (RC) in ${formattedDistrictName}`,
          icon: <Award size={24} color="#005a36" />,
          count: filteredMembers.length,
          unit: "Lions",
        };
      case "ZC":
        return {
          title: `Zone Chairpersons (ZC) in ${formattedDistrictName}`,
          icon: <Compass size={24} color="#005a36" />,
          count: filteredMembers.length,
          unit: "Lions",
        };
      case "DG":
        return {
          title: `District Governors (DG) in ${formattedDistrictName}`,
          icon: <Crown size={24} color="#005a36" />,
          count: filteredMembers.length,
          unit: "Lions",
        };
      case "CABINET":
        return {
          title: `District Cabinet Officers in ${formattedDistrictName}`,
          icon: <Briefcase size={24} color="#005a36" />,
          count: filteredMembers.length,
          unit: "Lions",
        };
      case "ALL_MEMBERS":
        return {
          title: `All Members in ${formattedDistrictName}`,
          icon: <Users size={24} color="#005a36" />,
          count: filteredMembers.length,
          unit: "Lions",
        };
      case "CLUBS":
      default:
        return {
          title: `Clubs in ${formattedDistrictName}`,
          icon: <Building2 size={24} color="#005a36" />,
          count: filteredClubs.length,
          unit: "Clubs",
        };
    }
  }, [
    activeFilter,
    formattedDistrictName,
    filteredClubs.length,
    filteredMembers.length,
  ]);

  return (
    <div className="lions-pages-container">
      <Helmet>
        <title>{formattedDistrictName} | Lions Directory | Celfonbook</title>
      </Helmet>

      <div className="lions-pages-wrapper">
        {/* Navigation & Breadcrumbs */}
        <div className="lions-nav-bar">
          <button
            type="button"
            className="lions-back-btn"
            onClick={() => navigate("/lions-club")}
          >
            <ArrowLeft size={18} />
            <span>Back to Districts</span>
          </button>

          <div className="lions-breadcrumbs">
            <Link to="/lions-club" className="breadcrumb-link">
              Districts
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{formattedDistrictName}</span>
          </div>
        </div>

        {/* District Banner Header */}
        <div className="district-banner-card">
          <h2>{formattedDistrictName}</h2>
          <p className="district-desc">
            Explore chartered Lions Clubs, district leadership (DC, RC, ZC, DG),
            and active member rosters across {formattedDistrictName}.
          </p>
        </div>

        {/* 2-Field Search Bar (Matching SearchPage & ClubDetail design) */}
        <div className="directory-search-bar" style={{ marginTop: "10px" }}>
          <div className="search-input-group">
            <div className="search-input-field">
              <HiOutlineBuildingOffice2 className="search-icon" />
              <input
                type="text"
                placeholder="Search Business / Person / Club"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div className="search-input-field">
              <TbTag className="search-icon" />
              <input
                type="text"
                placeholder="Search Keywords / Mobile / Member No"
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

        {/* Designation Filter Buttons: DC, RC, ZC, DG, Cabinet, etc. */}
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

        {/* Dynamic Results Section */}
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
              style={{ textAlign: "center", padding: "50px", color: "#64748b" }}
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
                      navigate(`/lions-club/${districtId}/${club.id}`)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate(`/lions-club/${districtId}/${club.id}`);
                      }
                    }}
                  >
                    <h3 className="name">{club.name}</h3>
                  </div>
                ))}
              </div>
            )
          ) : /* MEMBERS GRID (DC, RC, ZC, DG, CABINET, ALL_MEMBERS) */
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
                No members found for this designation{" "}
                {businessName || keywords ? "matching your search" : ""}.
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
                <LionsProfileCard
                  key={member.id}
                  person={member}
                  roleTitle={
                    member.postFull || member.post || member.post_of_member
                  }
                  isLeadership={member.isLeadership}
                  isKeywordFocused={isKeywordFocused}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LionsDistrictClubsPage;
