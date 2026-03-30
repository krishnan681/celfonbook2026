// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../../core/config/supabaseClient";
// import { getMyProfile, getSignUpProfile } from "../../../core/services/profileService";

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);          // from public.profiles
//   const [basicProfile, setBasicProfile] = useState(null); // from public.s_profiles
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // 1. Check if user is actually logged in
//         const { data: { user } } = await supabase.auth.getUser();
//         if (!user) {
//           if (isMounted) {
//             setError("Please sign in to view your profile.");
//             setLoading(false);
//           }
//           return;
//         }

//         // 2. Try to get the rich/editable profile first
//         const mainProfile = await getMyProfile();

//         if (isMounted) {
//           setProfile(mainProfile);

//           // If no rich profile exists yet → load basic signup info as fallback
//           if (!mainProfile) {
//             const signupData = await getSignUpProfile();
//             setBasicProfile(signupData);
//           }
//         }
//       } catch (err) {
//         console.error("Profile page error:", err);
//         if (isMounted) {
//           setError("Failed to load profile. Please try again later.");
//         }
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchProfile();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div style={{ padding: "80px 20px", textAlign: "center" }}>
//         <p>Loading your profile...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ padding: "40px", textAlign: "center", color: "#d32f2f" }}>
//         <h2>Error</h2>
//         <p>{error}</p>
//         <button
//           onClick={() => navigate("/login")}
//           style={{ marginTop: "20px", padding: "10px 24px" }}
//         >
//           Go to Sign In
//         </button>
//       </div>
//     );
//   }

//   if (!profile && !basicProfile) {
//     return (
//       <div style={{ padding: "40px", textAlign: "center" }}>
//         <h2>No Profile Found</h2>
//         <p>It looks like your detailed profile hasn't been created yet.</p>
//         <button
//           onClick={() => navigate("/profile/edit")}
//           style={{ marginTop: "20px", padding: "12px 28px" }}
//         >
//           Create Profile
//         </button>
//       </div>
//     );
//   }

//   // Show whichever we have (prefer full profile)
//   const display = profile || basicProfile;
//   const isBasicOnly = !profile && basicProfile;

//   return (
//     <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
//       <h1 style={{ marginBottom: "24px" }}>My Profile</h1>

//       <div style={{ background: "#f8f9fa", padding: "24px", borderRadius: "8px", marginBottom: "24px" }}>
//         <ProfileField label="Name" value={display.person_name || display.full_name || "—"} />
//         <ProfileField label="Phone" value={display.mobile_number || display.phone || "—"} />
//         <ProfileField label="City" value={display.city || "—"} />
//         {display.business_name && (
//           <ProfileField label="Business Name" value={display.business_name} />
//         )}
//       </div>

//       {isBasicOnly && (
//         <div style={{
//           background: "#fff3cd",
//           padding: "16px",
//           borderRadius: "8px",
//           border: "1px solid #ffeeba",
//           marginBottom: "24px"
//         }}>
//           <p style={{ margin: 0, color: "#664d03" }}>
//             <strong>Note:</strong> This is your basic signup information.<br />
//             Click "Edit Profile" below to add more details and complete your profile.
//           </p>
//         </div>
//       )}

//       <button
//         onClick={() => navigate("/profile/edit")}
//         style={{
//           padding: "12px 32px",
//           fontSize: "16px",
//           background: "#1976d2",
//           color: "white",
//           border: "none",
//           borderRadius: "6px",
//           cursor: "pointer"
//         }}
//       >
//         {isBasicOnly ? "Complete Profile" : "Edit Profile"}
//       </button>
//     </div>
//   );
// };

// const ProfileField = ({ label, value }) => (
//   <div style={{ marginBottom: "16px" }}>
//     <strong style={{ display: "inline-block", width: "140px" }}>{label}:</strong>
//     <span>{value}</span>
//   </div>
// );

// export default ProfilePage;


// ProfilePage.jsx




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../../core/config/supabaseClient";
// import { getMyProfile, getSignUpProfile } from "../../../core/services/profileService";
// import { Edit3, MapPin, Phone, Briefcase, Mail } from "lucide-react";
// import Toast from "../../../components/common/Toast";
// import "../css/profile.css";

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [signupProfile, setSignupProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (!user) throw new Error("User not authenticated");

//         const mainProfile = await getMyProfile();
//         const signupData = await getSignUpProfile();

//         setProfile(mainProfile);
//         setSignupProfile(signupData);
//       } catch (err) {
//         setToast({ message: "Failed to load profile", type: "error" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfile();
//   }, []);

//   if (loading) return <div className="loader-screen">Loading...</div>;

//   const data = profile || {};

//   const name =
//     signupProfile?.full_name ||
//     signupProfile?.business_name ||
//     data.person_name ||
//     data.business_name ||
//     "Anonymous User";

//   const mobile =
//     signupProfile?.phone ||
//     data.mobile_number ||
//     "Not set";

//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   const productList =
//     data.keywords?.split(",").map((item) => item.trim()) || [];

//   return (
//     <div className="profile-dashboard">
//       {toast && <Toast {...toast} onClose={() => setToast(null)} />}

//       <div className="dashboard-grid">
//         <div className="grid-main">
//           <section className="card profile-main">
//             <button
//               className="edit-icon-btn"
//               onClick={() => navigate("/profile/edit")}
//             >
//               <Edit3 size={18} /> <strong> Edit Profile </strong>
//             </button>

//             <div className="profile-header">
//               <div className="avatar-large">
//                 {data.profile_image ? (
//                   <img src={data.profile_image} alt="Profile" />
//                 ) : (
//                   initials
//                 )}
//               </div>

//               <div className="profile-info">
//                 <h2>{name}</h2>

//                 <div className="info-row">
//                   <p>
//                     <MapPin size={14} /> <span>Name:</span>{" "}
//                     {data.person_name
//                       ? `${data.person_name}`
//                       : "No Name ."}
//                   </p>
//                   <p>
//                     <MapPin size={14} /> <span>Address:</span>{" "}
//                     {data.address
//                       ? `${data.address}, ${data.city || ""}, ${data.pincode || ""}`
//                       : "No address provided."}
//                   </p>
//                   <p>
//                     <MapPin size={14} /> <span>City:</span>{" "}
//                     {data.city || signupProfile?.city || "Not set"}
//                   </p>
//                   <p>
//                     <Mail size={14} /> <span>Email:</span>{" "}
//                     {data.email || "Not set"}
//                   </p>
//                 </div>




//                 <div className="info-row">
//                   <p>
//                     <Phone size={14} /> <span>Mobile:</span> {mobile}
//                   </p>
//                   <p>
//                     <Briefcase size={14} /> <span>Business:</span>{" "}
//                     {data.business_name || "None"}
//                   </p>


//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* BUSINESS PROFILE SECTION */}
//           <section className="card courses-card">
//             <div className="course-timeline">

//               <div className="course-item completed">
//                 <div className="status-dot"></div>
//                 <div className="course-content">
//                   <h4>Account Status</h4>
//                   <span className="lesson-count">
//                     Total Views: {data.views || 0}
//                   </span>
//                 </div>
//                 <div className="status-badge green">Active</div>
//               </div>

//               <div className="course-item">
//                 <div className="status-dot"></div>
//                 <div className="course-content">

//                   <h4>Business Profile</h4>

//                   <h5 className="sub-heading">Description</h5>
//                   <p>{data.description || "No description provided yet."}</p>

//                   <h5 className="sub-heading">Products</h5>

//                   {productList.length > 0 ? (
//                     <ul className="product-list">
//                       {productList.map((item, index) => (
//                         <li key={index}>{item}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No products listed.</p>
//                   )}
//                 </div>

//                 <div className="status-badge purple">Updated</div>
//               </div>
//             </div>
//           </section>
//         </div>



//         {/* SIDEBAR */}
//         <div className={`grid-sidebar ${data.is_prime ? "prime-gold" : ""}`}>
//           <section className="card premium-promo">
//             <h3>Success Premium</h3>

//             <ul className="premium-list">
//               <li>Exclusive Prime Badge</li>
//               <li>Priority in Search Results</li>
//               <li>Unlimited Product Images</li>
//               <li>24/7 Support</li>
//             </ul>

//             <button className="subscribe-btn" disabled={data.is_prime}>
//               {data.is_prime ? "Subscribed" : "Upgrade Now"}
//             </button>
//           </section>


//           {/* MAP SECTION */}
//           <section className="card map-card">
//             <h4>Location Map</h4>

//             {data.address ? (
//               <div className="map-wrapper">
//                 <iframe
//                   title="Business Location"
//                   src={`https://www.google.com/maps?q=${encodeURIComponent(
//                     `${data.address}, ${data.city || ""}, ${data.pincode || ""}`
//                   )}&output=embed`}
//                   loading="lazy"
//                   allowFullScreen
//                 ></iframe>
//               </div>
//             ) : (
//               <p>No address available to display map.</p>
//             )}
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useState } from "react";
import useProfileController from "../controller/useProfileController";
import "../css/profile.css";

export default function ProfilePage() {

  const {
    form,
    handleChange,
    saveProfile,
    loading,
    isBusiness,
    setIsBusiness,
  } = useProfileController();

  const [editMode, setEditMode] = useState(false);

  if (loading) {
    return (
      <div className="pxr-load-wrap">
        <div className="spinner-border text-primary"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="pxr-container container">

      <div className="pxr-header shadow-sm">

        <div className="pxr-banner"></div>

        <div className="pxr-header-body">

          <div className="pxr-avatar">
            {form.person_name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="pxr-user-info">
            <h3>
              {form.person_prefix} {form.person_name || "User"}
            </h3>

            <p>
              {isBusiness
                ? form.business_name || "Business Owner"
                : form.keywords || "No profession added"}
            </p>

            <span>
              {form.city || "Location"} {form.pincode && `(${form.pincode})`}
            </span>
          </div>

          {!editMode && (
            <button
              className="pxr-edit-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {!editMode ? (
        <div className="row pxr-main-wrap">

          <div className="col-lg-8">

            <div className="pxr-card shadow-sm">
              <h5>Personal Information</h5>

              <div className="pxr-grid">

                <div>
                  <label>Full Name</label>
                  <p>{form.person_prefix} {form.person_name || "-"}</p>
                </div>

                <div>
                  <label>{isBusiness ? "Business Name" : "Profession"}</label>
                  <p>{isBusiness ? form.business_name : form.keywords || "-"}</p>
                </div>

                <div>
                  <label>City</label>
                  <p>{form.city || "-"}</p>
                </div>

                <div>
                  <label>Mobile</label>
                  <p>{form.mobile_number || "Not added"}</p>
                </div>

              </div>
            </div>

            {isBusiness && (
              <div className="pxr-card shadow-sm">
                <h5>Business Description</h5>

                <p className="pxr-desc">
                  {form.description || "No description added."}
                </p>
              </div>
            )}
          </div>

          <div className="col-lg-4">

            <div className="pxr-card shadow-sm pxr-strength">

              <h6>Profile Strength</h6>

              <div className="pxr-progress">
                <div
                  className="pxr-progress-bar"
                  style={{ width: "75%" }}
                ></div>
              </div>

              <p className="pxr-strength-text">
                75% Complete
              </p>

              <small>
                Add description and profile photo to improve ranking.
              </small>

            </div>

          </div>
        </div>

      ) : (

        <div className="pxr-card shadow-sm pxr-edit-wrap">

          <div className="pxr-edit-title">Edit Profile</div>

          <div className="pxr-type-toggle">

            <button
              className={!isBusiness ? "active" : ""}
              onClick={() => setIsBusiness(false)}
            >
              Individual
            </button>

            <button
              className={isBusiness ? "active" : ""}
              onClick={() => setIsBusiness(true)}
            >
              Business
            </button>

          </div>

          <div className="row">

            <div className="col-md-3">
              <label>Prefix</label>
              <input
                className="form-control"
                name="person_prefix"
                value={form.person_prefix || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-9">
              <label>Full Name</label>
              <input
                className="form-control"
                name="person_name"
                value={form.person_name || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>{isBusiness ? "Business Name" : "Profession"}</label>
              <input
                className="form-control"
                name={isBusiness ? "business_name" : "keywords"}
                value={isBusiness ? form.business_name || "" : form.keywords || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label>City</label>
              <input
                className="form-control"
                name="city"
                value={form.city || ""}
                onChange={handleChange}
              />
            </div>

            {isBusiness && (
              <div className="col-12">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="pxr-actions">

            <button
              className="btn btn-success"
              onClick={async () => {
                await saveProfile();
                setEditMode(false);
              }}
            >
              Save
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>

          </div>

        </div>
      )}
    </div>
  );
}