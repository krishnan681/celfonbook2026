// import { useSignupController } from "../controller/useSignupController";
// import InputField from "../components/InputField";
// import NetworkErrorView from "../components/NetworkErrorView";
// import "../Pages/css/signup.css";

// const SignupPage = () => {
//   const {
//     form,
//     handleChange,
//     signup,
//     loading,
//     error,
//     networkError,
//     setNetworkError,
//     validateIndianMobile,
//   } = useSignupController();

//   if (networkError) {
//     return <NetworkErrorView onRetry={signup} />;
//   }

//   return (
//     <div className="signup-page">

//       <div className="signup-header">
//         <h2>Create Account</h2>
//       </div>

//       <div className="signup-form">

//         {/* USER TYPE */}
//         <div className="toggle-group">
//           <button
//             className={!form.isBusiness ? "active" : ""}
//             onClick={() => handleChange("isBusiness", false)}
//           >
//             Person
//           </button>
//           <button
//             className={form.isBusiness ? "active" : ""}
//             onClick={() => handleChange("isBusiness", true)}
//           >
//             Business
//           </button>
//         </div>

//         <InputField
//           placeholder="Full Name"
//           value={form.fullName}
//           onChange={(v) => handleChange("fullName", v)}
//         />

//         <InputField
//           placeholder="Mobile Number"
//           value={form.phone}
//           onChange={(v) => handleChange("phone", v)}
//         />

//         {form.isMobile &&
//           form.phone &&
//           validateIndianMobile(form.phone) && (
//             <span className="valid-indicator">✓ Valid Mobile</span>
//           )}

//         <InputField
//           placeholder="City"
//           value={form.city}
//           onChange={(v) => handleChange("city", v)}
//         />

//         {form.isBusiness && (
//           <>
//             <InputField
//               placeholder="Business Name"
//               value={form.businessName}
//               onChange={(v) => handleChange("businessName", v)}
//             />

//             <InputField
//               placeholder="Business Category"
//               value={form.businessCategory}
//               onChange={(v) => handleChange("businessCategory", v)}
//             />
//           </>
//         )}

//         <InputField
//           placeholder="Set Password"
//           type="password"
//           value={form.password}
//           onChange={(v) => handleChange("password", v)}
//         />

//         {form.password && form.password.length < 8 && (
//           <span className="error-text">
//             Password must be at least 8 characters
//           </span>
//         )}

//         {error && <div className="error-text">{error}</div>}

//         <button
//           className="signup-btn"
//           disabled={loading}
//           onClick={signup}
//         >
//           {loading ? "Processing..." : "Sign Up"}
//         </button>

//       </div>
//     </div>
//   );
// };

// export default SignupPage;

// import { useSignupController } from "../controller/useSignupController";
// import InputField from "../components/InputField";
// import NetworkErrorView from "../components/NetworkErrorView";
// import "../Pages/css/signup.css";

// const SignupPage = () => {
//   const {
//     form,
//     handleChange,
//     signup,
//     loading,
//     error,
//     networkError,
//     validateIndianMobile,
//   } = useSignupController();

//   if (networkError) {
//     return <NetworkErrorView onRetry={signup} />;
//   }

//   return (
//     <div className="auth-layout">
//       {/* LEFT PANEL */}
//       <div className="auth-left">
//         <div className="left-content">
//           <div className="brand-logo">Logo</div>

//           <h1 className="left-heading">
//             Your Business
//             <br />
//             starts here.
//           </h1>

//           <p className="left-subtext">
//             Join thousands of explorers and businesses building meaningful journeys together.
//           </p>
//         </div>

//         <div className="left-overlay"></div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="auth-right">
//         <div className="auth-card">
//           <div className="auth-header">
//             <h2>Create Account</h2>
//             <p>Let’s get you started</p>
//           </div>

//           {/* Toggle */}
//           <div className="role-toggle">
//             <button
//               type="button"
//               className={!form.isBusiness ? "active" : ""}
//               onClick={() => handleChange("isBusiness", false)}
//             >
//               Individual
//             </button>
//             <button
//               type="button"
//               className={form.isBusiness ? "active" : ""}
//               onClick={() => handleChange("isBusiness", true)}
//             >
//               Business
//             </button>
//           </div>

//           {/* Inputs */}
//           <InputField
//             label="Full Name"
//             value={form.fullName}
//             onChange={(v) => handleChange("fullName", v)}
//           />

//           <div className="phone-group">
//             <InputField
//               label="Mobile Number"
//               value={form.phone}
//               onChange={(v) => handleChange("phone", v)}
//             />
//             {form.phone && validateIndianMobile(form.phone) && (
//               <span className="valid-check">✓</span>
//             )}
//           </div>

//           <InputField
//             label="City"
//             value={form.city}
//             onChange={(v) => handleChange("city", v)}
//           />

//           {form.isBusiness && (
//             <div className="business-section">
//               <InputField
//                 label="Business Name"
//                 value={form.businessName}
//                 onChange={(v) => handleChange("businessName", v)}
//               />
//               <InputField
//                 label="Business Category"
//                 value={form.businessCategory}
//                 onChange={(v) =>
//                   handleChange("businessCategory", v)
//                 }
//               />
//             </div>
//           )}

//           <InputField
//             label="Password"
//             type="password"
//             value={form.password}
//             onChange={(v) => handleChange("password", v)}
//           />

//           {error && <div className="form-error">{error}</div>}

//           <button
//             className="submit-btn"
//             disabled={loading}
//             onClick={signup}
//           >
//             {loading ? "Creating..." : "Create Account"}
//           </button>

//           <div className="divider">
//             <span>or</span>
//           </div>
//           <button onClick={signup}>
//             <div>g</div>
//           </button>
//           <p className="auth-footer">
//             Already have an account?{" "}
//             <span className="link">Login</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import useSignupController from "../controller/useSignupController";
// import "../../auth/Pages/css/signup.css";

// // CORRECTED: Default import (no curly braces)
// import SignImg from '../../../assets/images/signupimage.png';

// export default function SignupPage() {
//   const navigate = useNavigate();

//   const {
//     phone,
//     setPhone,
//     name,
//     setName,
//     promo,
//     setPromo,
//     loading,
//     error,
//     signup,
//   } = useSignupController();

//   return (
//     <div className="auth-page">
//       {/* LEFT SIDE */}
//       <div className="auth-left">
//         <div className="auth-overlay">
//           <img
//             src={SignImg}
//             alt="signup illustration"
//             className="auth-image"
//           />
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="auth-right">
//         <div className="auth-card">
//           <div className="auth-header">
//             <h2>Create Account</h2>
//             <p className="subtitle">Join us today! It only takes a minute.</p>
//           </div>

//           <div className="auth-form">
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />

//             <input
//               type="text"
//               placeholder="Mobile Number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//             />

//             <input
//               type="text"
//               placeholder="Promo Code (Optional)"
//               value={promo}
//               onChange={(e) => setPromo(e.target.value)}
//             />

//             {error && <p className="auth-error">{error}</p>}

//             <button onClick={signup} disabled={loading}>
//               {loading ? "Creating account..." : "Sign Up"}
//             </button>
//           </div>

//           <p className="auth-switch">
//             Already have an account?{" "}
//             <span onClick={() => navigate("/login")}>Login</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import useSignupController from "../controller/useSignupController";
// import "../../auth/Pages/css/signup.css";

// export default function SignupPage() {
//   const navigate = useNavigate();

//   const {
//     phone,
//     setPhone,
//     name,
//     setName,
//     promo,
//     setPromo,
//     loading,
//     error,
//     signup,
//   } = useSignupController();

//   return (
//     <div className="auth-page modern-auth-page signup-page-wrap">
//       {/* LEFT SIDE */}
//       <div className="auth-left modern-left-panel signup-left-panel">
//         <div className="signup-image-slider">
//           <div className="slider-track">
//             <div className="slide-card">
//               <img
//                 src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
//                 alt="team"
//               />
//             </div>

//             <div className="slide-card">
//               <img
//                 src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop"
//                 alt="office"
//               />
//             </div>

//             <div className="slide-card">
//               <img
//                 src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
//                 alt="startup"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="video-overlay"></div>

//         <div className="left-content signup-content">
//           <div className="brand-badge">New Experience</div>

//           <h1>
//             Build Your <br />
//             Digital Journey.
//           </h1>

//           <p>
//             Create your account and unlock premium features, faster bookings,
//             secure payments and more.
//           </p>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="auth-right modern-right-panel">
//         <div className="glass-card signup-glass-card">
//           <div className="auth-header modern-header">
//             <span className="mini-tag">Get Started</span>
//             <h2>Create Account</h2>
//             <p className="subtitle">
//               Join us today. It only takes a few seconds.
//             </p>
//           </div>

//           <div className="auth-form modern-form">
//             <div className="modern-input-group">
//               <label>Full Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter your full name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>

//             <div className="modern-input-group">
//               <label>Mobile Number</label>
//               <input
//                 type="text"
//                 placeholder="Enter mobile number"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//               />
//             </div>

//             <div className="modern-input-group">
//               <label>Promo Code</label>
//               <input
//                 type="text"
//                 placeholder="Optional promo code"
//                 value={promo}
//                 onChange={(e) => setPromo(e.target.value)}
//               />
//             </div>

//             {error && (
//               <div className="auth-error-container modern-error">
//                 <p className="auth-error">{error}</p>
//               </div>
//             )}

//             <button
//               className="modern-btn signup-btn"
//               onClick={signup}
//               disabled={loading}
//             >
//               {loading ? "Creating account..." : "Create Account"}
//             </button>
//           </div>

//           <div className="auth-footer modern-footer">
//             <p className="auth-switch">
//               Already have an account?
//               <span onClick={() => navigate("/login")}> Login</span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import useSignupController from "../controller/useSignupController";
import "../../auth/Pages/css/signup.css";

export default function SignupPage() {
  const navigate = useNavigate();

  const {
    phone,
    setPhone,
    name,
    setName,
    promo,
    setPromo,

    otp,
    setOtp,

    otpSent,
    otpVerified,

    loading,
    error,

    seconds,

    mobileError,
    checkingUser,
    userAlreadyExists,

    checkMobileExists,
    sendOtp,
    verifyOtp,
    signup,
  } = useSignupController();

  return (
    <div className="auth-page modern-auth-page signup-page-wrap">
      {/* LEFT SIDE */}
      <div className="auth-left modern-left-panel signup-left-panel">
        <div className="signup-image-slider">
          <div className="slider-track">
            <div className="slide-card">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                alt="team"
              />
            </div>

            <div className="slide-card">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop"
                alt="office"
              />
            </div>

            <div className="slide-card">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                alt="startup"
              />
            </div>
          </div>
        </div>

        <div className="video-overlay"></div>

        <div className="left-content signup-content">
          <div className="brand-badge">New Experience</div>

          <h1>
            Build Your <br />
            Digital Journey.
          </h1>

          <p>
            Create your account and unlock premium features, faster bookings,
            secure payments and more.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right modern-right-panel">
        <div className="glass-card signup-glass-card">
          <div className="auth-header modern-header">
            <span className="mini-tag">Get Started</span>
            <h2>Create Account</h2>
            <p className="subtitle">
              Join us today. It only takes a few seconds.
            </p>
          </div>

          <div className="auth-form modern-form">
            {/* MOBILE NUMBER */}
            <div className="modern-input-group">
              <label>Mobile Number</label>

              <div className="mobile-input-row">
                <input
                  type="text"
                  placeholder="Enter mobile number"
                  value={phone}
                  maxLength={10}
                  disabled={otpVerified}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    setPhone(value);

                    if (value.length === 10) {
                      checkMobileExists(value);
                    }
                  }}
                />

                <button
                  type="button"
                  className="otp-btn"
                  onClick={sendOtp}
                  disabled={
                    checkingUser ||
                    userAlreadyExists ||
                    phone.length !== 10 ||
                    otpVerified
                  }
                >
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>

              {checkingUser && (
                <p style={{ marginTop: "8px" }}>Checking mobile number...</p>
              )}

              {mobileError && (
                <div className="auth-error-container modern-error">
                  <p className="auth-error">{mobileError}</p>
                </div>
              )}
            </div>

            {/* OTP SECTION */}
            {otpSent && (
              <div className="modern-input-group">
                <label>OTP Verification</label>

                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  disabled={otpVerified}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <div className="otp-action-row">
                  <button
                    type="button"
                    className={`otp-btn ${otpVerified ? "verified" : ""}`}
                    onClick={verifyOtp}
                    disabled={otpVerified}
                  >
                    {otpVerified ? "Verified ✓" : "Verify OTP"}
                  </button>

                  <span className="otp-timer">
                    {seconds === 0
                      ? "Resend Available"
                      : `Resend OTP in ${seconds}s`}
                  </span>
                </div>
              </div>
            )}

            {/* FULL NAME */}
            <div className="modern-input-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                disabled={!otpVerified}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* PROMO CODE */}
            <div className="modern-input-group">
              <label>Promo Code</label>

              <input
                type="text"
                placeholder="Optional promo code"
                value={promo}
                disabled={!otpVerified}
                onChange={(e) => setPromo(e.target.value)}
              />
            </div>

            {error && (
              <div className="auth-error-container modern-error">
                <p className="auth-error">{error}</p>
              </div>
            )}

            {/* CREATE ACCOUNT */}
            <button
              className="modern-btn signup-btn"
              onClick={signup}
              disabled={
                loading || !otpVerified || userAlreadyExists || checkingUser
              }
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <div className="auth-footer modern-footer">
            <p className="auth-switch">
              Already have an account?
              <span onClick={() => navigate("/login")}> Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
