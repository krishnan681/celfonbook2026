// src/features/clubs/pages/LionsMemberDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  FaHeart,
  FaRegHeart,
  FaPhoneAlt,
  FaWhatsapp,
  FaGlobe,
  FaEnvelope,
  FaShareAlt,
} from "react-icons/fa";
import { MdVerified, MdLocationOn, MdBusiness } from "react-icons/md";
import { formatWebsiteUrl } from "../../../core/utils/urlFormatter";
import { maskPhoneNumber, maskEmail } from "../../../core/utils/maskHelper";
import { getLionsMemberById, getClubMembers } from "../services/lionsClubService";
import FavoriteModal from "../../search/components/FavoriteModal";
import DetailedProfileTabs from "../../DetailedProfile/components/DetailedProfileTabs";
import DetailedProfileMap from "../../DetailedProfile/components/DetailedProfileMap";
import DetailedProfileProducts from "../../DetailedProfile/components/DetailedProfileProducts";
import "../../DetailedProfile/css/ProfileDetailPage.css";
import "../../DetailedProfile/css/DetailedProfileHeader.css";
import "../../DetailedProfile/css/DetailedProfileAbout.css";
import "../../DetailedProfile/css/DetailedRelatedProfiles.css";
import "./css/LionsClubPages.css";

export default function LionsMemberDetailPage() {
  const { memberId, clubSlug: paramSlug } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [relatedMembers, setRelatedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [imageOrientation, setImageOrientation] = useState("landscape");

  useEffect(() => {
    let isMounted = true;
    async function loadMemberData() {
      setIsLoading(true);
      try {
        const data = await getLionsMemberById(memberId);
        if (isMounted) {
          setMember(data);
          if (data && data.club) {
            const clubMems = await getClubMembers(data.districtId, data.club, data.clubSlug || paramSlug || "lions");
            if (isMounted) {
              setRelatedMembers(
                (clubMems || [])
                  .filter((m) => m.id !== data.id)
                  .slice(0, 4)
              );
            }
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

  const clubSlug = paramSlug || member?.clubSlug || "lions";
  const basePath = clubSlug === "lions" ? "/lions-club" : `/clubs/${clubSlug}`;

  if (isLoading) {
    return (
      <div className="pd-page">
        <div style={{ textAlign: "center", padding: "100px 20px", color: "#64748b" }}>
          <Loader2 size={36} className="animate-spin" style={{ margin: "0 auto 16px" }} />
          <p>Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="pd-page">
        <div className="pd-container" style={{ textAlign: "center", padding: "60px 20px" }}>
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

  const whatsappLink = member.whats_app || member.mobile_number
    ? `https://wa.me/91${(member.whats_app || member.mobile_number).replace(/[^0-9]/g, "")}`
    : null;

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageOrientation(naturalHeight > naturalWidth ? "portrait" : "landscape");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} - ${member.clubName}`,
          text: `Contact details for ${displayName} on Directory`,
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

  const coverImage = member.cover_image || member.profile_image;

  return (
    <div className="pd-page">
      <Helmet>
        <title>{displayName} | {member.clubName} | Celfonbook</title>
        <meta
          name="description"
          content={`Profile of ${displayName}, ${member.postFull || member.post_of_member || "Member"} of ${member.clubName}, District ${member.districtId}.`}
        />
      </Helmet>

      {/* Navigation Breadcrumb Bar */}
      <div className="pd-container" style={{ paddingTop: "16px" }}>
        <div className="lions-nav-bar" style={{ marginBottom: "16px" }}>
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
              Districts
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link to={`${basePath}/${member.districtId}`} className="breadcrumb-link">
              District {member.districtId}
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <Link
              to={`${basePath}/${member.districtId}/${encodeURIComponent(member.club)}`}
              className="breadcrumb-link"
            >
              {member.clubName.replace(/^(Lions|Vasavi|Rotary)\s+Club\s+of\s+/i, "")}
            </Link>
            <ChevronRight size={14} className="breadcrumb-separator" />
            <span className="breadcrumb-current">{member.person_name || member.name}</span>
          </div>
        </div>
      </div>

      {/* DetailedProfileHeader Hero Section */}
      <div className="pd-hero">
        <div className="pd-container pd-hero-flex">
          {/* Gallery / Image Box */}
          <div className={`pd-gallery shadow-sm ${imageOrientation}`}>
            {coverImage ? (
              <img
                src={coverImage}
                alt="Profile Cover"
                className="pd-main-img"
                onLoad={handleImageLoad}
              />
            ) : (
              <div className="pd-no-img">
                <MdBusiness size={50} color="#16a34a" />
                <p>{member.clubName || "Lions Club Member"}</p>
              </div>
            )}
          </div>

          {/* Main Details */}
          <div className="pd-main-details">
            <div className="pd-top-row">
              <div className="pd-header-info">
                <div className="pd-badge-row">
                  {member.post_of_member && (
                    <span className="pd-prime-tag" style={{ background: "#005a36" }}>
                      {member.postFull || member.post_of_member}
                    </span>
                  )}
                  {member.is_prime && <span className="pd-prime-tag">PRIME</span>}
                  <span
                    className="pd-prime-tag"
                    style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" }}
                  >
                    District {member.districtId}
                  </span>
                </div>

                <h1 className="pd-title">
                  {displayName}
                  {(member.priority || member.verified) && (
                    <MdVerified className="verified-icon" />
                  )}
                </h1>

                {member.keywords && <p className="pd-keywords">{member.keywords}</p>}
              </div>

              {/* Action Buttons (Favorite & Share) */}
              <div className="pd-action-group">
                <button
                  type="button"
                  className="pd-circle-btn"
                  onClick={handleShare}
                  title="Share Profile"
                >
                  <FaShareAlt />
                </button>

                <button
                  type="button"
                  className={`pd-circle-btn ${isFavorite ? "active" : ""}`}
                  onClick={() => setShowFavoriteModal(true)}
                  title="Favorite"
                >
                  {isFavorite ? <FaHeart color="#ff4757" /> : <FaRegHeart />}
                </button>
              </div>
            </div>

            {/* Contact Strip */}
            <div className="pd-contact-strip">
              <div className="pd-loc">
                <MdLocationOn /> {member.city || "Tamil Nadu"}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pd-cta-row">
              {(member.mobile_number || member.phone) && (
                <a
                  href={`tel:${member.mobile_number || member.phone}`}
                  className="pd-action-chip chip-call"
                >
                  <FaPhoneAlt /> <span>Call</span>
                </a>
              )}

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-action-chip chip-whatsapp"
                >
                  <FaWhatsapp /> <span>WhatsApp</span>
                </a>
              )}

              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="pd-action-chip chip-email"
                >
                  <FaEnvelope /> <span>Email</span>
                </a>
              )}

              {member.web_site && (
                <a
                  href={formatWebsiteUrl(member.web_site)}
                  className="pd-action-chip chip-website"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGlobe /> <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Main Body Layout */}
      <div className="pd-container pd-main-layout">
        <div className="pd-left-content">
          <DetailedProfileTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            profile={member}
          />

          <div className="pd-tab-body">
            {/* Tab: About */}
            {activeTab === "about" && (
              <div className="pd-about-section">
                <h3>Business &amp; Personal Information</h3>

                <div className="pd-details-grid">
                  {member.description && (
                    <div className="pd-detail-item" style={{ gridColumn: "1 / -1" }}>
                      <div>
                        <strong>Description:</strong>
                        <p>{member.description}</p>
                      </div>
                    </div>
                  )}

                  {member.person_name && (
                    <div className="pd-detail-item">
                      <div>
                        <strong>Name:</strong>
                        <p>{member.fullName || member.person_name}</p>
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

                  {member.keywords && (
                    <div className="pd-detail-item">
                      <div>
                        <strong>Keywords:</strong>
                        <p>{member.keywords}</p>
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

                {/* Thin divider line */}
                <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "24px 0" }} />

                <h3 style={{ marginBottom: "16px", color: "#005a36" }}>Lions Club Details</h3>

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

            {/* Tab: Products (for prime members) */}
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
      </div>

      {/* Related Members Section */}
      {relatedMembers.length > 0 && (
        <div className="pd-container pd-related-section">
          <h3>Other Members in {member.clubName}</h3>

          <div className="pd-related-grid">
            {relatedMembers.map((rel) => (
              <div
                key={rel.id}
                className="pd-related-card"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate(`/lions-club/member/${rel.id}`);
                }}
              >
                <h4>{rel.business_name || rel.fullName || rel.person_name || "Unnamed Lion"}</h4>
                <p className="pd-rel-loc">
                  <MdLocationOn size={14} />
                  {rel.city || "Tamil Nadu"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorite Modal */}
      <FavoriteModal
        show={showFavoriteModal}
        onClose={() => setShowFavoriteModal(false)}
        onSave={() => {
          setIsFavorite(true);
          setShowFavoriteModal(false);
        }}
        selectedItem={member}
      />
    </div>
  );
}
