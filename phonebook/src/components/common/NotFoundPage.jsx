// src/components/common/NotFoundPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lottie } from "lottie-react";
import { Home, Search, ArrowLeft, Building2 } from "lucide-react";
import notFoundAnimation from "../../assets/images/Page Not Found 404.json";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)",
      }}
    >
      <Helmet>
        <title>404 - Page Not Found | Celfonbook Directory</title>
        <meta
          name="description"
          content="The page you are looking for does not exist or has been moved on Celfonbook Directory."
        />
      </Helmet>

      <div
        style={{
          maxWidth: "580px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "24px",
          padding: "36px 32px 40px",
          textAlign: "center",
          boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Lottie Animation Display */}
        <div
          style={{
            maxWidth: "380px",
            margin: "0 auto 16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Lottie
            animationData={notFoundAnimation}
            loop={true}
            style={{ width: "100%", height: "260px" }}
          />
        </div>

        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: "800",
            color: "#0f172a",
            margin: "0 0 10px 0",
            letterSpacing: "-0.5px",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: "0.95rem",
            color: "#64748b",
            lineHeight: "1.6",
            margin: "0 auto 28px",
            maxWidth: "440px",
          }}
        >
          We couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#f1f5f9",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              padding: "11px 20px",
              fontSize: "0.9rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#005a36",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              padding: "11px 24px",
              fontSize: "0.9rem",
              fontWeight: "700",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(0, 90, 54, 0.25)",
              transition: "transform 0.2s ease",
            }}
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Quick Directory Links */}
        <div
          style={{
            paddingTop: "20px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            fontSize: "0.85rem",
            color: "#64748b",
          }}
        >
          <Link
            to="/search"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#0284c7",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            <Search size={14} />
            <span>Search Directory</span>
          </Link>

          <Link
            to="/lions-club"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#005a36",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            <Building2 size={14} />
            <span>Lions Club Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
