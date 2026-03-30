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




import React from "react";
import { useNavigate } from "react-router-dom";
import useLoginController from "../controller/useLoginController";
import "../../auth/Pages/css/login.css";

 
import loginImg from '../../../assets/images/Login-image.jpg'; 

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    login, // Function from your custom hook
  } = useLoginController();

  return (
    <div className="auth-page">
      
      {/* LEFT SIDE - Visual Section */}
      <div className="auth-left">
        <img src={loginImg} alt="Login Illustration" />
        <div className="auth-overlay"></div>
      </div>

      {/* RIGHT SIDE - Form Section */}
      <div className="auth-right">
        <div className="auth-card">
          
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p className="subtitle">Enter your credentials to access your account</p>
          </div>

          <div className="auth-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Mobile Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
              />
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="auth-forgot">
              <span onClick={() => navigate("/forgot-password")}>
                Forgot password?
              </span>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="auth-error-container">
                <p className="auth-error">{error}</p>
              </div>
            )}

            <button 
              className="login-button" 
              onClick={login} 
              disabled={loading}
            >
              {loading ? (
                <span className="loader-text">Verifying...</span>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="auth-footer">
            <p className="auth-switch">
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")}>Sign up</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}