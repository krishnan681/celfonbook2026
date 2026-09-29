// src/features/clubs/components/BulkSmsModal.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  MessageSquare,
  Smartphone,
  Users,
  AlertCircle,
  Mail,
  Send,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
import { supabase } from "../../../core/config/supabaseClient";
import { getCurrentUser } from "../../../core/services/profileService";
import "./css/BulkSmsModal.css";

export default function BulkSmsModal({
  isOpen = false,
  onClose,
  members = [],
  title = "Club Officers",
  clubOrDistrictName = "",
  themeClass = "theme-lions",
}) {
  // Channel state: "sms" (default), "email"
  const [activeChannel, setActiveChannel] = useState("sms");

  // Logged-in user's name from signup/profile
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const profile = await getCurrentUser().catch(() => null);

        if (isMounted) {
          const name =
            profile?.person_name ||
            profile?.fullName ||
            profile?.name ||
            profile?.business_name ||
            user?.user_metadata?.full_name ||
            user?.user_metadata?.name ||
            user?.user_metadata?.person_name ||
            "";
          if (name) {
            setSenderName(name.trim());
          }
        }
      } catch (err) {
        console.warn("Could not fetch user info for signature:", err);
      }
    }
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  // Extract and clean valid contact recipients
  const parsedRecipients = useMemo(() => {
    return (members || []).map((member) => {
      const rawMobile =
        member.mobile_number || member.mobile || member.phone || "";
      const cleanMobile = (rawMobile || "").replace(/[^0-9]/g, "");

      const rawEmail = (
        member.email ||
        member.mail ||
        member.email_id ||
        ""
      ).trim();
      const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail);

      const name =
        member.fullName ||
        member.person_name ||
        member.name ||
        member.business_name ||
        "Member";

      const role =
        member.postFull ||
        member.post_of_member ||
        member.post ||
        title ||
        "";
      const club = member.club || member.clubName || "";

      return {
        id: member.id || `${cleanMobile}-${name}`,
        name,
        role,
        club,
        mobile: cleanMobile,
        email: rawEmail,
        hasValidMobile: cleanMobile.length >= 10,
        hasValidEmail,
      };
    });
  }, [members, title]);

  // Filter based on channel requirements
  const validMobileRecipients = useMemo(
    () => parsedRecipients.filter((m) => m.hasValidMobile),
    [parsedRecipients]
  );

  const validEmailRecipients = useMemo(
    () => parsedRecipients.filter((m) => m.hasValidEmail),
    [parsedRecipients]
  );

  // Selected recipient IDs
  const [selectedIds, setSelectedIds] = useState([]);
  const [showRecipientList, setShowRecipientList] = useState(false);

  // Default customizable message with sender's name in Regards signature
  const defaultMessage = useMemo(() => {
    const signature = senderName || "Club Officer";
    let greetingRole = (title || "Member").trim();
    // Add Lion next to the selected role (e.g., Secretary Lion, Zone Chairperson Lion)
    if (!greetingRole.toLowerCase().includes("lion")) {
      greetingRole = `${greetingRole} Lion`;
    }
    return `Dear ${greetingRole},\nGreetings!\n\nThis is an announcement for all our respected officers.\n\nRegards,\n${signature}`;
  }, [title, senderName]);

  const [message, setMessage] = useState(defaultMessage);

  // Update message when defaultMessage signature or title changes (unless user heavily edited)
  useEffect(() => {
    setMessage(defaultMessage);
  }, [defaultMessage]);

  // Initialize selected recipients whenever modal opens or channel changes
  useEffect(() => {
    if (isOpen) {
      if (activeChannel === "email") {
        setSelectedIds(validEmailRecipients.map((r) => r.id));
      } else {
        setSelectedIds(validMobileRecipients.map((r) => r.id));
      }
    }
  }, [isOpen, activeChannel, validMobileRecipients, validEmailRecipients]);

  if (!isOpen) return null;

  // Active pool of recipients for current channel
  const activePool =
    activeChannel === "email" ? validEmailRecipients : validMobileRecipients;

  const toggleSelectAll = () => {
    if (selectedIds.length === activePool.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(activePool.map((r) => r.id));
    }
  };

  const toggleRecipient = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Selected mobile numbers & emails
  const selectedNumbers = validMobileRecipients
    .filter((r) => selectedIds.includes(r.id))
    .map((r) => r.mobile);

  const selectedEmails = validEmailRecipients
    .filter((r) => selectedIds.includes(r.id))
    .map((r) => r.email);

  // Character calculation
  const charLength = message.length;
  const smsSegments = Math.max(1, Math.ceil(charLength / 160));

  // --- SEND ACTIONS ---

  // 1. Normal SMS (Default)
  const handleSendSMS = () => {
    if (selectedNumbers.length === 0) {
      alert("Please select at least one recipient with a valid phone number.");
      return;
    }
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const separator = isIOS ? ";" : ",";
    const numbersStr = selectedNumbers.join(separator);
    const encodedBody = encodeURIComponent(message);

    const smsUrl = isIOS
      ? `sms:${numbersStr}&body=${encodedBody}`
      : `sms:${numbersStr}?body=${encodedBody}`;

    window.location.href = smsUrl;
  };

  // 2. Email
  const handleSendEmail = () => {
    if (selectedEmails.length === 0) {
      alert("No email addresses available for the selected recipients.");
      return;
    }
    const subject = `${title} Announcement - ${clubOrDistrictName || "Club"}`;
    const mailtoUrl = `mailto:${selectedEmails.join(",")}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    window.location.href = mailtoUrl;
  };

  // Trigger appropriate send based on active channel
  const handlePrimarySend = () => {
    if (activeChannel === "sms") {
      handleSendSMS();
    } else if (activeChannel === "email") {
      handleSendEmail();
    }
  };


  const currentSelectionCount =
    activeChannel === "email" ? selectedEmails.length : selectedNumbers.length;

  const totalAvailableForChannel = activePool.length;

  return (
    <div className={`bulk-sms-backdrop ${themeClass}`} onClick={onClose}>
      <div
        className="bulk-sms-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bulk-sms-header">
          <div className="bulk-sms-title-group">
            <div className="bulk-sms-icon-wrap">
              {activeChannel === "sms" && <Smartphone size={20} />}
              {activeChannel === "email" && <Mail size={20} />}
            </div>
            <div>
              <h3>
                {activeChannel === "sms"
                  ? `Send Normal SMS to ${title}`
                  : `Send Email to ${title}`}
              </h3>
              <p className="bulk-sms-subtitle">
                {clubOrDistrictName
                  ? `${clubOrDistrictName} Directory`
                  : "Leadership Communication"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="bulk-sms-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bulk-sms-body">
          {/* Channel Selector: Normal SMS (Default) / Email */}
          <div className="bulk-channel-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeChannel === "sms"}
              className={`channel-tab-btn ${
                activeChannel === "sms" ? "active" : ""
              }`}
              onClick={() => setActiveChannel("sms")}
            >
              <Smartphone size={16} />
              <span> SMS</span>
              <span className="channel-badge">{validMobileRecipients.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeChannel === "email"}
              className={`channel-tab-btn ${
                activeChannel === "email" ? "active email" : ""
              } ${validEmailRecipients.length === 0 ? "disabled-tab" : ""}`}
              onClick={() => setActiveChannel("email")}
              title={
                validEmailRecipients.length === 0
                  ? "No email addresses found for these profiles"
                  : `Send Email to ${validEmailRecipients.length} recipients`
              }
            >
              <Mail size={16} />
              <span>Email</span>
              <span className="channel-badge">{validEmailRecipients.length}</span>
            </button>
          </div>

          {/* Recipient summary bar */}
          <div className="bulk-sms-recipient-summary">
            <div className="summary-left">
              <Users size={16} className="summary-icon" />
              <span className="summary-text">
                <strong>{currentSelectionCount}</strong> of{" "}
                <strong>{totalAvailableForChannel}</strong>{" "}
                {activeChannel === "email" ? "recipients with email" : "recipients with mobile"}
              </span>
            </div>
            <div className="summary-actions">
              <button
                type="button"
                className="btn-select-all"
                onClick={toggleSelectAll}
                disabled={totalAvailableForChannel === 0}
              >
                {selectedIds.length === totalAvailableForChannel
                  ? "Deselect All"
                  : "Select All"}
              </button>
              <button
                type="button"
                className="btn-view-list"
                onClick={() => setShowRecipientList((prev) => !prev)}
              >
                <span>List</span>
                {showRecipientList ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Expandable Recipient Selection List */}
          {showRecipientList && (
            <div className="bulk-sms-recipients-list">
              {activePool.length === 0 ? (
                <p className="no-recipients">
                  {activeChannel === "email"
                    ? "None of the selected profiles have an email address recorded."
                    : "No phone numbers found for the selected profiles."}
                </p>
              ) : (
                activePool.map((recipient) => {
                  const isChecked = selectedIds.includes(recipient.id);
                  return (
                    <label
                      key={recipient.id}
                      className={`recipient-item ${isChecked ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleRecipient(recipient.id)}
                      />
                      <div className="recipient-info">
                        <span className="recipient-name">{recipient.name}</span>
                        <span className="recipient-details">
                          {recipient.club && `${recipient.club} · `}
                          {activeChannel === "email"
                            ? `✉️ ${recipient.email}`
                            : `📞 ${recipient.mobile}`}
                        </span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          )}

          {/* Channel-specific notices */}
          {activeChannel === "email" && validEmailRecipients.length === 0 && (
            <div className="bulk-sms-warning-notice">
              <AlertCircle size={15} />
              <span>
                No email addresses were found for these profiles. Please use <strong>Normal SMS</strong> or <strong>WhatsApp</strong> to reach them.
              </span>
            </div>
          )}

          {activeChannel === "whatsapp" && (
            <div className="bulk-sms-info-notice">
              <span>
                💡 <strong>WhatsApp:</strong> Opens WhatsApp to share your announcement directly with the selected recipients.
              </span>
            </div>
          )}

          {/* Message Textarea */}
          <div className="bulk-sms-field-group">
            <div className="field-label-row">
              <label htmlFor="bulk-sms-textarea">
                {activeChannel === "email" ? "Email Body" : "Message Content"}
              </label>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.78rem",
                  color: "#64748b",
                  fontWeight: 500,
                }}
                title="Message is editable"
              >
                <Pencil size={13} />
                <span>Editable</span>
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <textarea
                id="bulk-sms-textarea"
                className="bulk-sms-textarea"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                style={{ paddingRight: "36px" }}
              />
              <span
                title="Editable message"
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  opacity: 0.75,
                }}
              >
                <Pencil size={14} />
              </span>
            </div>
            <div className="char-count-row">
              {activeChannel === "sms" ? (
                <span>
                  {charLength} characters · {smsSegments}{" "}
                  {smsSegments === 1 ? "SMS credit" : "SMS credits"} (160 char/SMS)
                </span>
              ) : (
                <span>{charLength} characters</span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bulk-sms-footer">
          <div className="bulk-sms-main-actions" style={{ width: "100%", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="bulk-sms-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`bulk-sms-send-btn ${
                activeChannel === "email" ? "btn-email" : "btn-sms"
              }`}
              onClick={handlePrimarySend}
              disabled={currentSelectionCount === 0}
            >
              {activeChannel === "sms" && (
                <>
                  <Smartphone size={17} />
                  <span>Send (via SMS App)</span>
                </>
              )}
              {activeChannel === "email" && (
                <>
                  <Mail size={17} />
                  <span>Send (via E-mail App)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
