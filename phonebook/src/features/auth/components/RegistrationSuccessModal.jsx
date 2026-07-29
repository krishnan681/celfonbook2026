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
    <div className="reg-success-overlay">
  <div className="reg-success-modal">

    <div className="reg-success-icon">
      <CheckCircle2 size={70} />
    </div>

    <h2 className="reg-success-title">Registration Successful</h2>

    <p className="reg-success-subtitle">
      Welcome to <strong>CELFON BOOK</strong>.
      <br />
      Your account is ready to use.
    </p>

    <div className="reg-success-credentials">

      <div className="reg-success-item">
        <div className="reg-success-item-icon">
          <User size={18} />
        </div>

        <div>
          <small>Name</small>
          <h4>{name}</h4>
        </div>
      </div>

      <div className="reg-success-item">
        <div className="reg-success-item-icon">
          <AtSign size={18} />
        </div>

        <div>
          <small>Username</small>
          <h4>{username}</h4>
        </div>
      </div>

      <div className="reg-success-item">
        <div className="reg-success-item-icon">
          <Lock size={18} />
        </div>

        <div>
          <small>Password</small>
          <h4>{password}</h4>
        </div>
      </div>

    </div>

    <div className="reg-success-security">
      <ShieldCheck size={18} />
      Save these credentials safely for future login.
    </div>

    <div className="reg-success-buttons">

      <button
        className="reg-success-copy-btn"
        onClick={copyDetails}
      >
        <Copy size={18} />
        {copied ? "Copied!" : "Copy Details"}
      </button>

      <button
        className="reg-success-continue-btn"
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