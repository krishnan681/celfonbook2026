
import React from "react";
import "../common/css/about.css";
import Timeline from "../common/Timeline";

import AboutPageImage from "../../assets/images/AboutPageImage.jpg"

const AboutPage = () => {
  return (
    <div className="about-page container py-5">
      <div className="about-header text-center mb-5">
        <h1>About Signpost PHONE BOOK</h1>
        <p className="lead">
          Signpost PHONE BOOK is Your ultimate solution for effective business
          promotion. We specialize in helping businesses reach their target
          audience through powerful marketing channels like SMS, WhatsApp, and
          Email.
        </p>
      </div>

      <div className="about-content row g-4 align-items-start">
        {/* Left Column */}
        <div className="col-lg-6">
          <h4>Highlights</h4>
          <ul className="list-unstyled">
            <li>✅ Built-in Database of Lakhs of MSMEs</li>
            <li>✅ Mobile-friendly (Works on Smart & Feature Phones)</li>
            <li>
              ✅ Firm-wise Alphabetical & Category-wise Search (10,000+ Categories)
            </li>
            <li>✅ Daily Updates with New MSME Firms</li>
            <li>✅ Highly Useful for B2C & B2B Segments</li>
            <li>✅ Promote via SMS, WhatsApp, Email</li>
            <li>✅ Special Reach: Category-wise or Location-based</li>
          </ul>

          <h4 className="mt-4">Uses</h4>
          <ul className="list-unstyled">
            <li>📞 Find & Dial MSME Contacts</li>
            <li>📲 Send SMS / WhatsApp / Emails</li>
            <li>📋 Shortlist Targeted Prospects</li>
            <li>📍 Nearby Bulk Marketing (By Pincode/Area)</li>
            <li>✉️ Send Clearance Offers, New Intros, Invites, Reminders</li>
            <li>👨‍💼 Reach Specific Audiences (Professionals, Gents, Ladies)</li>
          </ul>
        </div>

        {/* Right Image Column */}
        <div className="col-lg-6 d-flex justify-content-end align-items-start">
          <img
            src={AboutPageImage} 
            alt="Signpost Phone Book Illustration"
            className="about-side-img img-fluid mt-2"
          />
        </div>

        {/* Full Width Timeline and Subscription Section */}
        <div className="col-12 mt-5">
          <Timeline />
        </div>

        {/* Subscription Info */}
        <div className="col-lg-6">
          <div className="info-box p-4 shadow-sm rounded bg-light">
            <h5>Subscription Plans (For MSMEs Only)</h5>
            <ul>
              <li>💼 ₹2,500 for Tiny & Micro Enterprises</li>
              <li>🏢 ₹4,500 for Small Enterprises</li>
            </ul>

            <div className="mt-4">
              <h6>For Registrations, Subscription:</h6>
              <address>
                46, SIGNPOST TOWERS, FIRST FLOOR,
                <br />
                SIDCO INDUSTRIAL ESTATE,
                <br />
                COIMBATORE, Tamil Nadu – 641021
                <br />
                📞 Contact: <a href="tel:9514555132">95145 55132</a>
              </address>
              <a
                href="https://www.signpostphonebook.in"
                target="_blank"
                rel="noreferrer"
              >
                🌐 www.signpostphonebook.in
              </a>
              <div className="mt-3">
                <strong>Scan QR Code:</strong>
                <br />
                <img
                  src="/images/qrscan.png"
                  alt="QR Code"
                  className="qr-img mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Support Note */}
        <div className="col-lg-6">
          <div className="support-note mt-4">
            <p>
              Our platform ensures seamless experience to create, manage, and
              track promotional campaigns. Whether you're a small business or a
              large enterprise, we offer tools to scale with your needs.
            </p>
            <p>
              💡 Enjoy 24/7 customer support and focus on growing your business
              while we handle your communication.
            </p>
            <strong>Start your journey with Signpost PHONE BOOK today!</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
