import React from "react";
import "../components/css/pagination.css";

const Pagination = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  // Scroll to top when page changes (helpful for UX)
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="pagination-container" aria-label="Page navigation">
      <button
        className="pagination-btn"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        <span className="arrow">←</span> Prev
      </button>

      <div className="pagination-info">
        <span className="current-page">{page}</span>
        <span className="separator">of</span>
        <span className="total-pages">{totalPages}</span>
      </div>

      <button
        className="pagination-btn"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Next <span className="arrow">→</span>
      </button>
    </nav>
  );
};

export default Pagination;