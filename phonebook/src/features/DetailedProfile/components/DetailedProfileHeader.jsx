import {
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa";
import { MdVerified, MdLocationOn, MdBusiness } from "react-icons/md";
import { useState } from "react";
import "../css/DetailedProfileHeader.css";

import { formatWebsiteUrl } from '../../../core/utils/urlFormatter';

export default function DetailedProfileHeader({
  profile,
  images,
  currentIndex,
  isFavorite,
  onShare,
  onToggleFavorite,
}) {
  const [showFullImage, setShowFullImage] = useState(false);

  // 🔥 NEW: orientation state
  const [imageOrientation, setImageOrientation] = useState("landscape");

  if (!profile) return null;

  const displayName =
    profile.business_name || profile.person_name || "Unnamed Business";

  const whatsappLink = profile.whats_app
    ? `https://wa.me/${profile.whats_app}`
    : null;

  // 🔥 NEW: detect orientation
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;

    if (naturalHeight > naturalWidth) {
      setImageOrientation("portrait");
    } else {
      setImageOrientation("landscape");
    }
  };

  return (
    <>
      <div className="pd-hero">
        <div className="pd-container pd-hero-flex">

          {/* Gallery */}
          <div className={`pd-gallery shadow-sm ${imageOrientation}`}>
            {images.length > 0 ? (
              <img
                src={images[currentIndex]}
                alt="Business Cover"
                className="pd-main-img"
                onClick={() => setShowFullImage(true)}
                onLoad={handleImageLoad} // 🔥 IMPORTANT
                style={{ cursor: "zoom-in" }}
              />
            ) : (
              <div className="pd-no-img">
                <MdBusiness size={50} />
                <p>Loading Cover...</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="pd-main-details">
            <div className="pd-top-row">
              <div className="pd-header-info">
                <div className="pd-badge-row">
                  {profile.is_prime && (
                    <span className="pd-prime-tag">PRIME</span>
                  )}
                </div>

                <h1 className="pd-title">
                  {displayName}
                  {profile.priority && (
                    <MdVerified className="verified-icon" />
                  )}
                </h1>

                <p className="pd-keywords">{profile.keywords}</p>
              </div>

              {/* Action Buttons */}
              <div className="pd-action-group">
                <button
                  className="pd-circle-btn"
                  onClick={onShare}
                  title="Share"
                >
                  <FaShareAlt />
                </button>

                <button
                  className={`pd-circle-btn ${isFavorite ? "active" : ""}`}
                  onClick={onToggleFavorite}
                  title="Favorite"
                >
                  {isFavorite ? (
                    <FaHeart color="#ff4757" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
            </div>

            {/* Contact Strip */}
            <div className="pd-contact-strip">
              <div className="pd-loc">
                <MdLocationOn /> {profile.city || "Not specified"}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pd-cta-row">
              {profile.mobile_number && (
                <a
                  href={`tel:${profile.mobile_number}`}
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

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="pd-action-chip chip-email"
                >
                  <FaEnvelope /> <span>Email</span>
                </a>
              )}

              {profile.web_site && (
                <a
                  href={formatWebsiteUrl(profile.web_site)}
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

      {/* FULL IMAGE MODAL */}
      {showFullImage && (
        <div
          className="pd-image-modal"
          onClick={() => setShowFullImage(false)}
        >
          <img
            src={images[currentIndex]}
            alt="Full View"
            className="pd-full-img"
          />
        </div>
      )}
    </>
  );
}