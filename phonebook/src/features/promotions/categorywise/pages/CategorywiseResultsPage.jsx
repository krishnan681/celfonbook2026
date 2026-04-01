// import { useCategorywise } from "../context/CategorywiseContext";

// const CategorywiseResultsPage = () => {
//   const c = useCategorywise();

//   return (
//     <div className="results-container">
//       <div className="results-header">
//         <div>
//           <h1>{c.searchResults.length} Prospects Found</h1>
//           <p className="meta-info">
//             Location: <span>{c.city || "All"}</span> | Category: <span>{c.category || "General"}</span>
//           </p>
//         </div>
//         <button className="select-all-btn" onClick={c.selectAll}>
//           Select All
//         </button>
//       </div>

//       <div className="results-grid">
//         {c.searchResults.map((item, index) => {
//           const selected = c.selectedIndices.includes(index);
//           const isSent = c.sentBusinessIds?.includes(item.id);

//           return (
//             <div
//               key={item.id}
//               className={`prospect-card ${selected ? "active" : ""} ${isSent ? "sent" : ""}`}
//               onClick={() => !isSent && c.toggleSelection(index)}
//             >
//               <div className="card-content">
//                 <h3>{item.business_name}</h3>
//                 <p>{item.mobile_number}</p>
//               </div>
//               <div className="selection-indicator">
//                 {isSent ? "📩 Sent" : selected ? <div className="dot-active" /> : <div className="dot-empty" />}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Floating Action Bar */}
//       {c.selectedIndices.length > 0 && (
//         <div className="floating-bar">
//           <div className="selection-count">
//             {c.selectedIndices.length} selected
//           </div>
//           <button className="send-btn" onClick={c.sendSMS}>
//             Send SMS
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategorywiseResultsPage;

import React from 'react';
import { useCategorywise } from '../context/CategorywiseContext';
import CategorywiseCard from '../components/CategorywiseCard';
import '../css/categorywisePage.css';

const CategorywiseResultsPage = () => {
  const c = useCategorywise();

  return (
    <div className="cw-page">

      <div className="cw-top-bar">
        <div className="cw-top-bar-content">

          <div className="cw-stats">
            <strong>Total Records: {c.searchResults.length}</strong>
            <strong>Selected: {c.selectedIndices.size}</strong>
          </div>

          <div className="cw-action-buttons">
            <button
              className="cw-green-btn"
              onClick={c.sendSMS}
              disabled={c.selectedIndices.size === 0}
            >
              Send SMS
            </button>

            <button
              className="cw-green-btn"
              onClick={c.clearAll}
            >
              Clear All
            </button>
          </div>

        </div>
      </div>

      <div className="cw-results-grid">
        {c.searchResults.map((item, index) => {
          const isSelected = c.selectedIndices.has(index);
          const isSent = c.sentBusinessIds.has(item.id);

          return (
            <CategorywiseCard
              key={item.id || index}
              item={item}
              index={index}
              selected={isSelected}
              isSent={isSent}
              onToggle={c.toggleSelection}
            />
          );
        })}
      </div>

    </div>
  );
};

export default CategorywiseResultsPage;