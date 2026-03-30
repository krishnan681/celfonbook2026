// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getMyProfile, getSignUpProfile, upsertProfile } from "../../../core/services/profileService";

// const EditProfilePage = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     person_name: "",
//     mobile_number: "",
//     city: "",
//     business_name: "",
//     user_type: "person",
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         // Prefer already saved full profile
//         let data = await getMyProfile();

//         // If not found → use signup profile as defaults
//         if (!data) {
//           data = await getSignUpProfile();
//           if (data) {
//             setForm(prev => ({
//               ...prev,
//               person_name: data.full_name || "",
//               mobile_number: data.phone || "",
//               city: data.city || "",
//               business_name: data.business_name || "",
//             }));
//           }
//         } else {
//           setForm(data);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await upsertProfile(form);
//       alert("Profile saved!");
//       navigate("/profile");
//     } catch (err) {
//       console.error(err);
//       alert("Error saving profile: " + (err.message || "Unknown error"));
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div style={{ padding: "40px", maxWidth: "600px" }}>
//       <h2>{form.id ? "Edit Profile" : "Complete Your Profile"}</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: "16px" }}>
//           <label>Full Name</label><br/>
//           <input name="person_name" value={form.person_name || ""} onChange={handleChange} />
//         </div>

//         <div style={{ marginBottom: "16px" }}>
//           <label>Phone / Mobile</label><br/>
//           <input name="mobile_number" value={form.mobile_number || ""} onChange={handleChange} />
//         </div>

//         <div style={{ marginBottom: "16px" }}>
//           <label>City</label><br/>
//           <input name="city" value={form.city || ""} onChange={handleChange} />
//         </div>

//         <div style={{ marginBottom: "16px" }}>
//           <label>Business Name (optional)</label><br/>
//           <input name="business_name" value={form.business_name || ""} onChange={handleChange} />
//         </div>

//         <button type="submit" style={{ padding: "10px 24px" }}>
//           Save Profile
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProfilePage;


// EditProfilePage.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getMyProfile, getSignUpProfile, upsertProfile } from "../../../core/services/profileService";
// import Toast from "../../../components/common/Toast";
// import "../css/profile.css";

// const EditProfilePage = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);

//   const [form, setForm] = useState({
//     person_name: "",
//     person_prefix: "Mr.",
//     mobile_number: "",
//     email: "",
//     city: "",
//     pincode: "",
//     address: "",
//     user_type: "person",
//     business_name: "",
//     business_prefix: "M/s.",
//     description: "",
//     keywords: "",
//     whats_app: "",
//     web_site: "",
//     landline: "",
//     landline_code: "",
//     promo_code: "",
//     is_prime: false,
//     is_business: false
//   });

//   useEffect(() => {
//     const init = async () => {
//       try {
//         setLoading(true);

//         // 1️⃣ Get real profile first
//         const profileData = await getMyProfile();

//         if (profileData) {
//           // ✅ REAL DATA
//           setForm(prev => ({
//             ...prev,
//             ...profileData
//           }));
//         } else {
//           // 2️⃣ If no profile, fallback to signup table
//           const signupData = await getSignUpProfile();

//           if (signupData) {
//             setForm(prev => ({
//               ...prev,
//               person_name: signupData.full_name || "",
//               business_name: signupData.business_name || "",
//               mobile_number: signupData.phone || "",
//               city: signupData.city || ""
//             }));
//           }
//         }
//       } catch (err) {
//         setToast({ message: "Failed to load profile", type: "error" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await upsertProfile(form);
//       setToast({ message: "Profile updated successfully!", type: "success" });
//       setTimeout(() => navigate("/profile"), 1500);
//     } catch (err) {
//       setToast({ message: err.message, type: "error" });
//     }
//   };

//   if (loading) return <div className="loader-screen">Loading Form...</div>;

//   return (
//     <div className="profile-edit-container">
//       {toast && <Toast {...toast} onClose={() => setToast(null)} />}

//       <div className="form-card">
//         <h2>Account Settings</h2>

//         <form onSubmit={handleSubmit} className="edit-grid">

//           <div className="form-section">
//             <h3>Personal Information</h3>

//             <div className="input-group">
//               <label>Full Name</label>
//               <input
//                 name="person_name"
//                 value={form.person_name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label>Mobile Number</label>
//               <input
//                 name="mobile_number"
//                 value={form.mobile_number}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="form-section">
//             <h3>Business & Location</h3>

//             <div className="input-group">
//               <label>Business Name</label>
//               <input
//                 name="business_name"
//                 value={form.business_name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="input-group">
//               <label>City</label>
//               <input
//                 name="city"
//                 value={form.city}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="input-group">
//               <label>Pincode</label>
//               <input
//                 name="pincode"
//                 value={form.pincode}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="input-group full-width">
//               <label>Address</label>
//               <textarea
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="form-section full-width">
//             <h3>Profile Details</h3>

//             <div className="input-group full-width">
//               <label>Description</label>
//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="input-group full-width">
//               <label>Keywords</label>
//               <input
//                 name="keywords"
//                 value={form.keywords}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="form-actions">
//             <button
//               type="button"
//               className="btn-cancel"
//               onClick={() => navigate("/profile")}
//             >
//               Cancel
//             </button>

//             <button type="submit" className="btn-save">
//               Update Profile
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProfilePage;


// import React, { useEffect, useState } from "react";
// import { supabase } from "../../../core/config/supabaseClient";
// import { useNavigate } from "react-router-dom";
// import "../css/EditProfilePage.css";

// const EditProfilePage = () => {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [profileId, setProfileId] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");

//   const [form, setForm] = useState({
//     mobile_number: "",
//     person_name: "",
//     person_prefix: "",
//     business_name: "",
//     business_prefix: "M/s.",
//     keywords: "",
//     description: "",
//     city: "",
//     pincode: "",
//     email: "",
//     landline: "",
//     landline_code: "",
//     promo_code: "",
//     profile_image: "",
//     whats_app: "",
//     web_site: "",
//     product_images: "",
//     address: "",
//   });

//   useEffect(() => {
//     const loadProfile = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) return;

//       const userId = session.user.id;

//       const { data } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("auth_id", userId)
//         .maybeSingle();

//       if (data) {
//         setProfileId(data.id);
//         setForm({
//           mobile_number: data.mobile_number || "",
//           person_name: data.person_name || "",
//           person_prefix: data.person_prefix || "",
//           business_name: data.business_name || "",
//           business_prefix: data.business_prefix || "M/s.",
//           keywords: data.keywords || "",
//           description: data.description || "",
//           city: data.city || "",
//           pincode: data.pincode || "",
//           email: data.email || "",
//           landline: data.landline || "",
//           landline_code: data.landline_code || "",
//           promo_code: data.promo_code || "",
//           profile_image: data.profile_image || "",
//           whats_app: data.whats_app || "",
//           web_site: data.web_site || "",
//           product_images: data.product_images || "",
//           address: data.address || "",
//         });
//       }

//       setLoading(false);
//     };

//     loadProfile();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     const { data: { session } } = await supabase.auth.getSession();
//     if (!session) return;

//     const payload = {
//       ...form,
//       updated_at: new Date().toISOString(),
//     };

//     if (profileId) {
//       await supabase
//         .from("profiles")
//         .update(payload)
//         .eq("id", profileId);
//     }

//     setSaving(false);
//     navigate("/profile");
//   };

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="edit-container">
//       <h2>Edit Profile</h2>

//       {errorMsg && <p className="error">{errorMsg}</p>}

//       <form onSubmit={handleSave}>

//         {/* Contact Section */}
//         <div className="section">
//           <h3>Contact Information</h3>

//           <div className="grid">
//             <input name="mobile_number" value={form.mobile_number} disabled />
//             {/* <input name="whats_app" placeholder="WhatsApp" value={form.whats_app} onChange={handleChange} /> */}
//             <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
//             <input name="web_site" placeholder="Website" value={form.web_site} onChange={handleChange} />
//           </div>
//         </div>

//         {/* Personal Section */}
//         <div className="section">
//           <h3>Personal Details</h3>

//           <div className="grid">
//             <input name="person_prefix" placeholder="Prefix (Mr/Mrs)" value={form.person_prefix} onChange={handleChange} />
//             <input name="person_name" placeholder="Full Name" value={form.person_name} onChange={handleChange} />
//           </div>
//         </div>

//         {/* Business Section */}
//         <div className="section">
//           <h3>Business Details</h3>

//           <div className="grid">
//             <input name="business_prefix" placeholder="Business Prefix" value={form.business_prefix} onChange={handleChange} />
//             <input name="business_name" placeholder="Business Name" value={form.business_name} onChange={handleChange} />
//             <input name="keywords" placeholder="Keywords (comma separated)" value={form.keywords} onChange={handleChange} />
//             <textarea name="description" placeholder="Business Description" value={form.description} onChange={handleChange} />
//           </div>
//         </div>

//         {/* Address Section */}
//         <div className="section">
//           <h3>Address</h3>

//           <div className="grid">
//             <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} />
//             <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
//             <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
//           </div>
//         </div>

//         {/* Landline */}
//         <div className="section">
//           <h3>Landline</h3>

//           <div className="grid">
//             <input name="landline_code" placeholder="STD Code" value={form.landline_code} onChange={handleChange} />
//             <input name="landline" placeholder="Landline Number" value={form.landline} onChange={handleChange} />
//           </div>
//         </div>

         

         

//         <button className="save-btn" disabled={saving}>
//           {saving ? "Saving..." : "Save Changes"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProfilePage;







import useProfileController from "../controller/useProfileController";
import ProfileForm from "../components/ProfileForm";

export default function EditProfilePage() {

  const {
    profile,
    loading,
    isBusiness,
    setIsBusiness,
    saveProfile,
    uploadProfileImage
  } = useProfileController();

  if (loading) return <div>Loading...</div>;

  return (
    <ProfileForm
      profile={profile}
      isBusiness={isBusiness}
      setIsBusiness={setIsBusiness}
      saveProfile={saveProfile}
      uploadProfileImage={uploadProfileImage}
    />
  );
}