import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/EnquiryModal.css";

const EnquiryModal = ({ isOpen, onClose, profile }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  if (!isOpen || !profile) return null;

  const targetName =
    profile.business_name ||
    profile.person_name ||
    "this profile";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const cleanPhone = profile.phone
    ? profile.phone.replace(/\D/g, "")
    : null;

  const generateMessage = () => {
    return `Hello ${targetName},

${formData.message}

From:
${formData.name}
Phone: ${formData.phone}`;
  };

  return (
    <div className="enquire-modal-backdrop" onClick={onClose}>
      <div
        className="enquire-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="modal-inner">
          {/* LEFT SIDE */}
          <div className="left-side">
            <div className="promo-content text-center">
              <img
                src="https://via.placeholder.com/150x150.png?text=Promo+Image"
                alt="promo"
                className="mb-3"
              />
              <p className="fw-bold mb-1">Connect with</p>
              <h5 className="text-primary fw-bold mb-2">20k+ People</h5>
              <p className="small text-muted mb-4">on Signpost</p>
              <button
                className="btn btn-primary rounded-pill px-4 py-2"
                onClick={() => navigate("/PostYourListing")}
              >
                List your business for <b>FREE</b>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="right-side">
            <h4 className="fw-bold mb-1">
              Send enquiry to{" "}
              <span className="text-primary">{targetName}</span>
            </h4>

            <p className="small text-muted mb-4">
              Choose how you want to contact this profile
            </p>

            <form>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Your Name *"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <textarea
                name="message"
                className="form-control"
                placeholder="Your Message *"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
              />

              {/* ================= CONTACT ICON ROW ================= */}
              <div className="contact-row">
                {cleanPhone && (
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      generateMessage()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-circle whatsapp"
                    title="WhatsApp"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                )}

                {cleanPhone && (
                  <a
                    href={`sms:${cleanPhone}?body=${encodeURIComponent(
                      generateMessage()
                    )}`}
                    className="contact-circle sms"
                    title="SMS"
                  >
                    <i className="fas fa-comment"></i>
                  </a>
                )}

                {profile.email && (
                  <a
                    href={`mailto:${profile.email}?subject=Enquiry&body=${encodeURIComponent(
                      generateMessage()
                    )}`}
                    className="contact-circle email"
                    title="Email"
                  >
                    <i className="fas fa-envelope"></i>
                  </a>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-outline-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>

            <ul className="info-list">
              <li>Your message will open in the selected app</li>
              <li>You can edit the message before sending</li>
              <li>No enquiry is stored in our system</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
