// src/features/clubs/pages/LionsDistrictClubsPage.jsx
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ChevronRight, Building2, MapPin, Award, Calendar, Users } from "lucide-react";
import { DISTRICT_DATA, CLUBS_BY_DISTRICT } from "../data/lionsData";
import "./css/LionsClubPages.css";

const LionsDistrictClubsPage = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();

  const district = DISTRICT_DATA.find((d) => d.id === districtId) || DISTRICT_DATA[0];
  const clubs = CLUBS_BY_DISTRICT[district.id] || [];

  return (
    <div className="lions-pages-container">
      <Helmet>
        <title>{district.name} Clubs | Lions Directory | Celfonbook</title>
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
            <Link to="/lions-club" className="breadcrumb-link">Districts</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{district.name}</span>
          </div>
        </div>

        {/* District Banner Header */}
        <div className="district-banner-card">
          <div className="district-banner-top">
            <span className="district-tag-pill">{district.tag}</span>
            <span className="district-clubs-count">{clubs.length} Chartered Clubs</span>
          </div>
          <h2>{district.name}</h2>
          <p className="district-desc">{district.description}</p>
          <div className="district-meta-bar">
            <span>District Governor: <strong>{district.governor}</strong></span>
            <span className="meta-sep">•</span>
            <span>Region: <strong>{district.region}</strong></span>
          </div>
        </div>

        {/* Clubs Grid Section */}
        <div className="district-clubs-list-section">
          <div className="section-head">
            <h3>
              <Building2 size={24} color="#005a36" />
              Chartered Clubs in {district.name}
            </h3>
            <span className="count-pill">{clubs.length} Clubs</span>
          </div>

          <div className="cards-grid">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="town-profile-card"
                onClick={() => navigate(`/lions-club/${district.id}/${club.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/lions-club/${district.id}/${club.id}`);
                  }
                }}
              >
                <div className="district-badge-row">
                  <span className="district-tag">{club.milestone}</span>
                  <span className="status-pill">{club.zone}</span>
                </div>

                <h3 className="name">{club.name}</h3>

                <div className="card-info">
                  <p className="type-location">
                    <MapPin size={14} /> {club.location}
                  </p>

                  <p className="club-no">
                    <Award size={14} /> Club No: <strong>{club.clubNo}</strong>
                  </p>

                  <p className="charter-date">
                    <Calendar size={14} /> Charter Date: <strong>{club.charterDate}</strong>
                  </p>

                  <p className="members-count">
                    <Users size={14} /> Strength: <strong>{club.totalMembers} Lions</strong>
                  </p>

                  <p className="president-info">
                    👑 Lead Officer: <strong>{club.presidentName || "Lion Leader"}</strong>
                  </p>
                </div>

                <div className="card-actions">
                  <button type="button" className="btn call">
                    <span>View Board &amp; Members</span>
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

export default LionsDistrictClubsPage;
