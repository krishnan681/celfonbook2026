// features/DetailedProfile/components/DetailedProfileAbout.jsx

import { MdLocationOn } from "react-icons/md";
import { FaPhoneAlt, FaGlobe } from "react-icons/fa";
import "../css/DetailedProfileAbout.css";

import { formatWebsiteUrl } from "../../../core/utils/urlFormatter";

export default function DetailedProfileAbout({ profile }) {

  // 🔥 Mask Phone Number (98567xxxxx)
  const maskPhoneNumber = (num) => {
    if (!num) return "";

    const str = num.toString().trim();

    if (str.length <= 5) return str;

    return str.slice(0, 5) + "x".repeat(str.length - 5);
  };

  const fullAddress = [
    profile.address,
    profile.city,
    profile.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="pd-about-section">
      <h3>Business Information</h3>

      <p className="pd-long-desc">
        {profile.description || "Leading provider of quality services."}
      </p>

      <div className="pd-details-grid">

        {/* Address */}
        {fullAddress && (
          <div className="pd-detail-item">
            <MdLocationOn className="pd-icon" />
            <div>
              <strong>Address</strong>
              <p>{fullAddress}</p>
            </div>
          </div>
        )}

        {/* Contact (Masked) */}
        {profile.mobile_number && (
          <div className="pd-detail-item">
            <FaPhoneAlt className="pd-icon" />
            <div>
              <strong>Contact</strong>
              <p>{maskPhoneNumber(profile.mobile_number)}</p>
            </div>
          </div>
        )}

        {/* Website */}
        {profile.web_site && (
          <div className="pd-detail-item">
            <FaGlobe className="pd-icon" />
            <div>
              <strong>Website</strong>
              <p>
                <a
                  href={formatWebsiteUrl(profile.web_site)}
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
    </div>
  );
}