// import { useEffect, useState } from "react";
// import { useCategorywise } from "../context/CategorywiseContext";
// import CategorywiseResultsPage from "./CategorywiseResultsPage";
// import "../css/categorywisePage.css";

// const CategorywisePromotionPage = () => {
//   const c = useCategorywise();
//   const [suggestions, setSuggestions] = useState([]);

//   useEffect(() => {
//     const fetch = async () => {
//       if (!c.category.trim()) return;
//       const res = await c.getSuggestions("keywords", c.category);
//       setSuggestions(res);
//     };
//     fetch();
//   }, [c.category]);

//   return (
//     <div className="promotion-container">
//       {/* Sidebar Form */}
//       <div className="promotion-left">
//         <div className="sidebar-card">
//           <h2>Categorywise Promotion</h2>
//           <p className="sub-text">Find prospects by category</p>

//           <div className="form-group">
//             <label>Custom Message</label>
//             <textarea
//               placeholder="Enter your message here..."
//               value={c.message}
//               onChange={(e) => c.setMessage(e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <label>Category</label>
//             <input
//               placeholder="e.g. Gents, Ladies"
//               value={c.category}
//               onChange={(e) => c.setCategory(e.target.value)}
//             />
//             <div className="suggestions-row">
//               {suggestions.map((s, i) => (
//                 <span key={i} className="chip" onClick={() => c.setCategory(s)}>
//                   {s}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div className="form-group">
//             <label>City / Pincode</label>
//             <div className="input-with-icon">
//               <span className="icon">📍</span>
//               <input
//                 placeholder="Enter City"
//                 value={c.city}
//                 onChange={(e) => c.setCity(e.target.value)}
//               />
//             </div>
//           </div>

//           <button className="find-btn" onClick={() => c.search()}>
//             Find Customers
//           </button>
//         </div>
//       </div>

//       {/* Main Results Area */}
//       <div className="promotion-right">
//         <CategorywiseResultsPage />
//       </div>
//     </div>
//   );
// };

// export default CategorywisePromotionPage;


import React, { useState } from 'react';
import { useCategorywise } from '../context/CategorywiseContext';
import "../css/categorywisePage.css";

const CategorywisePromotionPage = () => {
  const c = useCategorywise();

  const [categoryInput, setCategoryInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);

  const handleCategoryChange = async (e) => {
    const value = e.target.value;
    setCategoryInput(value);
    c.categoryRef.current = value;

    if (value.trim().length > 1) {
      const results = await c.getKeywordSuggestions(value);
      setCategorySuggestions(results);
    } else {
      setCategorySuggestions([]);
    }
  };

  const handleCityChange = async (e) => {
    const value = e.target.value;
    setCityInput(value);
    c.cityRef.current = value;

    if (value.trim().length > 1) {
      const results = await c.getSuggestions('city', value);
      setCitySuggestions(results);
    } else {
      setCitySuggestions([]);
    }
  };

  const selectSuggestion = (value, type) => {
    if (type === 'category') {
      setCategoryInput(value);
      c.categoryRef.current = value;
      setCategorySuggestions([]);
    } else {
      setCityInput(value);
      c.cityRef.current = value;
      setCitySuggestions([]);
    }
  };

  const handleSearch = async () => {
    if (!c.categoryRef.current.trim()) {
      alert("Please enter a Category / Keyword");
      return;
    }
    await c.search();
  };

  return (
    <div className="cw-page">
      <div style={{ padding: '20px' }}>

        <div className="cw-instruction-box">
          <details>
            <summary>How to use Categorywise Promotion</summary>
            <div style={{ padding: '15px', lineHeight: '1.6' }}>
              Send Text messages based on category.
            </div>
          </details>
        </div>

        <label>Edit Message Text</label>
        <textarea
          className="cw-text-field"
          rows={5}
          defaultValue={c.messageRef.current}
          onChange={(e) => c.messageRef.current = e.target.value}
        />

        <div style={{ marginTop: '20px' }}>
          <label>Category *</label>
          <div style={{ position: 'relative' }}>
            <input
              className="cw-text-field"
              value={categoryInput}
              onChange={handleCategoryChange}
            />
            {categorySuggestions.length > 0 && (
              <ul className="cw-suggestions-list">
                {categorySuggestions.map((s, i) => (
                  <li key={i} onClick={() => selectSuggestion(s, 'category')}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label>City</label>
          <div style={{ position: 'relative' }}>
            <input
              className="cw-text-field"
              value={cityInput}
              onChange={handleCityChange}
            />
            {citySuggestions.length > 0 && (
              <ul className="cw-suggestions-list">
                {citySuggestions.map((s, i) => (
                  <li key={i} onClick={() => selectSuggestion(s, 'city')}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          className="cw-green-btn"
          onClick={handleSearch}
          disabled={c.isSearching}
          style={{ marginTop: '30px' }}
        >
          {c.isSearching ? "Searching..." : "Search"}
        </button>

      </div>
    </div>
  );
};

export default CategorywisePromotionPage;