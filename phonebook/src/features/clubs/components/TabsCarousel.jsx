// src/features/clubs/components/TabsCarousel.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./css/TabsCarousel.css";

  
export const isPriorityTab = (tab) => {
  if (!tab) return false;
  const label = (tab.label || tab.title || "").trim().toLowerCase();
  const id = (tab.id || "").toLowerCase();

  // 1. District Governor (DG)
  if (
    label === "district governor (dg)" ||
    label === "dg" ||
    label === "district governor" ||
    id === "post_dg" ||
    id === "dg"
  ) {
    return true;
  }

  // 2. Region Chairperson (RC)
  if (
    label === "region chairperson (rc)" ||
    label === "rc" ||
    label.startsWith("region chairperson") ||
    label.startsWith("region chair") ||
    id === "post_rc" ||
    id === "rc"
  ) {
    return true;
  }

  // 3. Zone Chairperson (ZC)
  if (
    label === "zone chairperson (zc)" ||
    label === "zc" ||
    label.startsWith("zone chairperson") ||
    label.startsWith("zone chair") ||
    id === "post_zc" ||
    id === "zc"
  ) {
    return true;
  }

  // 4. President (matches President, Charter President, etc., but NOT Vice President)
  if (
    (label === "president" ||
      label.includes("president") ||
      id === "post_president" ||
      id === "post_cp") &&
    !label.includes("vice")
  ) {
    return true;
  }

  // 5. Secretary (matches Secretary, Charter Secretary, but NOT Joint/Assistant Secretary)
  if (
    (label === "secretary" ||
      label.includes("secretary") ||
      id === "post_secretary" ||
      id === "post_cs") &&
    !label.includes("joint") &&
    !label.includes("assistant")
  ) {
    return true;
  }

  // 6. Treasurer (matches Treasurer, Charter Treasurer, but NOT Joint/Assistant Treasurer)
  if (
    (label === "treasurer" ||
      label.includes("treasurer") ||
      id === "post_treasurer" ||
      id === "post_ct") &&
    !label.includes("joint") &&
    !label.includes("assistant")
  ) {
    return true;
  }

  return false;
};

export default function TabsCarousel({
  tabs = [],
  activeTabId,
  onSelectTab,
  isLoading = false,
  className = "",
  defaultShowAll = false,
}) {
  const [showAll, setShowAll] = useState(defaultShowAll);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  // When collapsed, only show the priority 6 tabs + currently active tab (so active selection is never lost)
  const priorityTabs = tabs.filter(
    (tab) => isPriorityTab(tab) || tab.id === activeTabId
  );

  // Fallback to all tabs if no priority tabs are present in dataset
  const displayedTabs = showAll
    ? tabs
    : priorityTabs.length > 0
    ? priorityTabs
    : tabs;

  const canToggle = tabs.length > displayedTabs.length || showAll;
  const hiddenCount = tabs.length - displayedTabs.length;

  return (
    <div className={`tabs-rows-wrapper ${className}`}>
      <div className="tabs-rows-track" role="tablist">
        {displayedTabs.map((tab) => {
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

        {/* Show / Hide Toggle Button with Icon */}
        {canToggle && (
          <button
            type="button"
            className={`tab-toggle-btn ${showAll ? "expanded" : "collapsed"}`}
            onClick={() => setShowAll((prev) => !prev)}
            title={showAll ? "Hide other tabs" : `Show all ${tabs.length} tabs`}
            aria-expanded={showAll}
          >
            {showAll ? (
              <>
                <ChevronUp size={16} className="tab-toggle-icon" />
                <span className="tab-toggle-label">Hide</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} className="tab-toggle-icon" />
                <span className="tab-toggle-label">
                  Show More {hiddenCount > 0 ? `(${hiddenCount})` : ""}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
