import { FiSearch } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbTag } from "react-icons/tb";
import "../components/css/SearchBar.css";

const SearchBar = ({ filters, setFilters, setIsKeywordFocused }) => {
  return (
    <div className="directory-search-bar">

      <div className="search-input-group">

        <div className="search-input-field">
          <HiOutlineBuildingOffice2 className="search-icon" />
          <input
            type="text"
            placeholder="Search Business / Person"
            value={filters.businessName}
            onChange={(e) =>
              setFilters({ ...filters, businessName: e.target.value })
            }
          />
        </div>

        <div className="search-input-field">
          <TbTag className="search-icon" />
          <input
            type="text"
            placeholder="Search Keywords"
            value={filters.keywords}
            onFocus={() => setIsKeywordFocused(true)}
            onBlur={() => setIsKeywordFocused(false)}
            onChange={(e) =>
              setFilters({ ...filters, keywords: e.target.value })
            }
          />
        </div>

      </div>

      <button className="search-btn">
        <FiSearch />
        Search
      </button>

    </div>
  );
};

export default SearchBar;