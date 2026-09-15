// src/features/clubs/components/TabsCarousel.jsx
import React from "react";
import "./css/TabsCarousel.css";

export default function TabsCarousel({
  tabs = [],
  activeTabId,
  onSelectTab,
  isLoading = false,
  className = "",
}) {
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className={`tabs-rows-wrapper ${className}`}>
      <div className="tabs-rows-track" role="tablist">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTabId === tab.id;

          return (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`filter-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectTab && onSelectTab(tab.id)}
              title={tab.title || tab.label}
            >
              {IconComponent && (
                <IconComponent size={16} className="tab-btn-icon" />
              )}
              <span className="tab-btn-label">{tab.label}</span>
              {!isLoading && typeof tab.count === "number" && (
                <span className="filter-tab-count">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
