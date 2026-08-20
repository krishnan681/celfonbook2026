// src/features/clubs/pages/LionsClubDetailPage.jsx
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ChevronRight, Crown, Users, MapPin, Award, Building2 } from "lucide-react";
import { DISTRICT_DATA, CLUBS_BY_DISTRICT, ALL_LIONS_MEMBERS } from "../data/lionsData";
import LionsProfileCard from "../components/LionsProfileCard";
import "./css/LionsClubPages.css";

const LionsClubDetailPage = () => {
  const { districtId, clubId } = useParams();
  const navigate = useNavigate();

  const district = DISTRICT_DATA.find((d) => d.id === districtId) || DISTRICT_DATA[0];
  const districtClubs = CLUBS_BY_DISTRICT[district.id] || [];
  const club = districtClubs.find((c) => c.id === clubId) || districtClubs[0];

  if (!club) {
    return (
      <div className="lions-pages-container">
        <div className="lions-pages-wrapper">
          <p>Club not found.</p>
          <button type="button" className="lions-back-btn" onClick={() => navigate("/lions-club")}>
            Back to Districts
          </button>
        </div>
      </div>
    );
  }

  // Get all members for this specific club
  const clubMembers = ALL_LIONS_MEMBERS.filter(
    (m) =>
      m.clubId === club.id ||
      m.clubName.toLowerCase().includes(club.shortName.toLowerCase()) ||
      (club.name && m.clubName.toLowerCase() === club.name.toLowerCase())
  );

  const leadershipOfficers = clubMembers.filter((m) => m.isLeadership);
  const generalMembers = clubMembers.filter((m) => !m.isLeadership);

  const hasBothSections = leadershipOfficers.length > 0 && generalMembers.length > 0;

  return (
    <div className="lions-pages-container">
      <Helmet>
        <title>{club.name} | Directory Roster | Celfonbook</title>
      </Helmet>

      <div className="lions-pages-wrapper">
        {/* Navigation & Breadcrumbs */}
        <div className="lions-nav-bar">
          <button
            type="button"
            className="lions-back-btn"
            onClick={() => navigate(`/lions-club/${district.id}`)}
          >
            <ArrowLeft size={18} />
            <span>Back to {district.code} Clubs</span>
          </button>

          <div className="lions-breadcrumbs">
            <Link to="/lions-club" className="breadcrumb-link">Districts</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to={`/lions-club/${district.id}`} className="breadcrumb-link">{district.code}</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{club.shortName}</span>
          </div>
        </div>

        {/* Club Details Header Banner */}
        <div className="club-detail-banner-card">
          <div className="club-banner-top">
            <span className="club-district-tag">{district.code}</span>
            <span className="club-milestone-tag">{club.milestone}</span>
          </div>
          <h2>{club.name}</h2>
          <p className="club-address">
            <MapPin size={15} /> {club.address}
          </p>

          <div className="club-meta-grid">
            <div className="meta-item">
              <span className="lbl">Club No:</span>
              <span className="val">{club.clubNo}</span>
            </div>
            <div className="meta-item">
              <span className="lbl">Charter Date:</span>
              <span className="val">{club.charterDate}</span>
            </div>
            <div className="meta-item">
              <span className="lbl">Enrolled Members:</span>
              <span className="val">{clubMembers.length} Registered Lions</span>
            </div>
            <div className="meta-item">
              <span className="lbl">Zone / Region:</span>
              <span className="val">{club.zone}</span>
            </div>
            <div className="meta-item">
              <span className="lbl">Sponsored By:</span>
              <span className="val">{club.sponsoredBy}</span>
            </div>
          </div>
        </div>

        {/* If there are both leadership officers and general members */}
        {hasBothSections ? (
          <>
            {/* 1. Leadership Officers Section */}
            <div className="club-leadership-section">
              <div className="section-head">
                <h3>
                  <Crown size={22} color="#005a36" />
                  Designated Officers (RC / ZC / DC / Cabinet)
                </h3>
                <span className="count-pill">{leadershipOfficers.length} Officers</span>
              </div>

              <div className="cards-grid">
                {leadershipOfficers.map((officer) => (
                  <LionsProfileCard
                    key={officer.id}
                    person={officer}
                    roleTitle={officer.postFull || officer.post}
                    isLeadership={true}
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
                    roleTitle={member.postFull || member.post || "Member"}
                    isLeadership={false}
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
              <span className="count-pill">{clubMembers.length} Lions Enrolled</span>
            </div>

            {clubMembers.length === 0 ? (
              <p style={{ padding: "20px", background: "white", borderRadius: "10px", color: "#64748b" }}>
                No member records uploaded for this club yet.
              </p>
            ) : (
              <div className="cards-grid">
                {clubMembers.map((member) => (
                  <LionsProfileCard
                    key={member.id}
                    person={member}
                    roleTitle={member.postFull || member.post || "Member"}
                    isLeadership={member.isLeadership}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LionsClubDetailPage;
