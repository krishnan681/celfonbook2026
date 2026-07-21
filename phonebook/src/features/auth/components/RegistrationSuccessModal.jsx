import React, { useState } from "react";
import {
  CheckCircle2,
  Copy,
  ArrowRight,
  ShieldCheck,
  User,
  Lock,
  AtSign,
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

        <div className="success-icon">
          <CheckCircle2 size={70} />
        </div>

        <h2>Registration Successful</h2>

        <p className="subtitle">
          Welcome to <strong>CELFON BOOK</strong>.
          <br />
          Your account is ready to use.
        </p>

        <div className="credential-box">

          <div className="credential-item">
            <div className="icon">
              <User size={18} />
            </div>

            <div>
              <small>Name</small>
              <h4>{name}</h4>
            </div>
          </div>

          <div className="credential-item">
            <div className="icon">
              <AtSign size={18} />
            </div>

            <div>
              <small>Username</small>
              <h4>{username}</h4>
            </div>
          </div>

          <div className="credential-item password">
            <div className="icon">
              <Lock size={18} />
            </div>

            <div>
              <small>Password</small>
              <h4>{password}</h4>
            </div>
          </div>

        </div>

        <div className="security-note">
          <ShieldCheck size={18} />
          Save these credentials safely for future login.
        </div>

        <div className="button-group">

          <button
            className="copy-btn"
            onClick={copyDetails}
          >
            <Copy size={18} />
            {copied ? "Copied!" : "Copy Details"}
          </button>

          <button
            className="continue-btn"
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