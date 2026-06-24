// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../css/PartnerForm.css";

// const PartnerForm = ({
//   profileType,
//   formData,
//   mobileExists,
//   handleChange,
//   handleSubmit,
//   setProfileType,
// }) => {
//   return (
//     <div className="form-page-bg">
//       <div className="container py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-10 col-xl-8">
//             <div className="form-card shadow-sm">
//               <div className="form-header d-flex align-items-center justify-content-between">
//                 <button
//                   type="button"
//                   className="btn-back-link"
//                   onClick={() => setProfileType(null)}
//                 >
//                   ← Back to Selection
//                 </button>
//                 <span className="badge-type">
//                   {profileType === "business"
//                     ? "Business Profile"
//                     : "Personal Profile"}
//                 </span>
//               </div>

//               <div className="p-4 p-md-5">
//                 <h2 className="form-main-title mb-2">Registration</h2>
//                 <p className="text-muted mb-4">
//                   Please fill in the details below to continue.
//                 </p>

//                 <form onSubmit={handleSubmit}>
//                   <div className="row g-4 align-items-end">
//                     {" "}
//                     {/* align-items-end keeps labels and inputs synced */}
//                     {/* Primary Contact */}
//                     <div className="col-md-6">
//                       <label className="form-label">Mobile Number *</label>
//                       <input
//                         name="mobile_number"
//                         className={`form-control ${mobileExists ? "is-invalid" : ""}`}
//                         placeholder="Enter mobile"
//                         value={formData.mobile_number || ""}
//                         onChange={handleChange}
//                         required
//                       />
//                       {mobileExists && (
//                         <div className="invalid-feedback">
//                           Mobile already exists.
//                         </div>
//                       )}
//                     </div>
//                     {existingName && formData.mobile_number?.length === 10 && (
//                       <div className="text-danger fw-bold mt-2">
//                         ⚠ Already Exist Name:
//                         {existingName}
//                       </div>
//                     )}
//                     <div className="form-check form-switch">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         checked={generateOtp}
//                         onChange={(e) => setGenerateOtp(e.target.checked)}
//                       />

//                       <label className="form-check-label">Generate OTP</label>
//                     </div>
//                     <button
//                       type={generateOtp ? "button" : "submit"}
//                       onClick={generateOtp ? sendOtp : undefined}
//                       className="btn btn-submit-primary px-5 py-2"
//                     >
//                       {loading
//                         ? "Loading..."
//                         : generateOtp
//                           ? "Send OTP"
//                           : "Submit Details"}
//                     </button>
//                     <div className="col-md-6">
//                       <label className="form-label">Email Address</label>
//                       <input
//                         type="email"
//                         name="email"
//                         className="form-control"
//                         placeholder="email@example.com"
//                         value={formData.email || ""}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     {/* Conditional Person Fields */}
//                     {profileType === "person" && (
//                       <>
//                         <div className="col-md-8">
//                           <label className="form-label">Full Name *</label>
//                           <input
//                             name="person_name"
//                             className="form-control"
//                             value={formData.person_name || ""}
//                             onChange={handleChange}
//                             required
//                           />
//                         </div>
//                         <div className="col-md-4">
//                           <label className="form-label">Prefix *</label>
//                           <select
//                             name="person_prefix"
//                             className="form-select"
//                             value={formData.person_prefix || ""}
//                             onChange={handleChange}
//                             required
//                           >
//                             <option value="">Select...</option>
//                             <option value="Mr.">Mr.</option>
//                             <option value="Ms.">Ms.</option>
//                           </select>
//                         </div>
//                       </>
//                     )}
//                     {/* Conditional Business Fields */}
//                     {profileType === "business" && (
//                       <>
//                         <div className="col-md-8">
//                           <label className="form-label">Business Name *</label>
//                           <input
//                             name="business_name"
//                             className="form-control"
//                             value={formData.business_name || ""}
//                             onChange={handleChange}
//                             required
//                           />
//                         </div>
//                         <div className="col-md-4">
//                           <label className="form-label">Business Prefix</label>
//                           <input
//                             name="business_prefix"
//                             className="form-control"
//                             placeholder="e.g. Pvt Ltd"
//                             value={formData.business_prefix || ""}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         <div className="col-12">
//                           <label className="form-label">
//                             Business Address *
//                           </label>
//                           <input
//                             name="bussiness_address"
//                             className="form-control"
//                             value={formData.bussiness_address || ""}
//                             onChange={handleChange}
//                             required
//                           />
//                         </div>
//                         <div className="col-md-12">
//                           <label className="form-label">
//                             Keywords & Description
//                           </label>
//                           <div className="input-group">
//                             <input
//                               name="keywords"
//                               className="form-control w-25"
//                               placeholder="Keywords..."
//                               value={formData.keywords || ""}
//                               onChange={handleChange}
//                             />
//                             <input
//                               name="description"
//                               className="form-control w-75"
//                               placeholder="Brief description..."
//                               value={formData.description || ""}
//                               onChange={handleChange}
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-12">
//                           <label className="form-label">Profile Image</label>

//                           <input
//                             type="file"
//                             className="form-control"
//                             accept="image/*"
//                             onChange={(e) =>
//                               setSelectedImage(e.target.files[0])
//                             }
//                           />
//                         </div>
//                       </>
//                     )}
//                     {profileType === "person" && (
//                       <div className="col-md-12">
//                         <label className="form-label">
//                           Residential Address *
//                         </label>
//                         <input
//                           name="address"
//                           className="form-control"
//                           value={formData.address || ""}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                     )}
//                     <div className="col-md-4">
//                       <label className="form-label">City *</label>
//                       <input
//                         name="city"
//                         className="form-control"
//                         value={formData.city || ""}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div className="col-md-4">
//                       <label className="form-label">Pincode *</label>
//                       <input
//                         name="pincode"
//                         className="form-control"
//                         value={formData.pincode || ""}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div className="col-md-4">
//                       <label className="form-label">Promo Code</label>
//                       <input
//                         name="promo_code"
//                         className="form-control"
//                         placeholder="Optional"
//                         value={formData.promo_code || ""}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     {/* Landline Row */}
//                     <div className="col-md-4">
//                       <label className="form-label">Landline Code</label>
//                       <input
//                         name="landline_code"
//                         className="form-control"
//                         value={formData.landline_code || ""}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="col-md-8">
//                       <label className="form-label">Landline Number</label>
//                       <input
//                         name="landline"
//                         className="form-control"
//                         value={formData.landline || ""}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <button
//                       type="submit"
//                       className="btn btn-submit-primary px-5 py-2"
//                     >
//                       Submit Details
//                     </button>
//                   </div>

//                   <div className="form-footer mt-5 border-top pt-4">
//                     <p className="terms-notice mt-3">
//                       By submitting, you agree to the{" "}
//                       <strong>celfon book 2026</strong> terms of service and
//                       privacy policy. Your data is encrypted and handled
//                       securely.
//                     </p>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PartnerForm;

// new 30-5-26
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/PartnerForm.css";

const PartnerForm = ({
  profileType,
  formData,
  mobileExists,
  existingName,
  handleChange,
  handleSubmit,
  setProfileType,

  // OTP Related
  useOtp,
  setUseOtp,
  loading,
  sendOtp,

  setSelectedImage,

  // OTP Page Props
  showOtpPage,
  enteredOtp,
  setEnteredOtp,
  verifyOtp,
  setShowOtpPage,
}) => {
  if (showOtpPage) {
    return (
      <div className="container py-5">
        <div className="card p-4">
          <h3>OTP Verification</h3>
          <input
            type="text"
            maxLength="4"
            className="form-control mt-3"
            placeholder="Enter OTP"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
          />
          <button className="btn btn-primary mt-3" onClick={verifyOtp}>
            Verify OTP
          </button>
          <button
            className="btn btn-secondary mt-2"
            onClick={() => setShowOtpPage(false)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page-bg">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="form-card shadow-sm">
              {/* HEADER */}
              <div className="form-header d-flex align-items-center justify-content-between">
                <button
                  type="button"
                  className="btn-back-link"
                  onClick={() => setProfileType(null)}
                >
                  ← Back to Selection
                </button>
                <span className="badge-type">
                  {profileType === "business" ? "Business Profile" : "Personal Profile"}
                </span>
              </div>

              {/* BODY */}
              <div className="p-4 p-md-5">
                <h2 className="form-main-title mb-2">Registration</h2>
                <p className="text-muted mb-4">
                  Please fill in the details below to continue.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="row g-4 align-items-end">
                    {/* MOBILE */}
                    <div className="col-md-6">
                      <label className="form-label">Mobile Number *</label>
                      <input
                        type="text"
                        name="mobile_number"
                        className={`form-control ${mobileExists ? "is-invalid" : ""}`}
                        placeholder="Enter mobile"
                        value={formData.mobile_number || ""}
                        onChange={handleChange}
                        required
                      />
                      {mobileExists && (
                        <div className="invalid-feedback">Mobile already exists.</div>
                      )}
                      {existingName && formData.mobile_number?.length === 10 && (
                        <div className="text-danger fw-bold mt-2">
                          ⚠ Already Exists: {existingName}
                        </div>
                      )}
                    </div>

                    {/* EMAIL */}
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="email@example.com"
                        value={formData.email || ""}
                        onChange={handleChange}
                      />
                    </div>

                    {/* OTP TOGGLE */}
                    <div className="col-md-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={useOtp}
                          onChange={(e) => setUseOtp(e.target.checked)}
                        />
                        <label className="form-check-label">Generate OTP for Verification</label>
                      </div>
                    </div>

                    {/* PERSON FIELDS */}
                    {profileType === "person" && (
                      <>
                        <div className="col-md-8">
                          <label className="form-label">Full Name *</label>
                          <input
                            name="person_name"
                            className="form-control"
                            value={formData.person_name || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Prefix *</label>
                          <select
                            name="person_prefix"
                            className="form-select"
                            value={formData.person_prefix || ""}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select...</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Ms.">Ms.</option>
                          </select>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Residential Address *</label>
                          <input
                            name="address"
                            className="form-control"
                            value={formData.address || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </>
                    )}

                    {/* BUSINESS FIELDS */}
                    {profileType === "business" && (
                      <>
                        <div className="col-md-8">
                          <label className="form-label">Business Name *</label>
                          <input
                            name="business_name"
                            className="form-control"
                            value={formData.business_name || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Business Prefix</label>
                          <input
                            name="business_prefix"
                            className="form-control"
                            placeholder="e.g. Pvt Ltd"
                            value={formData.business_prefix || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Business Address *</label>
                          <input
                            name="address"        // ← Must match controller & DB
                            className="form-control"
                            value={formData.address || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Keywords & Description</label>
                          <div className="input-group">
                            <input
                              name="keywords"
                              className="form-control w-25"
                              placeholder="Keywords..."
                              value={formData.keywords || ""}
                              onChange={handleChange}
                            />
                            <input
                              name="description"
                              className="form-control w-75"
                              placeholder="Brief description..."
                              value={formData.description || ""}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Profile Image</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setSelectedImage(e.target.files[0])}
                          />
                        </div>
                      </>
                    )}

                    {/* COMMON FIELDS */}
                    <div className="col-md-4">
                      <label className="form-label">City *</label>
                      <input
                        name="city"
                        className="form-control"
                        value={formData.city || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Pincode *</label>
                      <input
                        name="pincode"
                        className="form-control"
                        value={formData.pincode || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Promo Code</label>
                      <input
                        name="promo_code"
                        className="form-control"
                        placeholder="Optional"
                        value={formData.promo_code || ""}
                        onChange={handleChange}
                      />
                    </div>

                    {/* LANDLINE */}
                    <div className="col-md-4">
                      <label className="form-label">Landline Code</label>
                      <input
                        name="landline_code"
                        className="form-control"
                        value={formData.landline_code || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Landline Number</label>
                      <input
                        name="landline"
                        className="form-control"
                        value={formData.landline || ""}
                        onChange={handleChange}
                      />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="col-md-12 mt-3">
                      <button
                        type={useOtp ? "button" : "submit"}
                        onClick={useOtp ? sendOtp : undefined}
                        className="btn btn-submit-primary px-5 py-2"
                        disabled={loading}
                      >
                        {loading
                          ? "Loading..."
                          : useOtp
                          ? "Send OTP"
                          : "Submit Details"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerForm;