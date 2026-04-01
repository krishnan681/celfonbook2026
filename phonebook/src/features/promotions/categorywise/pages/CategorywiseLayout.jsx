import React from "react";
import CategorywisePromotionPage from "./CategorywisePromotionPage";
import CategorywiseResultsPage from "./CategorywiseResultsPage";
import "../css/categorywisePage.css";

const CategorywiseLayoutPage = () => {
  return (
    <div className="cw-layout">
      
      {/* LEFT PANEL */}
      <div className="cw-left-panel">
        <CategorywisePromotionPage />
      </div>

      {/* RIGHT PANEL */}
      <div className="cw-right-panel">
        <CategorywiseResultsPage />
      </div>

    </div>
  );
};

export default CategorywiseLayoutPage;