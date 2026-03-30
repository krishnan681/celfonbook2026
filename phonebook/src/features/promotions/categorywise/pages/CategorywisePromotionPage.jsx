import { useEffect, useState } from "react";
import { useCategorywise } from "../context/CategorywiseContext";
import CategorywiseResultsPage from "./CategorywiseResultsPage";
import "../css/categorywisePage.css";

const CategorywisePromotionPage = () => {
  const c = useCategorywise();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (!c.category.trim()) return;
      const res = await c.getSuggestions("keywords", c.category);
      setSuggestions(res);
    };
    fetch();
  }, [c.category]);

  return (
    <div className="promotion-container">
      {/* Sidebar Form */}
      <div className="promotion-left">
        <div className="sidebar-card">
          <h2>Categorywise Promotion</h2>
          <p className="sub-text">Find prospects by category</p>

          <div className="form-group">
            <label>Custom Message</label>
            <textarea
              placeholder="Enter your message here..."
              value={c.message}
              onChange={(e) => c.setMessage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              placeholder="e.g. Gents, Ladies"
              value={c.category}
              onChange={(e) => c.setCategory(e.target.value)}
            />
            <div className="suggestions-row">
              {suggestions.map((s, i) => (
                <span key={i} className="chip" onClick={() => c.setCategory(s)}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>City / Pincode</label>
            <div className="input-with-icon">
              <span className="icon">📍</span>
              <input
                placeholder="Enter City"
                value={c.city}
                onChange={(e) => c.setCity(e.target.value)}
              />
            </div>
          </div>

          <button className="find-btn" onClick={() => c.search()}>
            Find Customers
          </button>
        </div>
      </div>

      {/* Main Results Area */}
      <div className="promotion-right">
        <CategorywiseResultsPage />
      </div>
    </div>
  );
};

export default CategorywisePromotionPage;