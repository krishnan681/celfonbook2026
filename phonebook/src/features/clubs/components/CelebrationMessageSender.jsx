// src/features/clubs/components/CelebrationMessageSender.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Send,
  Sparkles,
  MessageSquare,
  PartyPopper,
  Calendar,
  CheckCircle,
  Pencil,
} from "lucide-react";
import { FaWhatsapp as FaWhatsappIcon } from "react-icons/fa";
import { formatCelebrationWishMessage } from "../utils/celebrationMessageHelper";
import { getCurrentUser } from "../../../core/services/profileService";
import { supabase } from "../../../core/config/supabaseClient";

export default function CelebrationMessageSender({
  timeline,
  clubTitle = "Club",
  selectedCelebrant = null,
  onClearSelection = () => {},
}) {
  const allEvents = timeline?.all || [];

  const [activeMemberId, setActiveMemberId] = useState(
    selectedCelebrant?.id || "",
  );
  const [customMessage, setCustomMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchLoggedInUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const profile = await getCurrentUser().catch(() => null);
        if (isMounted) {
          const name =
            profile?.person_name ||
            profile?.fullName ||
            profile?.business_name ||
            profile?.display_name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.person_name ||
            "";
          if (name) setSenderName(name.trim());
        }
      } catch (err) {
        console.error("Error fetching logged in user:", err);
      }
    }
    fetchLoggedInUser();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedCelebrant) {
      setActiveMemberId(selectedCelebrant.id);
    } else if (allEvents.length > 0 && !activeMemberId) {
      setActiveMemberId(allEvents[0].id);
    }
  }, [selectedCelebrant, allEvents]);

  const activeEvent =
    allEvents.find((e) => e.id === activeMemberId) || allEvents[0];

  const defaultFormattedMessage = useMemo(() => {
    if (!activeEvent) return "";
    const clubSlug = clubTitle.toLowerCase().includes("vasavi")
      ? "vasavi"
      : clubTitle.toLowerCase().includes("rotary")
        ? "rotary"
        : "lions";

    return formatCelebrationWishMessage({
      member: activeEvent.member,
      type: activeEvent.type,
      diffDays: activeEvent.diffDays,
      dateFormatted: activeEvent.dateFormatted,
      spouse: activeEvent.spouse,
      clubSlug,
      clubTitle,
      senderName,
    });
  }, [activeEvent, clubTitle, senderName]);

  useEffect(() => {
    setCustomMessage(defaultFormattedMessage);
  }, [defaultFormattedMessage]);

  if (!activeEvent || allEvents.length === 0) return null;

  const targetMember = activeEvent.member;
  const rawMobile = (
    targetMember.mobile_number ||
    targetMember.phone ||
    ""
  ).replace(/[^0-9]/g, "");

  const handleSendWhatsApp = () => {
    if (!rawMobile) {
      alert(
        "No phone number available for this member to send WhatsApp message.",
      );
      return;
    }
    const url = `https://wa.me/91${rawMobile}?text=${encodeURIComponent(customMessage)}`;
    window.open(url, "_blank");
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="celebration-message-sender-card"
      style={{
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "white",
        borderRadius: "20px",
        padding: "24px 28px",
        marginTop: "32px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              borderRadius: "12px",
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
            }}
          >
            <PartyPopper size={22} color="white" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "700" }}>
              Send Celebration Wishes
            </h4>
            <p
              style={{
                margin: "2px 0 0 0",
                fontSize: "0.82rem",
                color: "#94a3b8",
              }}
            >
              Send personalized greetings for upcoming dates or belated wishes
              for finished events
            </p>
          </div>
        </div>

        {/* Member Selector Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
            Select Celebrant:
          </span>
          <select
            value={activeEvent.id}
            onChange={(e) => setActiveMemberId(e.target.value)}
            style={{
              background: "#334155",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "10px",
              padding: "8px 12px",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer",
              maxWidth: "240px",
            }}
          >
            {allEvents.map((evt) => {
              const m = evt.member;
              const name =
                m.fullName || m.person_name || m.business_name || "Member";
              return (
                <option key={evt.id} value={evt.id}>
                  {evt.type === "BIRTHDAY" ? "🎂" : "💍"} {name} ({evt.status} -{" "}
                  {evt.dateFormatted})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Target Member Summary Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255, 255, 255, 0.06)",
          padding: "10px 16px",
          borderRadius: "12px",
          marginBottom: "14px",
          fontSize: "0.85rem",
        }}
      >
        <div>
          <span style={{ color: "#94a3b8" }}>Recipient: </span>
          <strong style={{ color: "#f8fafc" }}>
            {targetMember.fullName ||
              targetMember.person_name ||
              targetMember.business_name}
          </strong>{" "}
          <span
            style={{
              marginLeft: "8px",
              padding: "2px 8px",
              borderRadius: "6px",
              background:
                activeEvent.type === "BIRTHDAY"
                  ? "rgba(245, 158, 11, 0.2)"
                  : "rgba(236, 72, 153, 0.2)",
              color: activeEvent.type === "BIRTHDAY" ? "#fcd34d" : "#f472b6",
              fontWeight: "700",
              fontSize: "0.75rem",
            }}
          >
            {activeEvent.title} • {activeEvent.status} (
            {activeEvent.dateFormatted})
          </span>
        </div>
        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
          {rawMobile ? `+91 ${rawMobile}` : "No number listed"}
        </span>
      </div>

      {/* Message Textarea */}
      <div style={{ marginBottom: "16px", position: "relative" }}>
        <textarea
          rows={3}
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Type your celebratory message here..."
          style={{
            width: "100%",
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "12px",
            padding: "12px 36px 12px 16px",
            fontSize: "0.9rem",
            lineHeight: 1.5,
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <span
          title="Editable message"
          style={{
            position: "absolute",
            top: "14px",
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

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <button
          type="button"
          onClick={handleCopyMessage}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "10px",
            padding: "8px 18px",
            fontSize: "0.85rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {isCopied ? "✓ Copied!" : "Copy Text"}
        </button>

        <button
          type="button"
          onClick={handleSendWhatsApp}
          disabled={!rawMobile}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: rawMobile ? "#25D366" : "#475569",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px 22px",
            fontSize: "0.9rem",
            fontWeight: "700",
            cursor: rawMobile ? "pointer" : "not-allowed",
            boxShadow: rawMobile
              ? "0 4px 14px rgba(37, 211, 102, 0.35)"
              : "none",
          }}
        >
          <FaWhatsappIcon size={18} />
          <span>Send via WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
