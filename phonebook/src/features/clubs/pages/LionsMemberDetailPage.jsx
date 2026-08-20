// src/features/clubs/pages/LionsMemberDetailPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  MapPin,
  Mail,
  User,
  Cake,
  Gem,
  Briefcase,
  Award,
  Heart,
  Share2,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { ALL_LIONS_MEMBERS, DISTRICT_DATA } from "../data/lionsData";
import LionsProfileCard from "../components/LionsProfileCard";
import "./css/LionsMemberDetailPage.css";

const LionsMemberDetailPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");

  const member = ALL_LIONS_MEMBERS.find((m) => m.id === memberId) || ALL_LIONS_MEMBERS[0];

  if (!member) {
    return (
      <div className="pd-lions-page">
        <div className="pd-container">
          <p>Member not found.</p>
          <button type="button" className="lions-back-btn" onClick={() => navigate("/lions-club")}>
            Back to Lions Directory
          </button>
        </div>
      </div>
    );
  }

  const relatedMembers = ALL_LIONS_MEMBERS.filter(
    (m) => m.clubId === member.clubId && m.id !== member.id
  ).slice(0, 4);

  const handleCall = () => {
    if (!member.mobile) return;
    window.location.href = `tel:${member.mobile}`;
  };

  const handleWhatsApp = () => {
    if (!member.mobile) return;
    const cleanPhone = member.mobile.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/91${cleanPhone}`, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${member.fullName} - ${member.clubName}`,
          text: `Contact details for ${member.fullName} (${member.postFull || member.post}) on Lions Directory`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share dismissed");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard!");
    }
  };

  return (
    <div className="pd-lions-page">
      <Helmet>
        <title>{member.fullName} | {member.clubName} | Celfonbook Directory</title>
        <meta
          name="description"
          content={`Profile of ${member.fullName}, ${member.postFull || member.post} of ${member.clubName}, District ${member.districtId}.`}
        />
      </Helmet>

      <div className="pd-container">
        {/* Navigation & Breadcrumbs */}
        <div className="pd-nav-bar">
          <button
            type="button"
            className="lions-back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="pd-breadcrumbs">
            <Link to="/lions-club" className="breadcrumb-link">Districts</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to={`/lions-club/${member.districtId}`} className="breadcrumb-link">{member.districtId}</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to={`/lions-club/${member.districtId}/${member.clubId}`} className="breadcrumb-link">{member.clubName.replace("Lions Club of ", "")}</Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{member.name}</span>
          </div>
        </div>

        {/* DetailedProfile Header Hero Section */}
        <div className="pd-hero-card">
          <div className="pd-hero-grid">
            {/* Left Cover / Emblem */}
            <div className="pd-hero-emblem-box">
              <div className="pd-emblem-inner">
                <span className="pd-emblem-letter">{member.name.charAt(0)}</span>
                <span className="pd-emblem-tag">LIONS</span>
              </div>
            </div>

            {/* Middle Main Info */}
            <div className="pd-hero-main-info">
              <div className="pd-badge-row">
                <span className="pd-prime-badge">VERIFIED LION</span>
                {member.post && (
                  <span className="pd-post-badge">{member.postFull || member.post}</span>
                )}
                <span className="pd-district-pill">District {member.districtId}</span>
              </div>

              <h1 className="pd-hero-name">
                {member.fullName}
                <CheckCircle2 size={22} className="verified-check" />
              </h1>

              {member.businessName && (
                <h3 className="pd-business-subtitle">
                  {member.fullBusinessName || member.businessName}
                </h3>
              )}

              <p className="pd-keywords-line">
                <Briefcase size={15} /> {member.keywords || member.profession}
              </p>

              <p className="pd-location-line">
                <MapPin size={15} /> {member.city}, Tamil Nadu - {member.pincode}
              </p>

              <p className="pd-club-tag">
                <Building2 size={15} /> {member.clubName}
              </p>
            </div>

            {/* Right Action CTA Buttons */}
            <div className="pd-hero-actions-box">
              <button type="button" className="pd-cta-btn call" onClick={handleCall}>
                <Phone size={18} />
                <span>Call Now</span>
              </button>

              <button type="button" className="pd-cta-btn whatsapp" onClick={handleWhatsApp}>
                <MessageSquare size={18} />
                <span>WhatsApp</span>
              </button>

              <button type="button" className="pd-cta-btn share" onClick={handleShare}>
                <Share2 size={18} />
                <span>Share Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* DetailedProfile Tabs Layout */}
        <div className="pd-tabs-container">
          <div className="pd-tabs-bar">
            <button
              type="button"
              className={`pd-tab-btn ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              <User size={16} />
              <span>About &amp; Member Info</span>
            </button>

            <button
              type="button"
              className={`pd-tab-btn ${activeTab === "business" ? "active" : ""}`}
              onClick={() => setActiveTab("business")}
            >
              <Briefcase size={16} />
              <span>Business Profile</span>
            </button>

            <button
              type="button"
              className={`pd-tab-btn ${activeTab === "location" ? "active" : ""}`}
              onClick={() => setActiveTab("location")}
            >
              <MapPin size={16} />
              <span>Location &amp; Address</span>
            </button>
          </div>

          <div className="pd-tab-content-card">
            {/* Tab 1: About & Member Info */}
            {activeTab === "about" && (
              <div className="pd-tab-pane">
                <h3 className="pane-title">Personal &amp; Lionistic Information</h3>

                <div className="pd-info-grid">
                  <div className="pd-info-card">
                    <span className="info-lbl">Full Name</span>
                    <span className="info-val">{member.fullName}</span>
                  </div>

                  <div className="pd-info-card">
                    <span className="info-lbl">Member Number</span>
                    <span className="info-val">#{member.memberNo || "—"}</span>
                  </div>

                  <div className="pd-info-card">
                    <span className="info-lbl">Lionistic Post / Protocol</span>
                    <span className="info-val">{member.postFull || member.post || "Member"}</span>
                  </div>

                  <div className="pd-info-card">
                    <span className="info-lbl">Lionistic Year</span>
                    <span className="info-val">{member.year}</span>
                  </div>

                  <div className="pd-info-card">
                    <span className="info-lbl">Mobile Contact</span>
                    <span className="info-val">
                      <a href={`tel:${member.mobile}`} className="contact-link">
                        +91 {member.mobile}
                      </a>
                    </span>
                  </div>

                  <div className="pd-info-card">
                    <span className="info-lbl">Email Address</span>
                    <span className="info-val">
                      {member.email ? (
                        <a href={`mailto:${member.email}`} className="contact-link">
                          {member.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>

                  <div className="pd-info-card">
                    <span className="info-lbl">Date of Birth (🎂)</span>
                    <span className="info-val">{member.dob || "—"}</span>
                  </div>

                  <div className="pd-info-card">
                    <span className="info-lbl">Wedding Anniversary (💍)</span>
                    <span className="info-val">{member.dow || "—"}</span>
                  </div>

                  <div className="pd-info-card">
                    <span className="info-lbl">Spouse Name</span>
                    <span className="info-val">{member.spouse || "—"}</span>
                  </div>

                  <div className="pd-info-card">
                    <span className="info-lbl">Blood Group</span>
                    <span className="info-val">{member.bloodGroup || "—"}</span>
                  </div>

                  <div className="pd-info-card full-col">
                    <span className="info-lbl">Club Affiliation</span>
                    <span className="info-val">{member.clubName} (District {member.districtId})</span>
                  </div>

                  <div className="pd-info-card full-col">
                    <span className="info-lbl">Registered Address</span>
                    <span className="info-val">{member.address}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Business Profile */}
            {activeTab === "business" && (
              <div className="pd-tab-pane">
                <h3 className="pane-title">Business &amp; Professional Details</h3>

                <div className="pd-business-box">
                  <div className="business-main-badge">
                    <Briefcase size={24} color="#16a34a" />
                    <div>
                      <h4>{member.fullBusinessName || member.businessName || "Commercial Practice"}</h4>
                      <p>{member.profession || member.keywords}</p>
                    </div>
                  </div>

                  <div className="pd-info-grid" style={{ marginTop: "18px" }}>
                    <div className="pd-info-card">
                      <span className="info-lbl">Industry / Keywords</span>
                      <span className="info-val">{member.keywords || "—"}</span>
                    </div>

                    <div className="pd-info-card">
                      <span className="info-lbl">Operating City</span>
                      <span className="info-val">{member.city} - {member.pincode}</span>
                    </div>

                    <div className="pd-info-card">
                      <span className="info-lbl">Business Contact</span>
                      <span className="info-val">+91 {member.mobile}</span>
                    </div>

                    <div className="pd-info-card">
                      <span className="info-lbl">Official Email</span>
                      <span className="info-val">{member.email || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Location & Map */}
            {activeTab === "location" && (
              <div className="pd-tab-pane">
                <h3 className="pane-title">Address &amp; Location Map</h3>

                <div className="pd-address-box">
                  <div className="address-icon-row">
                    <MapPin size={22} color="#16a34a" />
                    <div>
                      <h4>{member.address}</h4>
                      <p>{member.city}, Tamil Nadu, Pincode: {member.pincode}</p>
                    </div>
                  </div>

                  <div className="map-action-row">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${member.address}, ${member.city}, Tamil Nadu ${member.pincode}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pd-map-btn"
                    >
                      <ExternalLink size={16} />
                      <span>Open in Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Club Members Section */}
        {relatedMembers.length > 0 && (
          <div className="pd-related-section">
            <div className="section-head">
              <h3>
                <Building2 size={22} color="#005a36" />
                Other Members in {member.clubName}
              </h3>
              <span className="count-pill">Affiliated Lions</span>
            </div>

            <div className="cards-grid">
              {relatedMembers.map((rel, idx) => (
                <LionsProfileCard
                  key={idx}
                  person={rel}
                  roleTitle={rel.postFull || rel.post || "Member"}
                  isLeadership={rel.isLeadership}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LionsMemberDetailPage;
