// // features/DetailedProfile/components/DetailedProfileAbout.jsx

// import { MdLocationOn } from "react-icons/md";
// import { FaPhoneAlt, FaGlobe } from "react-icons/fa";
// import "../css/DetailedProfileAbout.css";

// import { formatWebsiteUrl } from "../../../core/utils/urlFormatter";

// export default function DetailedProfileAbout({ profile }) {

//   // 🔥 Mask Phone Number (98567xxxxx)
//   const maskPhoneNumber = (num) => {
//     if (!num) return "";

//     const str = num.toString().trim();

//     if (str.length <= 5) return str;

//     return str.slice(0, 5) + "x".repeat(str.length - 5);
//   };

//   const fullAddress = [
//     profile.address,
//     profile.city,
//     profile.pincode,
//   ]
//     .filter(Boolean)
//     .join(", ");

//   return (
//     <div className="pd-about-section">
//       <h3>Business Information</h3>

//       <p className="pd-long-desc">
//         {profile.description || " "}
//       </p>

//       <div className="pd-details-grid">

//         {/* Address */}
//         {fullAddress && (
//           <div className="pd-detail-item">
//             <MdLocationOn className="pd-icon" />
//             <div>
//               <strong>Address</strong>
//               <p>{fullAddress}</p>
//             </div>
//           </div>
//         )}

//         {/* Contact (Masked) */}
//         {profile.mobile_number && (
//           <div className="pd-detail-item">
//             <FaPhoneAlt className="pd-icon" />
//             <div>
//               <strong>Contact</strong>
//               <p>{maskPhoneNumber(profile.mobile_number)}</p>
//             </div>
//           </div>
//         )}

//         {/* Website */}
//         {profile.web_site && (
//           <div className="pd-detail-item">
//             <FaGlobe className="pd-icon" />
//             <div>
//               <strong>Website</strong>
//               <p>
//                 <a
//                   href={formatWebsiteUrl(profile.web_site)}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Visit Website
//                 </a>
//               </p>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// features/DetailedProfile/components/DetailedProfileAbout.jsx


import { MdLocationOn } from "react-icons/md";
import { FaPhoneAlt, FaGlobe } from "react-icons/fa";
import "../css/DetailedProfileAbout.css";

import { formatWebsiteUrl } from "../../../core/utils/urlFormatter";

export default function DetailedProfileAbout({ profile }) {
  const maskPhoneNumber = (num) => {
    if (!num) return "";

    const str = num.toString().trim();

    if (str.length <= 5) return str;

    return str.slice(0, 5) + "x".repeat(str.length - 5);
  };

  const fullAddress = [profile?.address].filter(Boolean).join(", ");

  return (
    <div className="pd-about-section">
      <h3>Business Information</h3>

      <div className="pd-details-grid">
        {profile?.description && (
          <div className="pd-detail-item">
            <div>
              <strong>Description:</strong>
              <p>{profile.description}</p>
            </div>
          </div>
        )}
        

        {/* Name */}
        {profile?.person_name && (
          <div className="pd-detail-item">
            <div>
              <strong>Name:</strong>
              <p>{profile.person_name}</p>
            </div>
          </div>
        )}

        {/* Mobile */}
        {profile?.mobile_number && (
          <div className="pd-detail-item">
            {/* <FaPhoneAlt className="pd-icon" /> */}
            <div>
              <strong>Mobile Number:</strong>
              <p>{maskPhoneNumber(profile.mobile_number)}</p>
            </div>
          </div>
        )}

        {/* WhatsApp */}
        {profile?.whats_app && (
          <div className="pd-detail-item">
            <div>
              <strong>WhatsApp:</strong>
              <p>{profile.whats_app}</p>
            </div>
          </div>
        )}

        {/* Email */}
        {profile?.email && (
          <div className="pd-detail-item">
            <div>
              <strong>Email:</strong>
              <p>{profile.email}</p>
            </div>
          </div>
        )}

        {/* Landline */}
        {(profile?.landline_code || profile?.landline_number) && (
          <div className="pd-detail-item">
            <div>
              <strong>Landline:</strong>
              <p>
                {profile.landline_code} {profile.landline_number}
              </p>
            </div>
          </div>
        )}
        

        {/* Address */}
        {fullAddress && (
          <div className="pd-detail-item">
            {/* <MdLocationOn className="pd-icon" /> */}
            <div>
              <strong>Address:</strong>
              <p>{fullAddress}</p>
            </div>
          </div>
        )}

        {/* City */}
        {profile?.city && (
          <div className="pd-detail-item">
            <div>
              <strong>City:</strong>
              <p>{profile.city}</p>
            </div>
          </div>
        )}

        

        {/* Pincode */}
        {profile?.pincode && (
          <div className="pd-detail-item">
            <div>
              <strong>Pincode:</strong>
              <p>{profile.pincode}</p>
            </div>
          </div>
        )}

        {/* Website */}
        {profile?.web_site && (
          <div className="pd-detail-item">
            {/* <FaGlobe className="pd-icon" /> */}
            <div>
              <strong>Website:</strong>
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

        {/* Keywords */}
        {profile?.keywords && (
          <div className="pd-detail-item">
            <div>
              <strong>Keywords:</strong>
              <p>{profile.keywords}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
