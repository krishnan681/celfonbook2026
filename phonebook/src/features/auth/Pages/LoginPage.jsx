// import { useLoginController } from "../controller/useLoginController";
// import InputField from "../components/InputField";
// import "../Pages/css/Login.css";

// const LoginPage = () => {
//   const {
//     identifier,
//     setIdentifier,
//     password,
//     setPassword,
//     loading,
//     error,
//     handleLogin,
//   } = useLoginController();

//   return (
//     <div className="login-container">
//       {/* Left Side */}
//       <div className="login-branding">
//         <div className="branding-content">
//           <span className="logo-text">LOGO</span>
//           <h1>Welcome Back</h1>
//           <p>
//             Login to get amazing discounts and offers only for you.
//           </p>
//         </div>
//         <div className="decoration-circle circle-1"></div>
//         <div className="decoration-circle circle-2"></div>
//       </div>

//       {/* Right Side */}
//       <div className="login-form-section">
//         <div className="form-wrapper">
//           <h2 className="form-title">Login</h2>
//           <p className="form-subtitle">
//             Welcome! Login to get amazing discounts and offers only for you.
//           </p>

//           {/* Identifier */}
//           <div className="input-group">
//             <label>User Name</label>
//             <InputField
//               placeholder="Mobile Number or Email"
//               value={identifier}
//               onChange={(v) => setIdentifier(v)}
//             />
//           </div>

//           {/* Password */}
//           <div className="input-group">
//             <label>Password</label>
//             <InputField
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(v) => setPassword(v)}   
//             />
//           </div>

//           <div className="form-options">
//             <span
//               className="forgot-password"
//               onClick={() => (window.location.href = "/forgot-password")}
//             >
//               Forgot password?
//             </span>
//           </div>

//           {error && <p className="error-text">{error}</p>}

//           <button
//             className="login-button"
//             onClick={handleLogin}
//             disabled={loading}
//           >
//             {loading ? "LOADING..." : "LOGIN →"}
//           </button>

//           <div>
//             <span className="divider">or</span>
//           </div>

//           <div className="form-footer">
//             <span
//               className="signup-link"
//               onClick={() => (window.location.href = "/signup")}
//             >
//               Create new account
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;




// import React from "react";
// import { useNavigate } from "react-router-dom";
// import useLoginController from "../controller/useLoginController";
// import "../../auth/Pages/css/login.css";

 
// import loginImg from '../../../assets/images/Login-image.jpg'; 

// export default function LoginPage() {
//   const navigate = useNavigate();

//   const {
//     identifier,
//     setIdentifier,
//     password,
//     setPassword,
//     loading,
//     error,
//     login, // Function from your custom hook
//   } = useLoginController();

//   return (
//     <div className="auth-page">
      
//       {/* LEFT SIDE - Visual Section */}
//       <div className="auth-left">
//         <img src={loginImg} alt="Login Illustration" />
//         <div className="auth-overlay"></div>
//       </div>

//       {/* RIGHT SIDE - Form Section */}
//       <div className="auth-right">
//         <div className="auth-card">
          
//           <div className="auth-header">
//             <h2>Welcome Back</h2>
//             <p className="subtitle">Enter your credentials to access your account</p>
//           </div>

//           <div className="auth-form">
//             <div className="input-group">
//               <input
//                 type="text"
//                 placeholder="Mobile Number"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 autoComplete="username"
//               />
              
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 autoComplete="current-password"
//               />
//             </div>

//             <div className="auth-forgot">
//               <span onClick={() => navigate("/forgot-password")}>
//                 Forgot password?
//               </span>
//             </div>

//             {/* Error Message Display */}
//             {error && (
//               <div className="auth-error-container">
//                 <p className="auth-error">{error}</p>
//               </div>
//             )}

//             <button 
//               className="login-button" 
//               onClick={login} 
//               disabled={loading}
//             >
//               {loading ? (
//                 <span className="loader-text">Verifying...</span>
//               ) : (
//                 "Login"
//               )}
//             </button>
//           </div>

//           <div className="auth-footer">
//             <p className="auth-switch">
//               Don't have an account?{" "}
//               <span onClick={() => navigate("/signup")}>Sign up</span>
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }



 
import React from "react";
import { useNavigate } from "react-router-dom";
import useLoginController from "../controller/useLoginController";
import "../../auth/Pages/css/login.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    login,
  } = useLoginController();

  return (
    <div className="auth-page modern-auth-page">
      {/* LEFT SIDE */}
      <div className="auth-left modern-left-panel">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="auth-bg-video"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-driving-through-the-city-at-night-1566747797137?download=1080p"
            type="video/mp4"
          />
        </video>

        <div className="video-overlay"></div>

        <div className="left-content">
          <div className="brand-badge">Premium Access</div>

          <h1>
            Welcome <br />
            Back.
          </h1>

          <p>
            Securely access your dashboard, bookings, insights and account
            management from anywhere.
          </p>

          <div className="feature-cards">
            <div className="feature-box">
              <h3>24/7 Access</h3>
              <span>Always connected</span>
            </div>

            <div className="feature-box">
              <h3>Fast & Secure</h3>
              <span>Protected login system</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right modern-right-panel">
        <div className="glass-card">
          <div className="auth-header modern-header">
            <span className="mini-tag">Login Account</span>
            <h2>Sign In</h2>
            <p className="subtitle">
              Enter your mobile number and password to continue.
            </p>
          </div>

          <div className="auth-form modern-form">
            <div className="modern-input-group">
              <label>Mobile Number</label>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="modern-input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="auth-forgot modern-forgot">
              <span onClick={() => navigate("/forgot-password")}>
                Forgot password?
              </span>
            </div>

            {error && (
              <div className="auth-error-container modern-error">
                <p className="auth-error">{error}</p>
              </div>
            )}

            <button
              className="login-button modern-btn"
              onClick={login}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Login Now"}
            </button>
          </div>

          <div className="auth-footer modern-footer">
            <p className="auth-switch">
              Don&apos;t have an account?
              <span onClick={() => navigate("/signup")}> Create one</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 