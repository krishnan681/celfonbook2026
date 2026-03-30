// const SearchFilters = ({ filters, setFilters }) => {
//   return (
//     <div className="filters-wrapper">
//       <h4>Filters</h4>

//       <label>
//         <input
//           type="checkbox"
//           checked={filters.primeOnly}
//           onChange={(e) =>
//             setFilters({ ...filters, primeOnly: e.target.checked })
//           }
//         />
//         Prime Only
//       </label>

//       <select
//         value={filters.userType}
//         onChange={(e) =>
//           setFilters({ ...filters, userType: e.target.value })
//         }
//       >
//         <option value="">All Types</option>
//         <option value="business">Business</option>
//         <option value="person">Person</option>
//       </select>

//       <select
//         value={filters.sort}
//         onChange={(e) =>
//           setFilters({ ...filters, sort: e.target.value })
//         }
//       >
//         <option value="priority">Recommended</option>
//         <option value="prime_first">Prime First</option>
//         <option value="views">Most Viewed</option>
//         <option value="latest">Latest</option>
//       </select>

//       <div className="popular-searches">
//         <h4>Popular Searches</h4>
//         <ul>
//           <li onClick={() => setFilters({ ...filters, businessName: "Doctor" })}>Doctor</li>
//           <li onClick={() => setFilters({ ...filters, businessName: "Manufacturer" })}>Manufacturer</li>
//           <li onClick={() => setFilters({ ...filters, businessName: "Wholesaler" })}>Wholesaler</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SearchFilters;










// const SearchFilters = ({ filters, setFilters }) => {
//   return (
//     <div className="filters-inner-flex">
//       <label className="filter-control">
//         <input
//           type="checkbox"
//           checked={filters.primeOnly}
//           onChange={(e) =>
//             setFilters({ ...filters, primeOnly: e.target.checked })
//           }
//         />
//         Prime Only
//       </label>

//       <select
//         className="filter-control"
//         value={filters.userType}
//         onChange={(e) =>
//           setFilters({ ...filters, userType: e.target.value })
//         }
//       >
//         <option value="">All Types</option>
//         <option value="business">Business</option>
//         <option value="person">Person</option>
//       </select>

//       <select
//         className="filter-control"
//         value={filters.sort}
//         onChange={(e) =>
//           setFilters({ ...filters, sort: e.target.value })
//         }
//       >
//         <option value="priority">Recommended</option>
//         <option value="prime_first">Prime First</option>
//         <option value="views">Most Viewed</option>
//         <option value="latest">Latest</option>
//       </select>
      
  
//     </div>
//   );
// };

// export default SearchFilters;

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import '../components/css/SearchFilters.css'
 

const SearchFilters = ({ filters, setFilters }) => {
  const clearAllFilters = () => {
    setFilters({
      businessName: "",
      keywords: "",
      city: "",
      userType: "",
      primeOnly: false,
      sort: "priority"
    });
  };

 return (
  <div className="filters-carousel-wrapper">

    <div className="filters-header-row">

      <Swiper
        modules={[FreeMode]}
        spaceBetween={10}
        slidesPerView={"auto"}
        freeMode={true}
        grabCursor={true}
        className="filters-swiper"
      >

        {/* PRIME */}
        <SwiperSlide className="filter-slide">
          <label className="filter-chip">
            <input
              type="checkbox"
              checked={filters.primeOnly}
              onChange={(e) =>
                setFilters({ ...filters, primeOnly: e.target.checked })
              }
            />
            Prime
          </label>
        </SwiperSlide>

        {/* USER TYPE */}
        <SwiperSlide className="filter-slide">
          <div className="filter-chip">
            <select
              value={filters.userType}
              onChange={(e) =>
                setFilters({ ...filters, userType: e.target.value })
              }
            >
              <option value="">All Types</option>
              <option value="business">Business</option>
              <option value="person">Person</option>
            </select>
          </div>
        </SwiperSlide>

        {/* BUSINESS NAME */}
        <SwiperSlide className="filter-slide">
          <div className="filter-chip">
            <input
              type="text"
              placeholder="Business / Person"
              value={filters.businessName}
              onChange={(e) =>
                setFilters({ ...filters, businessName: e.target.value })
              }
            />
          </div>
        </SwiperSlide>

        {/* KEYWORDS */}
        <SwiperSlide className="filter-slide">
          <div className="filter-chip">
            <input
              type="text"
              placeholder="Keywords"
              value={filters.keywords}
              onChange={(e) =>
                setFilters({ ...filters, keywords: e.target.value })
              }
            />
          </div>
        </SwiperSlide>

        {/* CITY */}
        <SwiperSlide className="filter-slide">
          <div className="filter-chip">
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) =>
                setFilters({ ...filters, city: e.target.value })
              }
            />
          </div>
        </SwiperSlide>

        {/* SORT */}
        <SwiperSlide className="filter-slide">
          <div className="filter-chip">
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters({ ...filters, sort: e.target.value })
              }
            >
              <option value="priority">Recommended</option>
              <option value="views">Most Viewed</option>
              <option value="latest">Latest</option>
            </select>
          </div>
        </SwiperSlide>

      </Swiper>

      <div className="filters-clear">
        <button onClick={clearAllFilters}>Clear All</button>
      </div>

    </div>
  </div>
);
};

export default SearchFilters;