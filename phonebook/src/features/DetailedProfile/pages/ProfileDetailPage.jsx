// features/DetailedProfile/pages/ProfileDetailPage.jsx
import { FaHeart, FaRegHeart } from "react-icons/fa";
import FavoriteModal from "@/features/search/components/FavoriteModal";

import DetailedProfileHeader        from "../components/DetailedProfileHeader";
import DetailedProfileTabs          from "../components/DetailedProfileTabs";
import DetailedProfileAbout         from "../components/DetailedProfileAbout";
import DetailedProfileProducts      from "../components/DetailedProfileProducts";
import DetailedProfileMap           from "../components/DetailedProfileMap";
// import DetailedQuickEnquiryForm     from "../components/DetailedQuickEnquiryForm";
import DetailedRelatedProfiles      from "../components/DetailedRelatedProfiles";

import { useProfileDetail } from "../controller/useProfileDetail";
import "../css/ProfileDetailPage.css";

export default function ProfileDetailPage() {
  const {
    profile,
    images,
    currentIndex,
    setCurrentIndex,
    priorityProducts,
    relatedProfiles,
    activeTab,
    setActiveTab,
    showFavoriteModal,
    setShowFavoriteModal,
    isFavorite,
    handleShare,
    handleFavoriteToggle,
    addFavorite,
  } = useProfileDetail();

  if (!profile) return <div className="loader-box">Loading Profile...</div>;

  return (
    <div className="pd-page">
      <DetailedProfileHeader
        profile={profile}
        images={images}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        isFavorite={isFavorite}
        onShare={handleShare}
        onToggleFavorite={handleFavoriteToggle}
      />

      <div className="pd-container pd-main-layout">
        <div className="pd-left-content">
          <DetailedProfileTabs activeTab={activeTab} onChange={setActiveTab} />

          <div className="pd-tab-body">
            {activeTab === "about"    && <DetailedProfileAbout profile={profile} />}
            {activeTab === "products" && <DetailedProfileProducts priorityProducts={priorityProducts} />}
            {activeTab === "map"      && <DetailedProfileMap address={profile.address} city={profile.city} pincode={profile.pincode} />}
          </div>
        </div>

        {/* <div className="pd-right-sidebar">
          <DetailedQuickEnquiryForm />
        </div> */}
      </div>

      {relatedProfiles.length > 0 && (
        <DetailedRelatedProfiles
          items={relatedProfiles}
          // you can pass navigate if needed, or use useNavigate inside component
        />
      )}

      <FavoriteModal
        show={showFavoriteModal}
        onClose={() => setShowFavoriteModal(false)}
        onSave={cat => {
          addFavorite({ ...profile, category: cat });
          setShowFavoriteModal(false);
        }}
        selectedItem={profile}
      />
    </div>
  );
}