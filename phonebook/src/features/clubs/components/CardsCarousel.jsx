// src/features/clubs/components/CardsCarousel.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
import "./css/CardsCarousel.css";

export default function CardsCarousel({
  items = [],
  renderItem,
  itemKey = (item, idx) => item?.id || idx,
  title = "",
  badge = null,
  emptyMessage = "No items to display.",
  defaultViewMode = "carousel", // "carousel" or "grid"
  enableViewToggle = true,
  itemsPerPageDesktop = 3,
  itemsPerPageTablet = 2,
  itemsPerPageMobile = 1,
}) {
  const [viewMode, setViewMode] = useState(defaultViewMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  // Responsive items per view detection
  const updateItemsPerView = useCallback(() => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    if (width < 640) {
      setItemsPerView(itemsPerPageMobile);
    } else if (width < 1024) {
      setItemsPerView(itemsPerPageTablet);
    } else {
      setItemsPerView(itemsPerPageDesktop);
    }
  }, [itemsPerPageMobile, itemsPerPageTablet, itemsPerPageDesktop]);

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [updateItemsPerView]);

  // Reset index when items or length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  const totalItems = items.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerView));
  const currentPage = Math.min(
    totalPages,
    Math.floor(currentIndex / itemsPerView) + 1
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerView));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + itemsPerView));
  };

  const goToSlide = (pageIndex) => {
    const targetIdx = Math.min(maxIndex, pageIndex * itemsPerView);
    setCurrentIndex(targetIdx);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const deltaX = touchStartX.current - touchEndX.current;
    const threshold = 40; // minimum swipe distance

    if (deltaX > threshold) {
      // Swiped Left -> Next
      if (currentIndex < maxIndex) {
        handleNext();
      }
    } else if (deltaX < -threshold) {
      // Swiped Right -> Prev
      if (currentIndex > 0) {
        handlePrev();
      }
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="cards-carousel-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Calculate translateX percentage for smooth sliding
  // Each item width percentage = 100 / itemsPerView
  const itemWidthPercent = 100 / itemsPerView;
  const translatePercent = currentIndex * itemWidthPercent;

  return (
    <div className="cards-carousel-root">
      {/* Optional Header controls bar */}
      {(title || enableViewToggle || badge) && (
        <div className="cards-carousel-header">
          <div className="cards-carousel-title-box">
            {title && <h4 className="cards-carousel-title">{title}</h4>}
            {badge && <span className="cards-carousel-badge">{badge}</span>}
          </div>

          <div className="cards-carousel-actions">
            {/* View Mode Toggle Button */}
            {enableViewToggle && (
              <div className="carousel-view-toggle">
                <button
                  type="button"
                  className={`view-toggle-btn ${
                    viewMode === "carousel" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("carousel")}
                  title="Carousel Slider View"
                >
                  <SlidersHorizontal size={15} />
                  <span className="toggle-label">Carousel</span>
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${
                    viewMode === "grid" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                  <span className="toggle-label">Grid</span>
                </button>
              </div>
            )}

            {/* Desktop Navigation Arrows (Carousel Mode only) */}
            {viewMode === "carousel" && totalItems > itemsPerView && (
              <div className="carousel-nav-arrows">
                <button
                  type="button"
                  className="carousel-nav-btn prev"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="carousel-counter">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  className="carousel-nav-btn next"
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  aria-label="Next Slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid Mode Rendering */}
      {viewMode === "grid" ? (
        <div className="cards-grid">
          {items.map((item, idx) => (
            <div key={itemKey(item, idx)} className="carousel-grid-item">
              {renderItem(item, idx)}
            </div>
          ))}
        </div>
      ) : (
        /* Carousel Mode Rendering */
        <div
          className="cards-carousel-viewport"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="cards-carousel-track"
            style={{
              transform: `translateX(-${translatePercent}%)`,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={itemKey(item, idx)}
                className="cards-carousel-slide"
                style={{
                  flex: `0 0 ${itemWidthPercent}%`,
                  maxWidth: `${itemWidthPercent}%`,
                }}
              >
                <div className="slide-content-wrapper">
                  {renderItem(item, idx)}
                </div>
              </div>
            ))}
          </div>

          {/* Floating Mobile/Tablet Prev/Next overlay controls for touch or quick tap */}
          {totalItems > itemsPerView && (
            <>
              {currentIndex > 0 && (
                <button
                  type="button"
                  className="carousel-floating-nav left"
                  onClick={handlePrev}
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              {currentIndex < maxIndex && (
                <button
                  type="button"
                  className="carousel-floating-nav right"
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Slide Pagination Dots (Carousel Mode only) */}
      {viewMode === "carousel" && totalPages > 1 && (
        <div className="cards-carousel-pagination">
          {Array.from({ length: totalPages }).map((_, pIdx) => {
            const isActive = currentPage === pIdx + 1;
            return (
              <button
                key={pIdx}
                type="button"
                className={`carousel-dot ${isActive ? "active" : ""}`}
                onClick={() => goToSlide(pIdx)}
                aria-label={`Go to slide ${pIdx + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
