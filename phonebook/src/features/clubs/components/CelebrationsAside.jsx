import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cake, PartyPopper, MessageSquare, Calendar, X, Pencil } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { formatCelebrationWishMessage } from "../utils/celebrationMessageHelper";
import { getCurrentUser } from "../../../core/services/profileService";
import { supabase } from "../../../core/config/supabaseClient";

export default function CelebrationsAside({
  timeline,
  clubTitle = "Club",
  basePath = "/clubs/lions",
  onSelectCelebrantForMessage,
}) {
  const allEvents = timeline?.all || [];

  // Determine club slug from basePath or title
  const clubSlug = basePath.toLowerCase().includes("vasavi")
    ? "vasavi"
    : basePath.toLowerCase().includes("rotary")
      ? "rotary"
      : "lions";

  // Primary Tabs: "BIRTHDAYS" (default) or "ANNIVERSARIES" (No "ALL" tab)
  const [activeTab, setActiveTab] = useState("BIRTHDAYS");

  // Sub-Filter under active tab: "TODAY", "THIS_WEEK", "THIS_MONTH", "ALL"
  const [subFilter, setSubFilter] = useState("TODAY");

  // Selected celebrant ID for the fixed bottom composer
  const [selectedEventId, setSelectedEventId] = useState("");

  // Base arrays for each category
  const bdayEvents = useMemo(
    () => allEvents.filter((e) => e.type === "BIRTHDAY"),
    [allEvents],
  );
  const anniEvents = useMemo(
    () => allEvents.filter((e) => e.type === "ANNIVERSARY"),
    [allEvents],
  );

  // Counts for Birthdays
  const todayBirthdays = useMemo(
    () => bdayEvents.filter((e) => e.diffDays === 0),
    [bdayEvents],
  );
  const thisWeekBirthdays = useMemo(
    () =>
      bdayEvents
        .filter((e) => e.diffDays >= 0 && e.diffDays <= 7)
        .sort((a, b) => a.diffDays - b.diffDays),
    [bdayEvents],
  );
  const thisMonthBirthdays = useMemo(
    () =>
      bdayEvents
        .filter((e) => e.diffDays >= 0 && e.diffDays <= 30)
        .sort((a, b) => a.diffDays - b.diffDays),
    [bdayEvents],
  );

  // Counts for Anniversaries
  const todayAnniversaries = useMemo(
    () => anniEvents.filter((e) => e.diffDays === 0),
    [anniEvents],
  );
  const thisWeekAnniversaries = useMemo(
    () =>
      anniEvents
        .filter((e) => e.diffDays >= 0 && e.diffDays <= 7)
        .sort((a, b) => a.diffDays - b.diffDays),
    [anniEvents],
  );
  const thisMonthAnniversaries = useMemo(
    () =>
      anniEvents
        .filter((e) => e.diffDays >= 0 && e.diffDays <= 30)
        .sort((a, b) => a.diffDays - b.diffDays),
    [anniEvents],
  );

  // Active sub-filter counts
  const currentCounts =
    activeTab === "BIRTHDAYS"
      ? {
          TODAY: todayBirthdays.length,
          THIS_WEEK: thisWeekBirthdays.length,
          THIS_MONTH: thisMonthBirthdays.length,
          ALL: bdayEvents.length,
        }
      : {
          TODAY: todayAnniversaries.length,
          THIS_WEEK: thisWeekAnniversaries.length,
          THIS_MONTH: thisMonthAnniversaries.length,
          ALL: anniEvents.length,
        };

  // If "TODAY" has 0 records, auto-fallback to THIS_WEEK or ALL smoothly if available
  useEffect(() => {
    if (activeTab === "BIRTHDAYS") {
      if (
        todayBirthdays.length === 0 &&
        thisWeekBirthdays.length > 0 &&
        subFilter === "TODAY"
      ) {
        setSubFilter("THIS_WEEK");
      } else if (
        todayBirthdays.length === 0 &&
        thisWeekBirthdays.length === 0 &&
        bdayEvents.length > 0 &&
        subFilter === "TODAY"
      ) {
        setSubFilter("ALL");
      }
    } else if (activeTab === "ANNIVERSARIES") {
      if (
        todayAnniversaries.length === 0 &&
        thisWeekAnniversaries.length > 0 &&
        subFilter === "TODAY"
      ) {
        setSubFilter("THIS_WEEK");
      } else if (
        todayAnniversaries.length === 0 &&
        thisWeekAnniversaries.length === 0 &&
        anniEvents.length > 0 &&
        subFilter === "TODAY"
      ) {
        setSubFilter("ALL");
      }
    }
  }, [
    activeTab,
    todayBirthdays.length,
    thisWeekBirthdays.length,
    bdayEvents.length,
    todayAnniversaries.length,
    thisWeekAnniversaries.length,
    anniEvents.length,
  ]);

  // Compute filtered events based on activeTab and subFilter
  const filteredEvents = useMemo(() => {
    const list = activeTab === "BIRTHDAYS" ? bdayEvents : anniEvents;
    if (subFilter === "TODAY") {
      return list.filter((e) => e.diffDays === 0);
    }
    if (subFilter === "THIS_WEEK") {
      return list
        .filter((e) => e.diffDays >= 0 && e.diffDays <= 7)
        .sort((a, b) => a.diffDays - b.diffDays);
    }
    if (subFilter === "THIS_MONTH") {
      return list
        .filter((e) => e.diffDays >= 0 && e.diffDays <= 30)
        .sort((a, b) => a.diffDays - b.diffDays);
    }
    return list; // ALL
  }, [activeTab, subFilter, bdayEvents, anniEvents]);

  // Only select an event when explicitly clicked by user (No auto-selection)
  const activeSelectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return (
      filteredEvents.find((e) => e.id === selectedEventId) ||
      allEvents.find((e) => e.id === selectedEventId) ||
      null
    );
  }, [selectedEventId, filteredEvents, allEvents]);

  // Logged-in user name for celebration messages
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

  // Default wish template for current selected event
  const defaultWishMessage = useMemo(() => {
    if (!activeSelectedEvent) return "";
    return formatCelebrationWishMessage({
      member: activeSelectedEvent.member,
      type: activeSelectedEvent.type,
      diffDays: activeSelectedEvent.diffDays,
      dateFormatted: activeSelectedEvent.dateFormatted,
      spouse: activeSelectedEvent.spouse,
      clubSlug,
      clubTitle,
      senderName,
    });
  }, [activeSelectedEvent, clubSlug, clubTitle, senderName]);

  // Custom Message state for bottom fixed sender
  const [messageText, setMessageText] = useState("");

  // Update wish message when active event or default message changes
  useEffect(() => {
    setMessageText(defaultWishMessage);
  }, [defaultWishMessage]);

  const handleSendBottomWhatsApp = () => {
    if (!activeSelectedEvent) return;
    const m = activeSelectedEvent.member;
    const rawPhone = (m.mobile_number || m.phone || "").replace(/[^0-9]/g, "");
    if (!rawPhone) {
      alert("No mobile number registered for this member.");
      return;
    }
    const url = `https://wa.me/91${rawPhone}?text=${encodeURIComponent(messageText)}`;
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
    // Use safe link click so page state and celebrant list are preserved without page refresh
    const link = document.createElement("a");
    link.href = `sms:${rawPhone}?body=${encodeURIComponent(messageText)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const subFilterLabel =
    subFilter === "TODAY"
      ? "Today"
      : subFilter === "THIS_WEEK"
        ? "This Week"
        : "All Celebrations";

  return (
    <aside className="celebrations-constant-card">
      {/* 1. Header with Badge & Title */}
      <div className="celebrations-card-header">
        <div className="celebrations-header-title-box">
          <div className="celebrations-header-icon">
            <PartyPopper size={18} />
          </div>
          <div>
            <h4 className="celebrations-header-title">
              Celebrations &amp; Wishes
            </h4>
            <span className="celebrations-header-subtitle">
              {clubTitle} Member Celebrations
            </span>
          </div>
        </div>
        <span className="celebrations-total-pill">
          {filteredEvents.length} {subFilterLabel}
        </span>
      </div>

      {/* 2. Primary Tabs: Birthday & Wedding Day */}
      <div className="celebrations-card-tabs">
        <button
          type="button"
          className={`celebration-subtab-btn ${
            activeTab === "BIRTHDAYS" ? "active" : ""
          }`}
          onClick={() => setActiveTab("BIRTHDAYS")}
        >
          <span>🎂 Birthday</span>
          <span className="tab-badge">
            {todayBirthdays.length > 0
              ? `${todayBirthdays.length} today`
              : thisWeekBirthdays.length > 0
                ? `${thisWeekBirthdays.length} this wk`
                : bdayEvents.length}
          </span>
        </button>

        <button
          type="button"
          className={`celebration-subtab-btn ${
            activeTab === "ANNIVERSARIES" ? "active" : ""
          }`}
          onClick={() => setActiveTab("ANNIVERSARIES")}
        >
          <span>💍 Wedding Day</span>
          <span className="tab-badge">
            {todayAnniversaries.length > 0
              ? `${todayAnniversaries.length} today`
              : thisWeekAnniversaries.length > 0
                ? `${thisWeekAnniversaries.length} this wk`
                : anniEvents.length}
          </span>
        </button>
      </div>

      {/* 3. Sub-Tabs: Today, This Week, All */}
      <div className="celebrations-subfilter-bar">
        <button
          type="button"
          className={`celebrations-subfilter-chip ${
            subFilter === "TODAY" ? "active" : ""
          }`}
          onClick={() => setSubFilter("TODAY")}
        >
          <span>☀️ Today</span>
          <span className="chip-count">{currentCounts.TODAY}</span>
        </button>

        <button
          type="button"
          className={`celebrations-subfilter-chip ${
            subFilter === "THIS_WEEK" ? "active" : ""
          }`}
          onClick={() => setSubFilter("THIS_WEEK")}
        >
          <span>📅 This Week</span>
          <span className="chip-count">{currentCounts.THIS_WEEK}</span>
        </button>

        <button
          type="button"
          className={`celebrations-subfilter-chip ${
            subFilter === "ALL" ? "active" : ""
          }`}
          onClick={() => setSubFilter("ALL")}
        >
          <span>🌟 All</span>
          <span className="chip-count">{currentCounts.ALL}</span>
        </button>
      </div>

      {/* 4. Row-by-Row Celebrants Listing */}
      <div className="celebrations-rows-container">
        {filteredEvents.length === 0 ? (
          <div className="celebrations-empty-box">
            <Cake size={32} color="#cbd5e1" />
            <p>
              No{" "}
              {activeTab === "BIRTHDAYS"
                ? "birthdays"
                : "wedding anniversaries"}{" "}
              {subFilter === "TODAY"
                ? "today."
                : subFilter === "THIS_WEEK"
                  ? "this week."
                  : "found."}
            </p>
            {subFilter === "TODAY" && currentCounts.THIS_WEEK > 0 && (
              <button
                type="button"
                className="celebrations-switch-filter-btn"
                onClick={() => setSubFilter("THIS_WEEK")}
              >
                👉 View {currentCounts.THIS_WEEK} Celebrations This Week
              </button>
            )}
          </div>
        ) : (
          filteredEvents.map((item) => {
            const m = item.member;
            const personName =
              m.person_name || m.fullName || m.business_name || "Member";
            const isBday = item.type === "BIRTHDAY";
            const isToday = item.diffDays === 0;
            const isSelected = activeSelectedEvent?.id === item.id;

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
                  const newId = isSelected ? "" : item.id;
                  setSelectedEventId(newId);
                  if (onSelectCelebrantForMessage) {
                    onSelectCelebrantForMessage(newId ? item : null);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flex: 1,
                    minWidth: 0,
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
                      <span className="celebration-row-name">
                        {rowTitle}
                      </span>
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
                </div>

                {/* Quick Selection Indicator (No WhatsApp / SMS buttons on individual member rows) */}
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: isSelected ? "#005a36" : "#94a3b8",
                    fontWeight: "700",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    background: isSelected
                      ? "rgba(0, 90, 54, 0.1)"
                      : "transparent",
                    flexShrink: 0,
                  }}
                >
                  {isSelected ? "Selected ✓" : "Tap to Wish"}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Fixed "Send Message" at the bottom of the Card (WhatsApp & SMS) - ONLY shown when card is selected */}
      {activeSelectedEvent && (
        <div className="celebrations-bottom-fixed-sender">
          <div className="sender-target-header">
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "0.9rem" }}>
                {activeSelectedEvent.type === "BIRTHDAY" ? "🎂" : "💍"}
              </span>
              <span className="sender-target-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <span className="sender-target-date">
                {activeSelectedEvent.dateFormatted}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedEventId("");
                  if (onSelectCelebrantForMessage) onSelectCelebrantForMessage(null);
                }}
                title="Close Wish Message"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
           

          <div className="sender-textarea-wrapper">
            <textarea
              className="sender-message-input"
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type celebration greetings..."
            />
           <span className="sender-floating-edit-icon" title="Editable message">
              <Pencil size={13} />
            </span>
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
              <span>SMS</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
