// src/features/clubs/components/EventsNewsCard.jsx
import React, { useState } from "react";
import {
  Calendar,
  ArrowRight,
  Search,
  X,
  MapPin,
  Clock,
} from "lucide-react";
import "./css/EventsNewsCard.css";

// Constant events data exactly as shown in the design
export const CONSTANT_EVENTS = [
  {
    id: "evt-1",
    day: "12",
    month: "Oct",
    title: "Service Camp – Health & Wellness",
    description: "Free health check-up and wellness awareness camp.",
    location: "Chennai, TN",
    time: "9:00 AM – 4:00 PM",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80",
    tags: ["service", "health", "camp"],
  },
  {
    id: "evt-2",
    day: "18",
    month: "Oct",
    title: "Community Service – Tree Plantation",
    description: "Join us in planting trees for a cleener environment.",
    location: "Coimbatore, TN",
    time: "8:00 AM – 12:00 PM",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=80",
    tags: ["service", "trees", "community"],
  },
  {
    id: "evt-3",
    day: "26",
    month: "Oct",
    title: "Food Distribution Service",
    description: "Supporting underprivileged families in our community.",
    location: "Madurai, TN",
    time: "10:00 AM – 1:00 PM",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&auto=format&fit=crop&q=80",
    tags: ["service", "food", "distribution"],
  },
];

// Constant news data for the News tab
export const CONSTANT_NEWS = [
  {
    id: "news-1",
    day: "05",
    month: "Nov",
    title: "District Leadership Seminar 2026",
    description: "Empowering upcoming club leaders with strategic service goals.",
    location: "Trichy, TN",
    time: "9:30 AM – 1:00 PM",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&auto=format&fit=crop&q=80",
    tags: ["leadership", "seminar"],
  },
  {
    id: "news-2",
    day: "28",
    month: "Oct",
    title: "Statewide Blood Donation Milestone",
    description: "Over 500 donors participated across 10 coordinated district units.",
    location: "Salem, TN",
    time: "10:00 AM – 4:00 PM",
    image:
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=300&auto=format&fit=crop&q=80",
    tags: ["blood", "donation"],
  },
  {
    id: "news-3",
    day: "15",
    month: "Oct",
    title: "Youth Skill Empowerment Workshop",
    description: "Vocational guidance and digital skills workshop for rural students.",
    location: "Tirunelveli, TN",
    time: "2:00 PM – 5:30 PM",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&auto=format&fit=crop&q=80",
    tags: ["youth", "education"],
  },
];

export default function EventsNewsCard({ clubSlug = "lions" }) {
  const [activeTab, setActiveTab] = useState("Events"); // "Events" or "News"
  const [searchQuery, setSearchQuery] = useState("service"); // Initial query as in the design screenshot
  const [isSearchingInput, setIsSearchingInput] = useState(false);

  const rawList = activeTab === "Events" ? CONSTANT_EVENTS : CONSTANT_NEWS;

  // Filter based on searchQuery
  const filteredList = rawList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleViewAll = () => {
    setSearchQuery("");
  };

  return (
    <div className="events-news-card">
      {/* Header */}
      <div className="events-news-header">
        <div className="events-news-title-wrap">
          <Calendar size={22} className="events-news-icon" />
          <h3 className="events-news-title">Events & News</h3>
        </div>

        <button
          type="button"
          className="events-news-view-all-btn"
          onClick={handleViewAll}
          title="View All"
        >
          <span>View All</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="events-news-tabs">
        <button
          type="button"
          className={`events-news-tab-btn ${activeTab === "Events" ? "active" : ""}`}
          onClick={() => setActiveTab("Events")}
        >
          Events
        </button>
        <button
          type="button"
          className={`events-news-tab-btn ${activeTab === "News" ? "active" : ""}`}
          onClick={() => setActiveTab("News")}
        >
          News
        </button>
      </div>

      {/* Filter / Search Status Bar */}
      {searchQuery ? (
        <div className="events-news-filter-bar">
          <span className="events-news-filter-text">
            <Search size={15} className="events-news-filter-icon" />
            Showing results for "{searchQuery}"
          </span>
          <button
            type="button"
            className="events-news-clear-btn"
            onClick={handleClear}
            title="Clear filter"
          >
            Clear <X size={14} />
          </button>
        </div>
      ) : isSearchingInput ? (
        <div className="events-news-search-box">
          <Search size={15} className="events-news-filter-icon" />
          <input
            type="text"
            placeholder="Search events or news..."
            value={searchQuery}
            autoFocus
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => {
              if (!searchQuery.trim()) setIsSearchingInput(false);
            }}
          />
          <button
            type="button"
            className="events-news-clear-btn"
            onClick={() => setIsSearchingInput(false)}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "-8px",
            marginBottom: "-4px",
          }}
        >
          <button
            type="button"
            className="events-news-clear-btn"
            style={{ fontSize: "0.78rem" }}
            onClick={() => setIsSearchingInput(true)}
          >
            <Search size={13} /> Filter list
          </button>
        </div>
      )}

      {/* List */}
      <div className="events-news-list">
        {filteredList.length === 0 ? (
          <div className="events-news-empty">
            <p>No {activeTab.toLowerCase()} found matching "{searchQuery}".</p>
            <button
              type="button"
              className="events-news-clear-btn"
              style={{ textDecoration: "underline", margin: "4px auto 0" }}
              onClick={handleClear}
            >
              Show all {activeTab.toLowerCase()}
            </button>
          </div>
        ) : (
          filteredList.map((item) => (
            <div key={item.id} className="events-news-item">
              {/* Thumbnail */}
              <div className="events-news-thumb-box">
                <img
                  src={item.image}
                  alt={item.title}
                  className="events-news-thumb-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Date Badge */}
              <div className="events-news-date-badge">
                <span className="events-news-date-day">{item.day}</span>
                <span className="events-news-date-month">{item.month}</span>
              </div>

              {/* Info Details */}
              <div className="events-news-item-info">
                <h4 className="events-news-item-title">{item.title}</h4>
                <p className="events-news-item-desc">{item.description}</p>
                <div className="events-news-meta-row">
                  <span className="events-news-meta-item">
                    <MapPin size={13} className="events-news-meta-icon" />
                    {item.location}
                  </span>
                  <span className="events-news-meta-item">
                    <Clock size={13} className="events-news-meta-icon" />
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
