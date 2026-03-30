import { useCategorywise } from "../context/CategorywiseContext";

const CategorywiseResultsPage = () => {
  const c = useCategorywise();

  return (
    <div className="results-container">
      <div className="results-header">
        <div>
          <h1>{c.searchResults.length} Prospects Found</h1>
          <p className="meta-info">
            Location: <span>{c.city || "All"}</span> | Category: <span>{c.category || "General"}</span>
          </p>
        </div>
        <button className="select-all-btn" onClick={c.selectAll}>
          Select All
        </button>
      </div>

      <div className="results-grid">
        {c.searchResults.map((item, index) => {
          const selected = c.selectedIndices.includes(index);
          const isSent = c.sentBusinessIds?.includes(item.id);

          return (
            <div
              key={item.id}
              className={`prospect-card ${selected ? "active" : ""} ${isSent ? "sent" : ""}`}
              onClick={() => !isSent && c.toggleSelection(index)}
            >
              <div className="card-content">
                <h3>{item.business_name}</h3>
                <p>{item.mobile_number}</p>
              </div>
              <div className="selection-indicator">
                {isSent ? "📩" : selected ? <div className="dot-active" /> : <div className="dot-empty" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      {c.selectedIndices.length > 0 && (
        <div className="floating-bar">
          <div className="selection-count">
            {c.selectedIndices.length} selected
          </div>
          <button className="send-btn" onClick={c.sendSMS}>
            Send SMS
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorywiseResultsPage;