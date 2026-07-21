import React, { useState } from "react";
import {
  CheckCircle,
  Copy,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import "./../Pages/css/RegistrationSuccessModal.css";

export default function RegistrationSuccessModal({
  open,
  onClose,
  name,
  username,
  password,
}) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const copyDetails = async () => {
    const text = `CELFON BOOK

Name : ${name}
Username : ${username}
Password : ${password}`;

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="registration-overlay">
      <div className="registration-modal">

        <div className="registration-header">

          <div className="success-circle">
            <CheckCircle size={48} />
          </div>

          <h2>Welcome to CELFON BOOK</h2>

          <p>
            Your account has been created successfully.
          </p>

        </div>

        <div className="credentials-card">

          <div className="credential-row">
            <span>Name</span>
            <strong>{name}</strong>
          </div>

          <div className="credential-row">
            <span>Username</span>
            <strong>{username}</strong>
          </div>

          <div className="credential-row">
            <span>Password</span>
            <strong>{password}</strong>
          </div>

        </div>

        <div className="registration-info">

          <ShieldCheck size={18} />

          <span>
            Save these credentials safely. You'll need them when logging in.
          </span>

        </div>

        <div className="registration-actions">

          <button
            className="copy-button"
            onClick={copyDetails}
          >
            <Copy size={18} />

            {copied ? "Copied" : "Copy Credentials"}
          </button>

          <button
            className="continue-button"
            onClick={onClose}
          >
            Continue

            <ArrowRight size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}