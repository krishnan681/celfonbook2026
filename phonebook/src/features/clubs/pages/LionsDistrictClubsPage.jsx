// src/features/clubs/pages/LionsDistrictClubsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ChevronRight,
  Building2,
  Loader2,
} from "lucide-react";
import { getClubsByDistrict } from "../services/lionsClubService";
import "./css/LionsClubPages.css";

const LionsDistrictClubsPage = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();

  const formattedDistrictName = districtId
    ? (districtId.toLowerCase().startsWith("district") ? districtId : `District ${districtId}`)
    : "District 3424C";

  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadClubs() {
      setIsLoading(true);
      try {
        const data = await getClubsByDistrict(districtId);
        if (isMounted) {
          setClubs(data || []);
        }
      } catch (err) {
        console.error("Error loading clubs for district:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadClubs();
    return () => {
      isMounted = false;
    };
  }, [districtId]);

  return (
    <div className="lions-pages-container">
      <Helmet>
        <title>{formattedDistrictName} Clubs | Lions Directory | Celfonbook</title>
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
            Explore chartered Lions Clubs and active member rosters across {formattedDistrictName}.
          </p>
        </div>

        {/* Clubs Grid Section */}
        <div className="district-clubs-list-section">
          <div className="section-head">
            <h3>
              <Building2 size={24} color="#005a36" />
              Clubs in {formattedDistrictName}
            </h3>
            {!isLoading && <span className="count-pill">{clubs.length} Clubs</span>}
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "50px", color: "#64748b" }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px" }} />
              <p>Fetching clubs from backend directory...</p>
            </div>
          ) : clubs.length === 0 ? (
            <div style={{ padding: "30px", background: "white", borderRadius: "12px", textAlign: "center", color: "#64748b" }}>
              <p>No active clubs found for this district in the database.</p>
            </div>
          ) : (
            <div className="cards-grid">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="district-card"
                  onClick={() => navigate(`/lions-club/${districtId}/${club.id}`)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default LionsDistrictClubsPage;
