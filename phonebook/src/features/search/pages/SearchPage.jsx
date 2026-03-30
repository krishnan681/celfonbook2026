// import { useSearchController } from "../controller/useSearchController";
// import SearchBar from "../components/SearchBar";
// import SearchFilters from "../components/SearchFilters";
// import SearchResults from "../components/SearchResults";
// import Pagination from "../components/Pagination";
// import "./css/search.css";

// const SearchPage = () => {
//   const {
//     results,
//     loading,
//     filters,
//     setFilters,
//     page,
//     setPage,
//     totalPages,
//     totalCount
//   } = useSearchController();

//   return (
//     <div className="search-wrapper">
//       <SearchBar filters={filters} setFilters={setFilters} />

//       <div className="search-layout">

//         {/* LEFT SIDEBAR */}
//         <aside className="search-sidebar">
//           <SearchFilters filters={filters} setFilters={setFilters} />
//         </aside>

//         {/* RIGHT CONTENT */}
//         <main className="search-content">
//           <div className="results-header">
//             <h3>{totalCount} Results Found</h3>
//           </div>

//           <SearchResults results={results} loading={loading} />

//           <Pagination
//             page={page}
//             totalPages={totalPages}
//             setPage={setPage}
//           />
//         </main>

//       </div>
//     </div>
//   );
// };

// export default SearchPage;


import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSearchController } from "../controller/useSearchController";
import SearchBar from "../components/SearchBar";
import SearchFilters from "../components/SearchFilters";
import SearchResults from "../components/SearchResults";
import Pagination from "../components/Pagination";
import { SlidersHorizontal } from "lucide-react";
import { FaFire } from "react-icons/fa";
import { MdAddBusiness } from "react-icons/md";
import "./css/search.css";

const SearchPage = () => {

  const navigate = useNavigate();

  const {
    results,
    loading,
    filters,
    setFilters,
    page,
    setPage,
    totalPages,
    isKeywordFocused,
    setIsKeywordFocused
  } = useSearchController();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const popularKeywords = [
    "CNC Machine",
    "Fabrication",
    "Auto Garage",
    "Engineering Works",
    "Polymers",
    "Industrial Suppliers",
    "Consultants",
    "Automation"
  ];

  return (
    <div className="search-wrapper">

      {/* HEADER */}
      <header className="header-layout">
        <SearchBar
          filters={filters}
          setFilters={(newFilters) => {
            setFilters(newFilters);
            setSelectedCategory(null); // reset category when typing
          }}
          setIsKeywordFocused={setIsKeywordFocused}
        />
      </header>

      <div className="search-layout-grid">

        {/* LEFT COLUMN */}
        <main className="search-results-column">

          {/* RESULTS HEADER */}
          <div className="results-label">

            <h3>
              {selectedCategory
                ? `Search results for ${selectedCategory}:`
                : "Search results"}
            </h3>

            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} />
            </button>

          </div>

          {/* FILTER DROPDOWN */}
          {showFilters && (
            <div className="filter-dropdown">
              <SearchFilters filters={filters} setFilters={setFilters} />
            </div>
          )}

          {/* RESULTS GRID */}
          <SearchResults
            results={results}
            loading={loading}
            isKeywordFocused={isKeywordFocused}
          />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </div>
          )}

        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="directory-sidebar">

          <div className="sidebar-sticky-container">

            {/* POPULAR CATEGORIES */}
            <div className="sidebar-box popular-keywords">

              <h4>
                <FaFire color="#f97316" /> Popular Categories
              </h4>

             <div className="keywords-grid">
  {popularKeywords.map((k, idx) => (
    <div key={idx} className="popular-chip-wrapper">
      <button
        className={`popular-chip ${selectedCategory === k ? "active" : ""}`}
        disabled={selectedCategory && selectedCategory !== k}
        onClick={() => {
          setFilters({ ...filters, keywords: k });
          setSelectedCategory(k);
        }}
      >
        {k}
      </button>

      {/* Show close button if this is the selected category */}
      {selectedCategory === k && (
        <button
          className="chip-close-btn"
          onClick={() => {
            setSelectedCategory(null);
            setFilters({ ...filters, keywords: "" });
          }}
        >
          ×
        </button>
      )}
    </div>
  ))}
</div>

            </div>

            {/* PROMO BOX */}
            <div className="sidebar-box promo-box">

              <div className="promo-icon">
                <MdAddBusiness />
              </div>

              <h4>Grow Your Network</h4>

              <p>
                Reach more buyers and sellers. List your business today and get verified.
              </p>

              <button
                className="list-business-btn"
                onClick={() => navigate("/Partner")}
              >
                List Your Business
              </button>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
};

export default SearchPage;