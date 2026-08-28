// src/features/clubs/pages/ClubMemberDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  Heart,
  Phone,
  MessageSquare,
  MapPin,
  Share2,
} from "lucide-react";
import { MdVerified, MdBusiness } from "react-icons/md";
import { formatWebsiteUrl } from "../../../core/utils/urlFormatter";
import { maskPhoneNumber, maskEmail } from "../../../core/utils/maskHelper";
import { getMemberById, getClubInfo } from "../services/clubService";
import FavoriteModal from "../../search/components/FavoriteModal";
import DetailedProfileTabs from "../../DetailedProfile/components/DetailedProfileTabs";
import DetailedProfileMap from "../../DetailedProfile/components/DetailedProfileMap";
import DetailedProfileProducts from "../../DetailedProfile/components/DetailedProfileProducts";
import "../../search/components/css/profilecard.css";
import "../../DetailedProfile/css/ProfileDetailPage.css";
import "./css/LionsClubPages.css";

export default function ClubMemberDetailPage() {
  const { memberId, clubSlug: paramSlug } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [clubInfo, setClubInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMemberData() {
      setIsLoading(true);
      try {
        const data = await getMemberById(memberId);
        if (isMounted && data) {
          setMember(data);
          const activeSlug =
            data.clubSlug ||
            paramSlug ||
            (data.assn?.toLowerCase().includes("vasavi") ? "vasavi" : "lions");
          const info = await getClubInfo(activeSlug);

          if (isMounted) {
            setClubInfo(info);
          }
        }
      } catch (err) {
        console.error("Error loading member profile:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (memberId) {
      loadMemberData();
    }
    return () => {
      isMounted = false;
    };
  }, [memberId, paramSlug]);

  const clubSlug =
    paramSlug ||
    member?.clubSlug ||
    ((member?.assn || "").toLowerCase().includes("vasavi") ? "vasavi" : "lions");
  const clubTitle =
    clubInfo?.short_name ||
    clubInfo?.name ||
    (clubSlug === "vasavi" ? "Vasavi Club" : "Lions Club");
  const clubThemeColor =
    clubInfo?.theme_color || (clubSlug === "vasavi" ? "#7c2d12" : "#005a36");
  const basePath = clubSlug === "lions" ? "/lions-club" : `/clubs/${clubSlug}`;

  if (isLoading) {
    return (
      <div className="pd-page">
        <div
          style={{
            textAlign: "center",
            padding: "100px 20px",
            color: "#64748b",
          }}
        >
          <Loader2
            size={36}
            className="animate-spin"
            style={{ margin: "0 auto 16px" }}
          />
          <p>Loading Member Profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="pd-page">
        <div
          className="pd-container"
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
          <h2>Member Profile Not Found</h2>
          <p style={{ color: "#64748b", margin: "12px 0 24px" }}>
            The requested member record is not available in the directory.
          </p>
          <button
            type="button"
            className="lions-back-btn"
            onClick={() => navigate(basePath)}
          >
            <ArrowLeft size={18} />
            <span>Back to Directory</span>
          </button>
        </div>
      </div>
    );
  }

  const displayName =
    member.fullBusinessName ||
    member.business_name ||
    member.fullName ||
    member.person_name ||
    "Unnamed Member";

  const fullAddress = [
    member.address || member.bussiness_address,
    member.city,
    member.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const rawPhone = member.mobile_number || member.phone || member.whats_app || "";
  const maskedPhone = maskPhoneNumber(rawPhone || "96857xxxxx");

  const keywords =
    member.keywords || member.profession || member.activity || "";

  const borderClass = member.isLeadership
    ? "card-business"
    : member.is_prime
    ? "card-prime"
    : "card-default";

  const handleCall = (e) => {
    e?.stopPropagation();
    if (!rawPhone) {
      alert("No phone number available");
      return;
    }
    window.location.href = `tel:${rawPhone}`;
  };

  const handleWhatsApp = (e) => {
    e?.stopPropagation();
    if (!rawPhone) {
      alert("No phone number available");
      return;
    }
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/91${cleanPhone}`, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} - ${member.clubName || clubTitle}`,
          text: `Contact details for ${displayName} on Celfonbook Directory`,
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
    <div className="pd-page">
      <Helmet>
        <title>
          {displayName} | {clubTitle} Directory | Celfonbook
        </title>
        <meta
          name="description"
          content={`View business profile and contact details for ${displayName} in ${
            member.clubName || clubTitle
          }.`}
        />
      </Helmet>

      <div className="pd-container">
        {/* Navigation & Breadcrumbs */}
        <div className="lions-nav-bar" style={{ marginBottom: "20px" }}>
          <button
            type="button"
            className="lions-back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="lions-breadcrumbs">
            <Link to={basePath} className="breadcrumb-link">
              {clubTitle}
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            {member.districtId && (
              <>
                <Link
                  to={`${basePath}/${member.districtId}`}
                  className="breadcrumb-link"
                >
                  District {member.districtId}
                </Link>
                <ChevronRight size={14} className="breadcrumb-separator" />
              </>
            )}
            {member.club && (
              <>
                <Link
                  to={`${basePath}/${member.districtId || "3242C"}/${encodeURIComponent(
                    member.club
                  )}`}
                  className="breadcrumb-link"
                >
                  {member.club}
                </Link>
                <ChevronRight size={14} className="breadcrumb-separator" />
              </>
            )}
            <span className="breadcrumb-current">{displayName}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN PROFILE CARD (EXACT SAME DESIGN AS Search/ProfileCard.jsx) */}
        {/* ======================================================== */}
        <div
          className={`profile-card ${borderClass}`}
          style={{
            marginBottom: "28px",
            padding: "24px 26px 20px",
            borderRadius: "16px",
          }}
        >
          {/* Heart / Favorite button - top right */}
          <button
            className={`heart-btn ${isFavorite ? "saved" : ""}`}
            onClick={() => setShowFavoriteModal(true)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            style={{ top: "16px", right: "16px" }}
          >
            <Heart
              size={20}
              fill={isFavorite ? "#ef4444" : "none"}
              stroke={isFavorite ? "none" : "#64748b"}
            />
          </button>

          {/* Prime badge - top left */}
          {member.is_prime && (
            <div className="prime-badge" style={{ top: "16px", left: "16px" }}>
              <span className="star">★</span> Prime
            </div>
          )}

          {/* Card Header */}
          <div
            className="card-header"
            style={{
              marginTop: member.is_prime ? "28px" : "4px",
              marginBottom: "12px",
            }}
          >
            <h2
              className="name"
              style={{
                fontSize: "1.55rem",
                fontWeight: "700",
                color: "#0f172a",
                lineHeight: "1.3",
              }}
            >
              {displayName}
            </h2>
            {member.person_name && member.fullBusinessName && (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "0.92rem",
                  color: "#475569",
                  fontWeight: "600",
                }}
              >
                👤 {member.person_name}
              </p>
            )}
          </div>

          {/* Card Info */}
          <div className="card-info" style={{ marginBottom: "20px" }}>
            <p className="type-location" style={{ fontSize: "0.95rem" }}>
              <MapPin size={16} /> {fullAddress || member.city || "Coimbatore"}
            </p>

            {rawPhone && (
              <p
                className="mobile"
                style={{ fontSize: "0.95rem", margin: "6px 0" }}
              >
                📞 {maskedPhone}
              </p>
            )}

            {keywords && (
              <p
                className="keywords"
                style={{ fontSize: "0.9rem", margin: "6px 0 8px" }}
              >
                {keywords
                  .split(",")
                  .slice(0, 4)
                  .map((kw, i) => (
                    <span key={i} style={{ marginRight: "6px" }}>
                      {kw.trim()}
                    </span>
                  ))}
              </p>
            )}

            {member.post_of_member && (
              <p
                className="post-role"
                style={{
                  fontWeight: "700",
                  color: clubThemeColor,
                  margin: "8px 0 4px",
                  fontSize: "0.95rem",
                }}
              >
                🎖️ {member.postFull || member.post_of_member}
              </p>
            )}

            {member.clubName && (
              <p
                className="club-info"
                style={{
                  color: "#475569",
                  margin: "4px 0",
                  fontSize: "0.9rem",
                }}
              >
                🏛️ {member.clubName}{" "}
                {member.districtId ? `• District ${member.districtId}` : ""}
              </p>
            )}

            {/* Celebrations info if present */}
            {(member.DOB || member.dob || member.DOW || member.dow) && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "8px",
                  flexWrap: "wrap",
                }}
              >
                {(member.DOB || member.dob) && (
                  <span
                    style={{
                      fontSize: "0.82rem",
                      background: "rgba(245, 158, 11, 0.12)",
                      color: "#b45309",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontWeight: "600",
                    }}
                  >
                    🎂 Birthday: {member.DOB || member.dob}
                  </span>
                )}
                {(member.DOW || member.dow) && (
                  <span
                    style={{
                      fontSize: "0.82rem",
                      background: "rgba(236, 72, 153, 0.12)",
                      color: "#be185d",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontWeight: "600",
                    }}
                  >
                    💍 Anniversary: {member.DOW || member.dow}{" "}
                    {member.spouse ? `(${member.spouse})` : ""}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Card Actions */}
          <div className="card-actions" style={{ gap: "12px" }}>
            <button
              type="button"
              className="btn call"
              onClick={handleCall}
              style={{
                height: "44px",
                fontSize: "0.95rem",
                fontWeight: "600",
                borderRadius: "10px",
                background: "#10b981",
                color: "white",
              }}
            >
              <Phone size={17} /> Call
            </button>

            <button
              type="button"
              className="btn enquire"
              onClick={handleWhatsApp}
              style={{
                height: "44px",
                fontSize: "0.95rem",
                fontWeight: "600",
                borderRadius: "10px",
                background: "#3b82f6",
                color: "white",
              }}
            >
              <MessageSquare size={17} /> Enquire
            </button>

            <button
              type="button"
              className="btn"
              onClick={handleShare}
              style={{
                background: "#f1f5f9",
                color: "#475569",
                border: "1px solid #cbd5e1",
                height: "44px",
                fontSize: "0.95rem",
                fontWeight: "600",
                borderRadius: "10px",
                flex: "0 0 100px",
              }}
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <DetailedProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasProducts={Boolean(member.is_prime)}
          hasMap={Boolean(fullAddress)}
        />

        {/* Tab Content Body */}
        <div
          className="pd-tab-content-wrapper"
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          }}
        >
          {activeTab === "about" && (
            <div className="pd-about-section">
              {/* Description */}
              {member.description && (
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#1e293b" }}>
                    About Business
                  </h3>
                  <p style={{ lineHeight: "1.7", color: "#475569" }}>
                    {member.description}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
                Contact & Profile Details
              </h3>
              <div className="pd-details-grid">
                {member.person_name && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Full Name:</strong>
                      <p>{member.person_name}</p>
                    </div>
                  </div>
                )}

                {member.mobile_number && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Mobile Number:</strong>
                      <p>{maskPhoneNumber(member.mobile_number)}</p>
                    </div>
                  </div>
                )}

                {member.whats_app && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>WhatsApp:</strong>
                      <p>{maskPhoneNumber(member.whats_app)}</p>
                    </div>
                  </div>
                )}

                {member.email && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Email:</strong>
                      <p>{maskEmail(member.email)}</p>
                    </div>
                  </div>
                )}

                {fullAddress && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Address:</strong>
                      <p>{fullAddress}</p>
                    </div>
                  </div>
                )}

                {member.city && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>City:</strong>
                      <p>{member.city}</p>
                    </div>
                  </div>
                )}

                {member.pincode && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Pincode:</strong>
                      <p>{member.pincode}</p>
                    </div>
                  </div>
                )}

                {member.web_site && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Website:</strong>
                      <p>
                        <a
                          href={formatWebsiteUrl(member.web_site)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Club Specific Details Header & Grid */}
              <hr
                style={{
                  border: 0,
                  borderTop: "1px solid #e2e8f0",
                  margin: "24px 0",
                }}
              />

              <h3 style={{ marginBottom: "16px", color: clubThemeColor }}>
                {clubTitle} Membership Details
              </h3>

              <div className="pd-details-grid">
                {member.post_of_member && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Post / Designation:</strong>
                      <p>{member.postFull || member.post_of_member}</p>
                    </div>
                  </div>
                )}

                {member.member_num && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Member Number:</strong>
                      <p>#{member.member_num}</p>
                    </div>
                  </div>
                )}

                {member.clubName && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Club Affiliation:</strong>
                      <p>{member.clubName}</p>
                    </div>
                  </div>
                )}

                {member.districtId && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>District:</strong>
                      <p>District {member.districtId}</p>
                    </div>
                  </div>
                )}

                {(member.DOB || member.dob) && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Date of Birth (🎂):</strong>
                      <p>{member.DOB || member.dob}</p>
                    </div>
                  </div>
                )}

                {(member.DOW || member.dow) && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Wedding Anniversary (💍):</strong>
                      <p>{member.DOW || member.dow}</p>
                    </div>
                  </div>
                )}

                {member.spouse && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Spouse Name:</strong>
                      <p>{member.spouse}</p>
                    </div>
                  </div>
                )}

                {member.blood_group && (
                  <div className="pd-detail-item">
                    <div>
                      <strong>Blood Group:</strong>
                      <p>{member.blood_group}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Products */}
          {member.is_prime && activeTab === "products" && (
            <DetailedProfileProducts priorityProducts={[]} />
          )}

          {/* Tab: Map */}
          {activeTab === "map" && (
            <DetailedProfileMap
              address={member.address || member.bussiness_address}
              city={member.city}
              pincode={member.pincode}
            />
          )}
        </div>
      </div>

      {/* Favorite Modal */}
      {showFavoriteModal && (
        <FavoriteModal
          show={showFavoriteModal}
          onClose={() => setShowFavoriteModal(false)}
          selectedItem={member}
          onSaved={() => {
            setIsFavorite(true);
            window.dispatchEvent(new Event("favorites-updated"));
          }}
        />
      )}
    </div>
  );
}
