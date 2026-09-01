// src/components/common/ErrorBoundary.jsx
import React from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

/**
 * Telemetry crash reporting utility
 * Extensible for Sentry, LogRocket, or backend logging endpoint
 */
export function reportCrash(error, errorInfo = {}) {
  const payload = {
    message: error?.message || "Unknown error",
    stack: error?.stack || null,
    componentStack: errorInfo?.componentStack || null,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  console.error("[Celfonbook Crash Reporter]:", payload);

  // Future: window.Sentry?.captureException(error, { extra: errorInfo });
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    reportCrash(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "#f8fafc",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              background: "#ffffff",
              borderRadius: "20px",
              padding: "36px 32px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "#fee2e2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <AlertOctagon size={36} />
            </div>

            <h2
              style={{
                margin: "0 0 10px 0",
                fontSize: "1.35rem",
                fontWeight: "800",
                color: "#0f172a",
              }}
            >
              Something went wrong
            </h2>

            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "0.92rem",
                color: "#64748b",
                lineHeight: "1.6",
              }}
            >
              An unexpected issue occurred while rendering this page. Our error reporting system has recorded this event.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#005a36",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "11px 20px",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0, 90, 54, 0.25)",
                }}
              >
                <RotateCcw size={16} />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#f1f5f9",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  padding: "11px 20px",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                <Home size={16} />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
