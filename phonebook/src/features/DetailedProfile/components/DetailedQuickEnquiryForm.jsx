// features/DetailedProfile/components/DetailedQuickEnquiryForm.jsx

import { useState } from "react";
import "../css/DetailedQuickEnquiryForm.css";

export default function DetailedQuickEnquiryForm({ profile }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.message) return;

    try {
      setSubmitting(true);

      // TODO: Replace with real Supabase insert
      // await supabase.from("enquiries").insert([{ ...formData, profile_id: profile.id }]);

      await new Promise((resolve) => setTimeout(resolve, 800)); // simulated delay

      setSuccess(true);
      setFormData({ name: "", phone: "", message: "" });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Enquiry submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pd-sticky-card">
      <h4 className="pd-enquiry-title">Quick Enquiry</h4>

      <form className="pd-enquiry-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          inputMode="tel"
          autoComplete="tel"
          pattern="[0-9]{10}"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Message..."
          rows="3"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="pd-submit-btn"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Contact Business"}
        </button>

        {success && (
          <p className="pd-success-text">
            Enquiry sent successfully.
          </p>
        )}
      </form>
    </div>
  );
}