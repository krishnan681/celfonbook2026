import "../css/promotionCard.css";

const PromotionCard = ({ title, subtitle, icon, onClick}) => {
  return (
    <button 
      className="promotion-card" 
      onClick={onClick}
      aria-label={`View details for ${title}`}
    >
      {/* Dynamic Background Glow */}
      <div className="card-glow" aria-hidden="true"></div>

      <div className="card-top">
        <div className="promotion-icon-wrapper">
          {icon}
        </div>
        
      </div>

      <div className="promotion-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="card-footer">
        <span className="action-text">Get Started</span>
        <div className="promotion-arrow">
           <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 7H17M17 7L11 1M17 7L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </button>
  );
};

export default PromotionCard;