// import { useState } from "react";
// import { supabase } from "../../../core/config/supabaseClient";
// import "../Pages/css/ForgotPassword.css";

// const ForgotPassword = () => {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const sendOtp = async () => {
//     if (!email) return;
//     setLoading(true);
//     setError("");

//     const { error } = await supabase.auth.resetPasswordForEmail(email);

//     if (error) {
//       setError(error.message);
//     } else {
//       setStep(2);
//     }
//     setLoading(false);
//   };

//   const verifyOtpAndReset = async () => {
//     if (!otp || !password) return;
//     setLoading(true);
//     setError("");

//     const { data, error } = await supabase.auth.verifyOtp({
//       email,
//       token: otp,
//       type: "recovery",
//     });

//     if (error || !data.user) {
//       setError("Invalid OTP or session expired.");
//       setLoading(false);
//       return;
//     }

//     const { error: updateError } = await supabase.auth.updateUser({
//       password,
//     });

//     if (updateError) {
//       setError(updateError.message);
//     } else {
//       // Using a smoother way to redirect
//       alert("Password updated successfully!");
//       window.location.href = "/login";
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="auth-container">
//       <h2>Reset Access</h2>
      
//       <div className="auth-card-wrap">
//         {step === 1 ? (
//           <div className="step-content">
//             <p className="step-description">Enter your email to receive a recovery code.</p>
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <button className="primary-btn" onClick={sendOtp} disabled={loading}>
//               {loading ? "Sending..." : "Send Verification OTP"}
//             </button>
//           </div>
//         ) : (
//           <div className="step-content">
//             <p className="step-description">Enter the OTP sent to <b>{email}</b></p>
//             <input
//               type="text"
//               placeholder="6-Digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder="New Secure Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button className="primary-btn" onClick={verifyOtpAndReset} disabled={loading}>
//               {loading ? "Updating..." : "Update Password"}
//             </button>
//             <button className="link-btn" onClick={() => setStep(1)}>
//               Change email address
//             </button>
//           </div>
//         )}

//         {error && <div className="error-box">{error}</div>}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;



import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for back button
import { supabase } from "../../../core/config/supabaseClient";
import { ChevronLeft } from "lucide-react"; // Optional: npm install lucide-react
import "../Pages/css/ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setStep(2);
    }
    setLoading(false);
  };

  const verifyOtpAndReset = async () => {
    if (!otp || !password) return;
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery",
    });

    if (error || !data.user) {
      setError("Invalid OTP or session expired.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      alert("Password updated successfully!");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Back Button positioned above the card */}
      <button className="back-nav-btn" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <h2>Reset Access</h2>
      
      <div className="auth-card-wrap">
        <div className="auth-card-body">
          {step === 1 ? (
            <div className="step-content">
              <p className="step-description">Forgot your password? No worries. Enter your email and we'll send you a recovery code.</p>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="primary-btn" onClick={sendOtp} disabled={loading}>
                {loading ? "Sending..." : "Send Verification OTP"}
              </button>
            </div>
          ) : (
            <div className="step-content">
              <p className="step-description">Security Check: Enter the 6-digit code sent to your inbox and choose a new password.</p>
              <input
                type="text"
                placeholder="6-Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="primary-btn" onClick={verifyOtpAndReset} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button className="link-btn" onClick={() => setStep(1)}>
                Change email address
              </button>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}
        </div>

        
      </div>

      {/* Informational Message at the bottom of the card */}
        <div className="auth-card-footer-msg">
          <p>If you don't see the email, please check your spam folder or try again in a few minutes.</p>
        </div>
    </div>
  );
};

export default ForgotPassword;