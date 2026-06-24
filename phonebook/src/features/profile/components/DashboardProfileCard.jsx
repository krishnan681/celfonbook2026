import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css";

export default function DashboardProfileCard({ profile }) {
  const navigate = useNavigate();
  const completionFields = [
    profile?.person_name,
    profile?.business_name,
    profile?.mobile_number,
    profile?.city,
    profile?.description,
    profile?.profile_image,
    profile?.web_site,
  ];

  const completedCount = completionFields.filter(
    (field) => field && String(field).trim() !== "",
  ).length;

  const completionPercentage = Math.round(
    (completedCount / completionFields.length) * 100,
  );
  const displayName =
    profile?.business_name?.trim() || profile?.person_name || "User";

  return (
    <>
      {/* HERO CARD */}
      <section className="hero-profile">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-avatar-wrap">
            {profile?.profile_image ? (
              <img
                src={profile.profile_image}
                alt={displayName}
                className="hero-avatar"
              />
            ) : (
              <div className="hero-avatar-fallback">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="hero-info">
            <h1>
              {profile?.person_prefix} {displayName}
            </h1>

            <p className="hero-role">
              {profile?.keywords || "No Profession Added"}
            </p>

            <div className="hero-details">
              <div className="hero-item">
                <strong>Mobile</strong>
                <span>{profile?.mobile_number || "-"}</span>
              </div>

              <div className="hero-item">
                <strong>Email</strong>
                <span>{profile?.email || "-"}</span>
              </div>

              <div className="hero-item">
                <strong>City</strong>
                <span>{profile?.city || "-"}</span>
              </div>

              <div className="hero-item">
                <strong>Pincode</strong>
                <span>{profile?.pincode || "-"}</span>
              </div>

              <div className="hero-item">
                <strong>WhatsApp</strong>
                <span>{profile?.whats_app || "-"}</span>
              </div>
            </div>

              <div className="profile-completion">
            <div className="completion-top">
              <span>Profile Completion</span>
              <span>{completionPercentage}%</span>
            </div>

            <div className="completion-bar">
              <div
                className="completion-fill"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>

            <p className="completion-text">
              Complete your profile to get more visibility
            </p>
          </div>
          </div>

        

          <button
            className="hero-edit-btn"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </button>
        </div>
      </section>

      {/* BUSINESS CARD */}
      <section className="dashboard-card">
        <div className="card-header">
          <h3>Business Information</h3>
        </div>

        <div className="info-grid">
          <div className="info-box">
            <label> Address</label>
            <p>{profile?.address || "-"}</p>
          </div>

          <div className="info-box full-width">
            <label>Description</label>
            <p>{profile?.description || "-"}</p>
          </div>
        </div>
      </section>

      {/* CONTACT CARD */}
      <section className="dashboard-card">
        <div className="card-header">
          <h3>Contact Information</h3>
        </div>

        <div className="info-grid">
          <div className="info-box">
            <label>Address</label>
            <p>{profile?.address || "-"}</p>
          </div>

          <div className="info-box">
            <label>Landline Code</label>
            <p>{profile?.landline_code || "-"}</p>
          </div>

          <div className="info-box">
            <label>Landline Number</label>
            <p>{profile?.landline || "-"}</p>
          </div>
        </div>
      </section>
    </>
  );
}
