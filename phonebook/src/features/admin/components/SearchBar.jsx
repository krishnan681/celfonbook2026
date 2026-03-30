// src/features/admin/components/SearchBar.jsx
import { useState, useEffect, useMemo } from "react";
import '../css/SearchBar.css';

export default function SearchBar({ 
  profiles, 
  selected, 
  onSelect, 
  isLoading, 
  totalCount, 
  currentPage, 
  itemsPerPage, 
  goToPage 
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return profiles;
    return profiles.filter((p) =>
      (p.person_name || "").toLowerCase().includes(q) ||
      (p.business_name || "").toLowerCase().includes(q) ||
      (p.mobile_number || "").includes(q) ||
      (p.display_name || "").toLowerCase().includes(q)
    );
  }, [profiles, query]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const initial = (name) => (name ? name[0].toUpperCase() : "?");

  return (
    <>
      <div className="adm-list-header">
        <div className="adm-search-wrap">
          <span className="adm-search-icon">⌕</span>
          <input
            className="adm-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, biz, phone…"
          />
        </div>
        <div className="adm-list-count">
          {totalCount.toLocaleString()} total • Page {currentPage}
        </div>
      </div>

      <div className="adm-profiles-scroll">
        {isLoading ? (
          <div style={{ padding: "24px", color: "#64748b", fontSize: 13 }}>Loading profiles...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "24px", color: "#64748b", fontSize: 13 }}>No results found</div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className={`adm-profile-row ${selected?.id === p.id ? "active" : ""}`}
              onClick={() => onSelect(p)}
            >
              <div className="adm-avatar">{initial(p.display_name || p.person_name || p.business_name)}</div>
              <div className="adm-profile-info">
                <div className="adm-pname">{p.display_name || p.person_name || "—"}</div>
                <div className="adm-pbiz">{p.business_name || "Individual"}</div>
                {p.mobile_number && <div className="adm-pmob">{p.mobile_number}</div>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="adm-list-pagination">
          <button 
            className="adm-pg-btn" 
            disabled={currentPage === 1} 
            onClick={() => goToPage(currentPage - 1)}
          >
            ← Previous
          </button>
          <span className="adm-pg-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="adm-pg-btn" 
            disabled={currentPage === totalPages} 
            onClick={() => goToPage(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}