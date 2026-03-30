import { useState, useEffect } from "react";
import "../css/ProfileDetail.css";

const FORBIDDEN = [
  "id",
  "created_at",
  "updated_at",
  "auth_id",
  "role",
  "display_name" // ✅ FIX: generated column
];

const MONO_KEYS = ["mobile_number", "whatsapp_number", "phone", "zip", "pincode"];

export default function ProfileDetail({ profile, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (profile) {
      setForm({ ...profile });
      setEditing(false);
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="adm-empty-state">
        <div className="adm-empty-icon">☰</div>
        <div className="adm-empty-text">Select a profile to view details</div>
      </div>
    );
  }

  const handleSave = () => {
    // ✅ CLEAN PAYLOAD (critical fix)
    const cleanData = Object.fromEntries(
      Object.entries(form).filter(
        ([key, value]) =>
          !FORBIDDEN.includes(key) &&
          value !== undefined
      )
    );

    console.log("Updating:", profile.id, cleanData);

    onUpdate(profile.id, cleanData);
    setEditing(false);
  };

  const handleImg = (e) => {
    const f = e.target.files[0];
    if (f) {
      // ⚠️ Still temporary (needs Supabase Storage for real persistence)
      setForm((prev) => ({
        ...prev,
        cover_image: URL.createObjectURL(f),
      }));
    }
  };

  const fields = Object.entries(profile).filter(
    ([k]) => !FORBIDDEN.includes(k)
  );

  const fmtDate = (s) => {
    if (!s) return "—";
    return new Date(s).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Cover */}
      <div className="adm-cover">
        {form.cover_image ? (
          <img src={form.cover_image} alt="cover" />
        ) : (
          <div className="adm-cover-placeholder">◈</div>
        )}

        {editing && (
          <label className="adm-cover-upload-btn">
            📸 Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImg}
              style={{ display: "none" }}
            />
          </label>
        )}
      </div>

      {/* Header */}
      <div className="adm-detail-header">
        <div>
          <div className="adm-detail-name">
            {profile.person_name || profile.business_name || "Profile"}
          </div>
          <div className="adm-detail-sub">
            {profile.business_name ? "Business · " : "Individual · "}
            {fmtDate(profile.created_at)}
          </div>
        </div>

        <div className="adm-detail-actions">
          <button
            className="adm-btn adm-btn-edit"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel" : "Edit"}
          </button>

          {editing && (
            <button className="adm-btn adm-btn-save" onClick={handleSave}>
              Save
            </button>
          )}

          <button
            className="adm-btn adm-btn-delete"
            onClick={() => onDelete(profile.id)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="adm-fields">
        {fields.map(([key, value]) => (
          <div className="adm-field" key={key}>
            <div className="adm-field-key">
              {key.replace(/_/g, " ")}
            </div>

            {editing ? (
              <input
                className="adm-field-input"
                value={form[key] ?? ""}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            ) : (
              <div
                className={`adm-field-val ${
                  MONO_KEYS.includes(key) ? "mono" : ""
                }`}
              >
                {value !== null && value !== undefined
                  ? String(value)
                  : "—"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}