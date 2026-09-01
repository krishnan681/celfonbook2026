// src/features/clubs/components/TabsCarousel.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./css/TabsCarousel.css";

export default function TabsCarousel({
  tabs = [],
  activeTabId,
  onSelectTab,
  isLoading = false,
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll boundary visibility for arrows and gradient masks
  const checkScrollBoundaries = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScrollBoundaries();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollBoundaries);
    window.addEventListener("resize", checkScrollBoundaries);
    return () => {
      el.removeEventListener("scroll", checkScrollBoundaries);
      window.removeEventListener("resize", checkScrollBoundaries);
    };
  }, [checkScrollBoundaries, tabs]);

  // Scroll active tab into view when activeTabId changes
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const activeEl = el.querySelector(`.filter-tab-btn[data-tab-id="${activeTabId}"]`);
    if (activeEl) {
      const containerRect = el.getBoundingClientRect();
      const tabRect = activeEl.getBoundingClientRect();
      const tabCenter = tabRect.left + tabRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const scrollOffset = tabCenter - containerCenter;

      el.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  }, [activeTabId]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -220,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 220,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="tabs-carousel-wrapper">
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          type="button"
          className="tabs-carousel-arrow left"
          onClick={handleScrollLeft}
          aria-label="Scroll Tabs Left"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Scrollable Track */}
      <div
        className="tabs-carousel-track"
        ref={scrollContainerRef}
        role="tablist"
      >
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
              onClick={() => onSelectTab(tab.id)}
              title={tab.title || tab.label}
            >
              {IconComponent && <IconComponent size={16} className="tab-btn-icon" />}
              <span className="tab-btn-label">{tab.label}</span>
              {!isLoading && typeof tab.count === "number" && (
                <span className="filter-tab-count">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          type="button"
          className="tabs-carousel-arrow right"
          onClick={handleScrollRight}
          aria-label="Scroll Tabs Right"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
