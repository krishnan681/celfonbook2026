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

import React from "react";
import { useNavigate } from "react-router-dom";
import useSignupController from "../controller/useSignupController";
import "../../auth/Pages/css/signup.css";

// CORRECTED: Default import (no curly braces)
import SignImg from '../../../assets/images/Signup-image.png'; 

export default function SignupPage() {
  const navigate = useNavigate();

  const {
    phone,
    setPhone,
    name,
    setName,
    promo,
    setPromo,
    loading,
    error,
    signup,
  } = useSignupController();

  return (
    <div className="auth-page">
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="auth-overlay">
          <img
            src={SignImg}
            alt="signup illustration"
            className="auth-image"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p className="subtitle">Join us today! It only takes a minute.</p>
          </div>

          <div className="auth-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="text"
              placeholder="Promo Code (Optional)"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />

            {error && <p className="auth-error">{error}</p>}

            <button onClick={signup} disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}