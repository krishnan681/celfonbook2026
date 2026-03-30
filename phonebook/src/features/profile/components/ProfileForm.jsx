// import { useState, useEffect } from "react";

// export default function ProfileForm({
//   profile,
//   isBusinessTab,
//   setIsBusinessTab,
//   keywords,
//   setKeywords,
//   saveProfile,
//   uploadProfileImage,
//   uploadProductImage
// }) {

//   const [form, setForm] = useState({});

//   useEffect(() => {
//     if (profile) setForm(profile);
//   }, [profile]);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const addKeyword = (value) => {

//     if (!value) return;

//     if (!keywords.includes(value)) {
//       setKeywords([...keywords, value]);
//     }
//   };

//   const removeKeyword = (k) => {
//     setKeywords(keywords.filter(x => x !== k));
//   };

//   const handleSubmit = () => {

//     const payload = {
//       ...form,
//       keywords: keywords.join(", ")
//     };

//     saveProfile(payload, isBusinessTab);
//   };

//   const copyMobile = () => {
//     navigator.clipboard.writeText(form.mobileNumber || "");
//     alert("Mobile copied");
//   };

//   return (
//     <div className="card p-4">

//       <div className="text-center mb-4">

//         <img
//           src={form.profileImage || "/default-avatar.png"}
//           alt=""
//           width="120"
//           height="120"
//           style={{borderRadius:"50%",objectFit:"cover"}}
//         />

//         <div className="mt-2">
//           <input
//             type="file"
//             onChange={(e)=>uploadProfileImage(e.target.files[0])}
//           />
//         </div>

//       </div>

//       <div className="d-flex mb-4">

//         <button
//           className={`btn me-2 ${!isBusinessTab ? "btn-primary":"btn-outline-primary"}`}
//           onClick={()=>setIsBusinessTab(false)}
//         >
//           Individual
//         </button>

//         <button
//           className={`btn ${isBusinessTab ? "btn-primary":"btn-outline-primary"}`}
//           onClick={()=>setIsBusinessTab(true)}
//         >
//           Business
//         </button>

//       </div>

//       {!isBusinessTab && (

//         <>

//           <input
//             className="form-control mb-2"
//             name="personPrefix"
//             placeholder="Prefix"
//             value={form.personPrefix || ""}
//             onChange={handleChange}
//           />

//           <input
//             className="form-control mb-2"
//             name="personName"
//             placeholder="Person Name"
//             value={form.personName || ""}
//             onChange={handleChange}
//           />

//           <input
//             className="form-control mb-2"
//             name="profession"
//             placeholder="Profession"
//             value={form.profession || ""}
//             onChange={handleChange}
//           />

//           <textarea
//             className="form-control mb-2"
//             name="address"
//             placeholder="Address"
//             value={form.address || ""}
//             onChange={handleChange}
//           />

//         </>

//       )}

//       {isBusinessTab && (

//         <>

//           <input
//             className="form-control mb-2"
//             name="personName"
//             placeholder="Person Name"
//             value={form.personName || ""}
//             onChange={handleChange}
//           />

//           <input
//             className="form-control mb-2"
//             name="businessName"
//             placeholder="Business Name"
//             value={form.businessName || ""}
//             onChange={handleChange}
//           />

//           <textarea
//             className="form-control mb-2"
//             name="description"
//             placeholder="Description"
//             value={form.description || ""}
//             onChange={handleChange}
//           />

//           <div className="mb-3">

//             <input
//               className="form-control"
//               placeholder="Add Product / Service"
//               onKeyDown={(e)=>{
//                 if(e.key==="Enter"){
//                   e.preventDefault();
//                   addKeyword(e.target.value);
//                   e.target.value="";
//                 }
//               }}
//             />

//             <div className="mt-2">

//               {keywords.map(k => (
//                 <span
//                   key={k}
//                   className="badge bg-primary me-2"
//                   style={{cursor:"pointer"}}
//                   onClick={()=>removeKeyword(k)}
//                 >
//                   {k} ✕
//                 </span>
//               ))}

//             </div>

//           </div>

//         </>

//       )}

//       <input
//         className="form-control mb-2"
//         value={form.mobileNumber || ""}
//         readOnly
//       />

//       <button
//         className="btn btn-sm btn-outline-secondary mb-3"
//         onClick={copyMobile}
//       >
//         Copy Mobile
//       </button>

//       <input
//         className="form-control mb-2"
//         name="whatsApp"
//         placeholder="WhatsApp"
//         value={form.whatsApp || ""}
//         onChange={handleChange}
//       />

//       <input
//         className="form-control mb-2"
//         name="email"
//         placeholder="Email"
//         value={form.email || ""}
//         onChange={handleChange}
//       />

//       <input
//         className="form-control mb-2"
//         name="city"
//         placeholder="City"
//         value={form.city || ""}
//         onChange={handleChange}
//       />

//       <input
//         className="form-control mb-3"
//         name="pincode"
//         placeholder="Pincode"
//         value={form.pincode || ""}
//         onChange={handleChange}
//       />

//       {isBusinessTab && (

//         <>

//           <input
//             className="form-control mb-2"
//             name="webSite"
//             placeholder="Website"
//             value={form.webSite || ""}
//             onChange={handleChange}
//           />

//           <input
//             className="form-control mb-2"
//             name="promoCode"
//             placeholder="Promo Code"
//             value={form.promoCode || ""}
//             onChange={handleChange}
//           />

//           <div className="mb-3">

//             <input
//               type="file"
//               onChange={(e)=>uploadProductImage(e.target.files[0])}
//             />

//           </div>

//         </>

//       )}

//       <button
//         className="btn btn-success w-100"
//         onClick={handleSubmit}
//       >
//         Save Details
//       </button>

//     </div>
//   );
// }




import { useState, useEffect } from "react";
import "../css/profile.css";

export default function ProfileForm({
  profile,
  isBusiness,
  setIsBusiness,
  saveProfile,
  uploadProfileImage
}) {

  const [form, setForm] = useState(profile || {});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setForm(profile || {});
  }, [profile]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    saveProfile(form);
    setEditMode(false);
  }

  function handleCancel() {
    setForm(profile);
    setEditMode(false);
  }

  function handleImage(e) {
    if (!editMode) return;
    const file = e.target.files[0];
    if (file) uploadProfileImage(file);
  }

  return (
    <div className="profile-container">

      {/* HEADER */}

      <div className="profile-header">

        <img
          src={profile?.profile_image || "/vite.svg"}
          className="profile-avatar"
        />

        {editMode && (
          <input type="file" onChange={handleImage} />
        )}

        <h2>{profile?.person_name || "Your Name"}</h2>
        <p>{profile?.mobile_number}</p>

        {!editMode && (
          <button
            className="edit-btn"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}

      </div>

      {/* TABS */}

      <div className="profile-tabs">

        <button
          className={!isBusiness ? "active" : ""}
          disabled={!editMode}
          onClick={() => setIsBusiness(false)}
        >
          Individual
        </button>

        <button
          className={isBusiness ? "active" : ""}
          disabled={!editMode}
          onClick={() => setIsBusiness(true)}
        >
          Business
        </button>

      </div>

      {/* FORM */}

      <form onSubmit={handleSubmit} className="profile-form">

        {!isBusiness && (
          <>
            <input
              name="person_name"
              placeholder="Person Name"
              value={form.person_name || ""}
              onChange={handleChange}
              disabled={!editMode}
            />

            <input
              name="keywords"
              placeholder="Profession"
              value={form.keywords || ""}
              onChange={handleChange}
              disabled={!editMode}
            />

            <input
              name="city"
              placeholder="City"
              value={form.city || ""}
              onChange={handleChange}
              disabled={!editMode}
            />

            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </>
        )}

        {isBusiness && (
          <>
            <input
              name="person_name"
              placeholder="Owner Name"
              value={form.person_name || ""}
              onChange={handleChange}
              disabled={!editMode}
            />

            <input
              name="business_name"
              placeholder="Business Name"
              value={form.business_name || ""}
              onChange={handleChange}
              disabled={!editMode}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description || ""}
              onChange={handleChange}
              disabled={!editMode}
            />

            <input
              name="web_site"
              placeholder="Website"
              value={form.web_site || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </>
        )}

        {editMode && (
          <div className="profile-buttons">

            <button type="submit" className="save-btn">
              Save
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </div>
        )}

      </form>

    </div>
  );
}