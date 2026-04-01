// components/CategorywiseCard.jsx
import React from 'react';
import '../css/CategorywiseCard.css';

const CategorywiseCard = ({ item, index, selected, isSent, onToggle }) => {
  return (
    <div
      className={`categorywise-card ${isSent ? 'sent' : ''}`}
      onClick={isSent ? undefined : () => onToggle(index)}
    >
      <div className="card-content">
        <div className="business-info">
          <h3>{item.businessName}</h3>
          <p>{item.mobileNumber}</p>
        </div>

        <div className={`selection-box ${selected ? 'selected' : ''}`}>
          {selected && <span className="check">✓</span>}
        </div>
      </div>
    </div>
  );
};

export default CategorywiseCard;