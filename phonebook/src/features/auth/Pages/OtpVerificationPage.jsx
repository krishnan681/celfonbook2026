import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../core/config/supabaseClient";
import "./css/verify.css";

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!phone) {
      navigate("/signup");
    }
  }, [phone, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Generate OTP
  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      setResendLoading(true);
      setError("");
      setSuccess("");

      const newOtp = generateOtp();

      // API CALL
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          otp: newOtp,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend OTP");
      }

      // delete old OTP
      await supabase
        .from("otp_verifications")
        .delete()
        .eq("phone", phone);

      // insert new OTP
      const { error: insertError } = await supabase
        .from("otp_verifications")
        .insert({
          phone,
          otp: newOtp,
        });

      if (insertError) throw insertError;

      setSuccess("OTP resent successfully");
      setCountdown(30);
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter OTP");
      return;
    }

    if (otp.length !== 4) {
      setError("Enter valid 4 digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const { data, error } = await supabase
        .from("otp_verifications")
        .select("*")
        .eq("phone", phone)
        .eq("otp", otp.trim())
        .single();

      if (error || !data) {
        throw new Error("Invalid OTP");
      }

      // delete OTP after success
      await supabase
        .from("otp_verifications")
        .delete()
        .eq("phone", phone);

      setSuccess("OTP Verified Successfully");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page modern-auth-page">
      {/* LEFT SIDE */}
      <div className="auth-left modern-left-panel">
        <div className="video-overlay"></div>

        <div className="left-content signup-content">
          <div className="brand-badge">OTP Verification</div>

          <h1>
            Verify <br />
            Your Number
          </h1>

          <p>
            Enter the OTP sent to your registered mobile number to continue.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right modern-right-panel">
        <div className="glass-card signup-glass-card">
          <div className="auth-header modern-header">
            <span className="mini-tag">Secure Access</span>

            <h2>OTP Verification</h2>

            <p className="subtitle">
              Enter the 4-digit code sent to
            </p>

          <strong>{phone}</strong>
          </div>

          <div className="auth-form modern-form">
            <div className="modern-input-group">
              <label>Enter OTP</label>

              <input
                type="text"
                placeholder="Enter 4 digit OTP"
                maxLength={4}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            {error && (
              <div className="auth-error-container modern-error">
                <p className="auth-error">{error}</p>
              </div>
            )}

            {success && (
              <div
                style={{
                  background: "#e8fff0",
                  color: "#008a2e",
                  padding: "10px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                {success}
              </div>
            )}

            <button
              className="modern-btn signup-btn"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              {countdown > 0 ? (
                <p>Resend OTP in {countdown}s</p>
              ) : (
                <button
                  onClick={resendOtp}
                  disabled={resendLoading}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {resendLoading
                    ? "Sending..."
                    : "Resend OTP"}
                </button>
              )}
            </div>
          </div>

          <div className="auth-footer modern-footer">
            <p className="auth-switch">
              Wrong number?
              <span onClick={() => navigate("/signup")}>
                {" "}
                Go Back
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}