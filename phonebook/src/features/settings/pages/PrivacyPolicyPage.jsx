import React from "react";
import { Shield, Database, Globe, UserMinus, CreditCard, Bell, SortAsc } from "lucide-react";
import "../css/legal.css";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Shield size={20} />,
      title: "Core Commitment",
      text: "In operating the CELFON Book Mobile App, users’ data such as contact details, PAN, GST, and Date of Birth are collected only for directory purposes and are securely utilized.",
    },
    {
      icon: <Database size={20} />,
      title: "Data Completion",
      text: "Our directory is a rules-based service. Profile data may be improved using information from associated sources and field verification to ensure completeness.",
    },
    {
      icon: <Globe size={20} />,
      title: "Provider Neutrality",
      text: "We do not represent any mobile service provider. User data is sourced independently or via public/business submissions. Listing access remains free for all owners.",
    },
    {
      icon: <UserMinus size={20} />,
      title: "Opt-Out Option",
      text: "Any member listed in the database can opt out of services by submitting a request via email. We respect your right to digital privacy.",
    },
    {
      icon: <CreditCard size={20} />,
      title: "Listing Charges",
      text: "Certain premium listings and visibility options are chargeable as per the applicable tariff plans. Standard listings remain unaffected.",
    },
    {
      icon: <Bell size={20} />,
      title: "Verified Notice",
      text: "We do not contact users directly for listing activation or payments unless officially communicated through authorized channels.",
    },
    {
      icon: <SortAsc size={20} />,
      title: "Listing Order",
      text: "The order of information displayed does not reflect quality or preference. Listings are strictly based on keyword relevance and system logic.",
    },
  ];

  return (
    <div className="lg2-wrapper">
      <div className="lg2-container">
        <header className="lg2-header">
          <div className="lg2-badge">Legal Documentation</div>
          <h1 className="lg2-title">Privacy & Opt-Out Terms</h1>
          <p className="lg2-subtitle">Last updated: March 2026</p>
        </header>

        <div className="lg2-grid">
          {sections.map((section, index) => (
            <div key={index} className="lg2-card-item">
              <div className="lg2-icon-box">{section.icon}</div>
              <div className="lg2-content">
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="lg2-footer-area">
          <p>© 2026 CELFON BOOK • All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
}