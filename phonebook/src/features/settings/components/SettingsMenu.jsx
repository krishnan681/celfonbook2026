import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../core/services/profileService";
import LogoutButton from "./LogoutButton";
import { Layers } from "lucide-react";
import {
  CreditCard,
  Phone,
  History,
  Shield,
  FileText,
  Mail,
  BadgeCheck
} from "lucide-react";

export default function SettingsMenu() {

  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setProfile);
  }, []);

  return (

    <div className="settings-grid">

      {/* Subscription */}
      <div className="settings-card" onClick={() => navigate("/subscription")}>
        <div className="settings-row">
          <CreditCard size={20} className="settings-icon" />
          <div>
            <h3>Subscription</h3>
            <p>Manage your subscription plan</p>
          </div>
        </div>
      </div>

      {/* Reverse Finder */}
      <div className="settings-card" onClick={() => navigate("/reverse-number")}>
        <div className="settings-row">
          <Phone size={20} className="settings-icon" />
          <div>
            <h3>Reverse Number Finder</h3>
            <p>Find profiles using phone number</p>
          </div>
        </div>
      </div>

      {/* VERIFIED NUMBERS (ONLY ADMINS SEE THIS) */}
      {profile?.is_admin && (
        <div
          className="settings-card"
          onClick={() => navigate("/verified-numbers")}
        >
          <div className="settings-row">
            <BadgeCheck size={20} className="settings-icon" />
            <div>
              <h3>Verified Numbers</h3>
              <p>Access verified number database</p>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN PANEL */}
{profile?.is_admin && (
  <div
    className="settings-card"
    onClick={() => navigate("/admin")}
  >
    <div className="settings-row">
      <Shield size={20} className="settings-icon" />
      <div>
        <h3>Admin Panel</h3>
        <p>Manage system database</p>
      </div>
    </div>
  </div>
)}

      {/* Search History */}
      {/* <div className="settings-card" onClick={() => navigate("/search-history")}>
        <div className="settings-row">
          <History size={20} className="settings-icon" />
          <div>
            <h3>Search History</h3>
            <p>View your previous searches</p>
          </div>
        </div>
      </div> */}

      
      <div
        className="settings-card"
        onClick={() => navigate("/combined-tariff")}
      >
        <div className="settings-row">
          <Layers size={20} className="settings-icon" />
          <div>
            <h3>Combined Tariff</h3>
            <p>View combo advertising plans</p>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="settings-card" onClick={() => navigate("/privacy-policy")}>
        <div className="settings-row">
          <Shield size={20} className="settings-icon" />
          <div>
            <h3>Privacy Policy</h3>
            <p>Read our privacy policy</p>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="settings-card" onClick={() => navigate("/terms")}>
        <div className="settings-row">
          <FileText size={20} className="settings-icon" />
          <div>
            <h3>Terms & Conditions</h3>
            <p>Platform usage rules</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="settings-card" onClick={() => navigate("/contact")}>
        <div className="settings-row">
          <Mail size={20} className="settings-icon" />
          <div>
            <h3>Contact Us</h3>
            <p>Reach our support team</p>
          </div>
        </div>
      </div>

      <LogoutButton />

    </div>
  );
}