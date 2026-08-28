// src/features/clubs/components/CelebrationsAside.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Cake,
  PartyPopper,
  MessageSquare,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function CelebrationsAside({
  timeline,
  clubTitle = "Club",
  basePath = "/clubs/lions",
  onSelectCelebrantForMessage,
}) {
  const allEvents = timeline?.all || [];

  // Tabs inside this aside card: "ALL", "BIRTHDAYS", "ANNIVERSARIES"
  const [activeTab, setActiveTab] = useState("ALL");

  // Selected celebrant for the fixed bottom composer
  const [selectedEventId, setSelectedEventId] = useState("");

  // Count calculations
  const birthdayCount = useMemo(
    () => allEvents.filter((e) => e.type === "BIRTHDAY").length,
    [allEvents]
  );
  const anniversaryCount = useMemo(
    () => allEvents.filter((e) => e.type === "ANNIVERSARY").length,
    [allEvents]
  );

  // Filter list by selected tab
  const filteredEvents = useMemo(() => {
    if (activeTab === "BIRTHDAYS") {
      return allEvents.filter((e) => e.type === "BIRTHDAY");
    }
    if (activeTab === "ANNIVERSARIES") {
      return allEvents.filter((e) => e.type === "ANNIVERSARY");
    }
    return allEvents;
  }, [allEvents, activeTab]);

  // Set default selected event
  useEffect(() => {
    if (!selectedEventId && filteredEvents.length > 0) {
      const todayEvent = filteredEvents.find((e) => e.diffDays === 0);
      setSelectedEventId(todayEvent ? todayEvent.id : filteredEvents[0].id);
    } else if (
      selectedEventId &&
      !filteredEvents.some((e) => e.id === selectedEventId) &&
      filteredEvents.length > 0
    ) {
      setSelectedEventId(filteredEvents[0].id);
    }
  }, [filteredEvents, selectedEventId]);

  const activeSelectedEvent =
    allEvents.find((e) => e.id === selectedEventId) || filteredEvents[0] || null;

  // Custom Message state for bottom fixed sender
  const [messageText, setMessageText] = useState("");

  // Update default wish message when activeSelectedEvent changes
  useEffect(() => {
    if (!activeSelectedEvent) return;

    const m = activeSelectedEvent.member;
    const personName =
      m.person_name || m.fullName || m.business_name || "Member";
    const spouse = activeSelectedEvent.spouse || "";
    const isBday = activeSelectedEvent.type === "BIRTHDAY";

    if (activeSelectedEvent.diffDays === 0) {
      // Today
      if (isBday) {
        setMessageText(
          `Dear ${personName}, wishing you a very Happy Birthday! 🎂🎉 May your day be filled with joy and success! - Best wishes from ${clubTitle}`
        );
      } else {
        setMessageText(
          `Dear ${personName} ${
            spouse ? `& ${spouse}` : ""
          }, wishing you both a very Happy Wedding Anniversary! 💍✨ - Best wishes from ${clubTitle}`
        );
      }
    } else if (activeSelectedEvent.diffDays > 0) {
      // Upcoming
      if (isBday) {
        setMessageText(
          `Dear ${personName}, wishing you a very Happy Birthday in advance (${activeSelectedEvent.dateFormatted})! 🎂🎉 - Warm wishes from ${clubTitle}`
        );
      } else {
        setMessageText(
          `Dear ${personName} ${
            spouse ? `& ${spouse}` : ""
          }, wishing you both a very Happy Wedding Anniversary in advance (${activeSelectedEvent.dateFormatted})! 💍✨ - Warm wishes from ${clubTitle}`
        );
      }
    } else {
      // Belated
      if (isBday) {
        setMessageText(
          `Dear ${personName}, wishing you a very Happy Belated Birthday! 🎂 Hope you had a wonderful day! - Warm wishes from ${clubTitle}`
        );
      } else {
        setMessageText(
          `Dear ${personName} ${
            spouse ? `& ${spouse}` : ""
          }, wishing you both a Happy Belated Wedding Anniversary! 💍✨ - Warm wishes from ${clubTitle}`
        );
      }
    }
  }, [activeSelectedEvent, clubTitle]);

  const generateWishText = (item, customMsg = null) => {
    if (customMsg) return customMsg;
    const m = item.member;
    const personName =
      m.person_name || m.fullName || m.business_name || "Member";
    const spouse = item.spouse || "";
    const isBday = item.type === "BIRTHDAY";

    if (item.diffDays === 0) {
      return isBday
        ? `Dear ${personName}, wishing you a very Happy Birthday! 🎂🎉 - Best wishes from ${clubTitle}`
        : `Dear ${personName} ${
            spouse ? `& ${spouse}` : ""
          }, wishing you both a very Happy Wedding Anniversary! 💍✨ - Best wishes from ${clubTitle}`;
    } else if (item.diffDays > 0) {
      return isBday
        ? `Dear ${personName}, wishing you a very Happy Birthday in advance (${item.dateFormatted})! 🎂🎉 - from ${clubTitle}`
        : `Dear ${personName} ${
            spouse ? `& ${spouse}` : ""
          }, wishing you both a very Happy Wedding Anniversary in advance (${item.dateFormatted})! 💍✨ - from ${clubTitle}`;
    } else {
      return isBday
        ? `Dear ${personName}, wishing you a very Happy Belated Birthday! 🎂 - from ${clubTitle}`
        : `Dear ${personName} ${
            spouse ? `& ${spouse}` : ""
          }, wishing you both a Happy Belated Wedding Anniversary! 💍✨ - from ${clubTitle}`;
    }
  };

  const generateWhatsAppUrl = (item, customMsg = null) => {
    const m = item.member;
    const rawPhone = (m.mobile_number || m.phone || "").replace(/[^0-9]/g, "");
    if (!rawPhone) return null;
    const text = generateWishText(item, customMsg);
    return `https://wa.me/91${rawPhone}?text=${encodeURIComponent(text)}`;
  };

  const generateSmsUrl = (item, customMsg = null) => {
    const m = item.member;
    const rawPhone = (m.mobile_number || m.phone || "").replace(/[^0-9]/g, "");
    if (!rawPhone) return null;
    const text = generateWishText(item, customMsg);
    return `sms:${rawPhone}?body=${encodeURIComponent(text)}`;
  };

  const handleSendBottomWhatsApp = () => {
    if (!activeSelectedEvent) return;
    const m = activeSelectedEvent.member;
    const rawPhone = (m.mobile_number || m.phone || "").replace(/[^0-9]/g, "");
    if (!rawPhone) {
      alert("No mobile number registered for this member.");
      return;
    }
    const url = `https://wa.me/91${rawPhone}?text=${encodeURIComponent(
      messageText
    )}`;
    window.open(url, "_blank");
  };

  const handleSendBottomSMS = () => {
    if (!activeSelectedEvent) return;
    const m = activeSelectedEvent.member;
    const rawPhone = (m.mobile_number || m.phone || "").replace(/[^0-9]/g, "");
    if (!rawPhone) {
      alert("No mobile number registered for this member.");
      return;
    }
    window.location.href = `sms:${rawPhone}?body=${encodeURIComponent(
      messageText
    )}`;
  };

  return (
    <aside className="celebrations-constant-card">
      {/* 1. Header with Badge & Title */}
      <div className="celebrations-card-header">
        <div className="celebrations-header-title-box">
          <div className="celebrations-header-icon">
            <PartyPopper size={18} />
          </div>
          <div>
            <h4 className="celebrations-header-title">Celebrations & Wishes</h4>
            <span className="celebrations-header-subtitle">
              Member Birthdays & Anniversaries
            </span>
          </div>
        </div>
        <span className="celebrations-total-pill">
          {allEvents.length} Total
        </span>
      </div>

      {/* 2. Sub-Tabs inside the Card: All, Birthday, Wedding Day */}
      <div className="celebrations-card-tabs">
        <button
          type="button"
          className={`celebration-subtab-btn ${
            activeTab === "ALL" ? "active" : ""
          }`}
          onClick={() => setActiveTab("ALL")}
        >
          <span>🎉 All</span>
          <span className="tab-badge">{allEvents.length}</span>
        </button>

        <button
          type="button"
          className={`celebration-subtab-btn ${
            activeTab === "BIRTHDAYS" ? "active" : ""
          }`}
          onClick={() => setActiveTab("BIRTHDAYS")}
        >
          <span>🎂 Birthday</span>
          <span className="tab-badge">{birthdayCount}</span>
        </button>

        <button
          type="button"
          className={`celebration-subtab-btn ${
            activeTab === "ANNIVERSARIES" ? "active" : ""
          }`}
          onClick={() => setActiveTab("ANNIVERSARIES")}
        >
          <span>💍 Wedding Day</span>
          <span className="tab-badge">{anniversaryCount}</span>
        </button>
      </div>

      {/* 3. Row-by-Row Celebrants Listing (Scrollable) */}
      <div className="celebrations-rows-container">
        {filteredEvents.length === 0 ? (
          <div className="celebrations-empty-box">
            <Cake size={32} color="#cbd5e1" />
            <p>No celebration records found for this tab.</p>
          </div>
        ) : (
          filteredEvents.map((item) => {
            const m = item.member;
            const personName =
              m.person_name || m.fullName || m.business_name || "Member";
            const isBday = item.type === "BIRTHDAY";
            const isToday = item.diffDays === 0;
            const isSelected = activeSelectedEvent?.id === item.id;
            const waUrl = generateWhatsAppUrl(item);
            const smsUrl = generateSmsUrl(item);

            // For Wedding: "Raj & Shanthi Wedding Day"
            const rowTitle = isBday
              ? personName
              : `${personName}${item.spouse ? ` & ${item.spouse}` : ""} Wedding Day`;

            return (
              <div
                key={item.id}
                className={`celebration-row-item ${
                  isToday ? "is-today" : ""
                } ${isSelected ? "is-selected" : ""}`}
                onClick={() => {
                  setSelectedEventId(item.id);
                  if (onSelectCelebrantForMessage) {
                    onSelectCelebrantForMessage(item);
                  }
                }}
              >
                {/* Left Icon / Type Badge */}
                <div
                  className={`celebration-row-icon ${
                    isBday ? "bday-icon" : "anni-icon"
                  }`}
                  title={isBday ? "Birthday" : "Wedding Anniversary"}
                >
                  {isBday ? "🎂" : "💍"}
                </div>

                {/* Middle Info */}
                <div className="celebration-row-info">
                  <div className="celebration-row-name-wrap">
                    <Link
                      to={`${basePath}/member/${m.id}`}
                      className="celebration-row-name"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rowTitle}
                    </Link>
                  </div>

                  <div className="celebration-row-meta">
                    <span
                      className={`celebration-status-pill ${
                        isToday
                          ? "status-today"
                          : item.diffDays === 1
                          ? "status-tomorrow"
                          : item.diffDays > 0
                          ? "status-upcoming"
                          : "status-past"
                      }`}
                    >
                      {isToday
                        ? "TODAY"
                        : item.diffDays === 1
                        ? "Tomorrow"
                        : item.dateFormatted}
                    </span>
                    <span className="celebration-club">
                      {m.clubName || "Club Member"}
                    </span>
                  </div>
                </div>

                {/* Right Quick Wish Actions: WhatsApp & SMS */}
                <div className="celebration-row-actions">
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="celebration-quick-wish-btn"
                      onClick={(e) => e.stopPropagation()}
                      title={`Send WhatsApp wish to ${personName}`}
                    >
                      <FaWhatsapp size={13} />
                      <span>Wish</span>
                    </a>
                  )}

                  {smsUrl && (
                    <a
                      href={smsUrl}
                      className="celebration-quick-sms-btn"
                      onClick={(e) => e.stopPropagation()}
                      title={`Send SMS wish to ${personName}`}
                    >
                      <MessageSquare size={13} />
                      <span>SMS</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Fixed "Send Message" at the bottom of the Card (WhatsApp & SMS) */}
      {activeSelectedEvent && (
        <div className="celebrations-bottom-fixed-sender">
          <div className="sender-target-header">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.9rem" }}>
                {activeSelectedEvent.type === "BIRTHDAY" ? "🎂" : "💍"}
              </span>
              <span className="sender-target-name">
                Wishing:{" "}
                <strong>
                  {activeSelectedEvent.type === "BIRTHDAY"
                    ? activeSelectedEvent.member.person_name ||
                      activeSelectedEvent.member.fullName ||
                      activeSelectedEvent.member.business_name ||
                      "Member"
                    : `${
                        activeSelectedEvent.member.person_name ||
                        activeSelectedEvent.member.fullName ||
                        activeSelectedEvent.member.business_name ||
                        "Member"
                      }${
                        activeSelectedEvent.spouse
                          ? ` & ${activeSelectedEvent.spouse}`
                          : ""
                      } Wedding Day`}
                </strong>
              </span>
            </div>
            <span className="sender-target-date">
              {activeSelectedEvent.dateFormatted}
            </span>
          </div>

          <div className="sender-textarea-wrapper">
            <textarea
              className="sender-message-input"
              rows={2}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your celebration greetings..."
            />
          </div>

          <div
            className="sender-action-row"
            style={{ display: "flex", gap: "8px" }}
          >
            <button
              type="button"
              className="sender-whatsapp-btn"
              onClick={handleSendBottomWhatsApp}
              style={{ flex: 1 }}
            >
              <FaWhatsapp size={15} />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              className="sender-sms-btn"
              onClick={handleSendBottomSMS}
              style={{ flex: 1 }}
            >
              <MessageSquare size={15} />
              <span>Normal SMS</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
