// src/features/clubs/pages/ClubMemberDetailPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ChevronRight, Loader2, Award, Calendar, Heart } from "lucide-react";
import { MdVerified, MdBusiness } from "react-icons/md";
import { supabase } from "../../../core/config/supabaseClient";
import { useFavorites } from "../../../core/context/FavoritesContext";
import { getMemberById, getClubInfo } from "../services/clubService";
import { getProfileSEO } from "../../../core/seo/seoHelper";

import FavoriteModal from "../../search/components/FavoriteModal";
import DetailedProfileHeader from "../../DetailedProfile/components/DetailedProfileHeader";
import DetailedProfileTabs from "../../DetailedProfile/components/DetailedProfileTabs";
import DetailedProfileAbout from "../../DetailedProfile/components/DetailedProfileAbout";
import DetailedProfileProducts from "../../DetailedProfile/components/DetailedProfileProducts";
import DetailedProfileMap from "../../DetailedProfile/components/DetailedProfileMap";

import "../../DetailedProfile/css/ProfileDetailPage.css";
import "./css/LionsClubPages.css";

export default function ClubMemberDetailPage() {
  const { memberId, clubSlug: paramSlug } = useParams();
  const navigate = useNavigate();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [member, setMember] = useState(null);
  const [clubInfo, setClubInfo] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [priorityProducts, setPriorityProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);

  // Fetch Member & Club Info
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

  // Load Cover Images & Products for Prime Members
  useEffect(() => {
    if (!member) return;

    // Build Image Gallery
    const memberImages = [];
    if (member.cover_image?.trim()) {
      const imgs = member.cover_image
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean);
      memberImages.push(...imgs);
    }
    if (member.profile_image) memberImages.push(member.profile_image);
    if (member.photo_url) memberImages.push(member.photo_url);
    if (member.avatar) memberImages.push(member.avatar);
    if (member.image_url) memberImages.push(member.image_url);

    if (memberImages.length > 0) {
      setImages([...new Set(memberImages)]);
    } else {
      // Fallback to shared header images or placeholder
      const loadSharedHeaders = async () => {
        try {
          const { data } = await supabase
            .from("free_tier_shared_header_images")
            .select("image_url")
            .order("sort_order", { ascending: true })
            .limit(3);

          if (data && data.length > 0) {
            setImages(data.map((d) => d.image_url));
          } else {
            setImages(["https://via.placeholder.com/800x450?text=Member+Profile"]);
          }
        } catch (e) {
          setImages(["https://via.placeholder.com/800x450?text=Member+Profile"]);
        }
      };
      loadSharedHeaders();
    }

    // Load Products if Prime
    if (member.is_prime && member.id) {
      const loadProducts = async () => {
        try {
          const { data } = await supabase
            .from("products")
            .select("*")
            .eq("profile_id", member.id)
            .order("priority", { ascending: false });
          if (data) setPriorityProducts(data);
        } catch (e) {
          console.error("Error loading member products:", e);
        }
      };
      loadProducts();
    }
  }, [member]);

  const clubSlug =
    paramSlug ||
    member?.clubSlug ||
    ((member?.assn || "").toLowerCase().includes("vasavi") ? "vasavi" : "lions");
  const clubTitle =
    clubInfo?.short_name ||
    clubInfo?.name ||
    (clubSlug === "vasavi" ? "Vasavi Club" : "Lions Club");
  const clubThemeColor =
    clubInfo?.theme_color || (clubSlug === "vasavi" ? "#dc2626" : "#005a36");
  const basePath = clubSlug === "lions" ? "/lions-club" : `/clubs/${clubSlug}`;

  // Normalized Profile Object for DetailedProfile Components
  const normalizedProfile = useMemo(() => {
    if (!member) return null;
    return {
      ...member,
      id: member.id,
      business_name:
        member.fullBusinessName ||
        member.business_name ||
        member.fullName ||
        member.person_name ||
        "Unnamed Member",
      person_name: member.person_name || member.fullName || "",
      keywords: member.keywords || member.profession || member.activity || "",
      mobile_number: member.mobile_number || member.phone || "",
      whats_app:
        member.whats_app || member.mobile_number || member.phone || "",
      email: member.email || "",
      web_site: member.web_site || "",
      address: member.address || member.bussiness_address || "",
      city: member.city || "",
      pincode: member.pincode || "",
      description: member.description || "",
      is_prime: Boolean(member.is_prime),
      priority: Boolean(member.priority || member.isLeadership),
    };
  }, [member]);

  const isFavorite = useMemo(() => {
    if (!normalizedProfile?.id || !favorites) return false;
    return favorites.some((fav) => fav.id === normalizedProfile.id);
  }, [favorites, normalizedProfile]);

  const handleFavoriteToggle = () => {
    if (!normalizedProfile) return;
    if (isFavorite) {
      removeFavorite(normalizedProfile.id);
    } else {
      setShowFavoriteModal(true);
    }
  };

  const handleShare = async () => {
    if (!normalizedProfile) return;
    const shareTitle = `${normalizedProfile.business_name} - ${
      member?.clubName || clubTitle
    }`;
    const shareText = `View ${normalizedProfile.business_name} on Celfonbook Directory`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
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

  if (!member || !normalizedProfile) {
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

  const seo = getProfileSEO(normalizedProfile);
  const fullAddress = [
    member.address || member.bussiness_address,
    member.city,
    member.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const hasClubDetails = Boolean(
    member.post_of_member ||
      member.postFull ||
      member.member_num ||
      member.clubName ||
      member.districtId ||
      member.DOB ||
      member.dob ||
      member.DOW ||
      member.dow ||
      member.spouse ||
      member.blood_group
  );

  return (
    <div className="pd-page">
      <Helmet>
        <title>
          {normalizedProfile.business_name} | {clubTitle} Directory | Celfonbook
        </title>
        <meta
          name="description"
          content={`View business profile and contact details for ${
            normalizedProfile.business_name
          } in ${member.clubName || clubTitle}.`}
        />
        <meta name="keywords" content={seo.keywords} />
      </Helmet>

      {/* Breadcrumb Navigation Bar */}
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
            <span className="breadcrumb-current">
              {normalizedProfile.business_name}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Header Component (Exact Same Design as ProfileDetailPage) */}
      <DetailedProfileHeader
        profile={normalizedProfile}
        images={images}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        isFavorite={isFavorite}
        onShare={handleShare}
        onToggleFavorite={handleFavoriteToggle}
      />

      {/* Main Layout: Tabs + Tab Content Body */}
      <div className="pd-container pd-main-layout">
        <div className="pd-left-content">
          <DetailedProfileTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            profile={normalizedProfile}
          />

          <div className="pd-tab-body">
            {/* Tab: About & Club Details */}
            {activeTab === "about" && (
              <>
                {/* Standard Business Details */}
                <DetailedProfileAbout profile={normalizedProfile} />

                {/* Club-Specific Membership Details */}
                {hasClubDetails && (
                  <div
                    className="pd-about-section"
                    style={{ marginTop: "24px" }}
                  >
                    <h3 style={{ color: clubThemeColor }}>
                      {clubTitle} Membership Information
                    </h3>

                    <div className="pd-details-grid">
                      {(member.postFull || member.post_of_member) && (
                        <div className="pd-detail-item">
                          <div>
                            <strong>Post / Designation:</strong>
                            <p style={{ fontWeight: "700", color: clubThemeColor }}>
                              {member.postFull || member.post_of_member}
                            </p>
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

                      {member.member_num && (
                        <div className="pd-detail-item">
                          <div>
                            <strong>Member ID / Number:</strong>
                            <p>#{member.member_num}</p>
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
              </>
            )}

            {/* Tab: Products (For Prime Members) */}
            {normalizedProfile?.is_prime && activeTab === "products" && (
              <DetailedProfileProducts priorityProducts={priorityProducts} />
            )}

            {/* Tab: Map */}
            {activeTab === "map" && (
              <DetailedProfileMap
                address={normalizedProfile.address}
                city={normalizedProfile.city}
                pincode={normalizedProfile.pincode}
              />
            )}
          </div>
        </div>
      </div>

      {/* Favorite Modal */}
      <FavoriteModal
        show={showFavoriteModal}
        onClose={() => setShowFavoriteModal(false)}
        onSave={(cat) => {
          addFavorite({
            ...normalizedProfile,
            category: cat,
          });
          setShowFavoriteModal(false);
        }}
        selectedItem={normalizedProfile}
      />
    </div>
  );
}
