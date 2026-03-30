import { useRevenueTrackerController } from "../controller/useRevenueTrackerController";
import { useState } from "react";
import '../css/revenueTracker.css'

const ITEMS_PER_PAGE = 10;

const RevenueTracker = () => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    setCustomRange,
    lifetimeStats,
    activities,
    loading
  } = useRevenueTrackerController();

  const [currentPage, setCurrentPage] = useState(1);

  // Logic Helpers
  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const paginatedActivities = activities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const periodCount = activities.length;
  const periodEarn = periodCount * 2; // Assuming ₹2 per entry logic

  const formatTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleDateChange = (field, value) => {
    setCustomRange(prev => ({
      ...prev,
      [field]: value ? new Date(value) : null
    }));
    setCurrentPage(1);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rt-container">
      <header className="rt-header">
        <div>
          <h2 className="rt-title">Revenue Analytics</h2>
          <p className="rt-subtitle">Track your earnings and entry history</p>
        </div>
        <div className="rt-chip">Live Updates</div>
      </header>

      {/* HOW IT WORKS SECTION */}
      <section className="rt-info-box">
        <h4>💡 How it works</h4>
        <p>
          Earnings are calculated at <strong>₹2.00 per entry</strong>. Use the filters below 
          to view performance for specific timeframes or set a custom date range.
        </p>
      </section>

      {/* STATS OVERVIEW */}
      <div className="rt-stats-grid">
        <div className="rt-stat-card primary">
          <div className="rt-card-header">
            <span className="rt-label">Lifetime Earnings</span>
            <span className="rt-info-icon" title="Total earned since account creation">ⓘ</span>
          </div>
          <h1 className="rt-value">₹{loading ? "..." : lifetimeStats.earn.toLocaleString()}</h1>
          <p className="rt-sub-value">{lifetimeStats.count} total transactions</p>
        </div>
        
        <div className="rt-stat-card">
          <div className="rt-card-header">
            <span className="rt-label">Selected Period</span>
            <span className="rt-info-icon" title="Earnings for the filtered date range">ⓘ</span>
          </div>
          <h1 className="rt-value small">₹{periodEarn.toLocaleString()}</h1>
          <p className="rt-sub-value">{periodCount} entries found</p>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="rt-controls">
        <div className="rt-tabs-header">
          <span>Filter by Period</span>
        </div>
        <div className="rt-tabs">
          {["Weekly", "Monthly", "Custom"].map(p => (
            <button
              key={p}
              className={`rt-tab ${selectedPeriod === p ? "active" : ""}`}
              onClick={() => {
                setSelectedPeriod(p);
                setCurrentPage(1);
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {selectedPeriod === "Custom" && (
          <div className="rt-date-picker-group">
            <div className="rt-input-wrapper">
              <label>Start Date</label>
              <input 
                type="date" 
                max={today}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="rt-date-input"
              />
            </div>
            <div className="rt-input-wrapper">
              <label>End Date</label>
              <input 
                type="date" 
                max={today}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="rt-date-input"
              />
            </div>
          </div>
        )}
      </div>

      {/* LIST SECTION */}
      <div className="rt-list-container">
        <div className="rt-list-header">
          <span>Recent Activity</span>
          {loading && <div className="loader-inline"></div>}
        </div>

        <div className="rt-list">
          {!loading && paginatedActivities.length === 0 && (
            <div className="rt-empty-state">
              <p>No transactions found for {selectedPeriod.toLowerCase()} period.</p>
              <span>Try adjusting your filters or date range.</span>
            </div>
          )}

          {paginatedActivities.map(item => (
            <div key={item.id} className="rt-item">
              <div className="rt-item-info">
                <div className="rt-icon">₹</div>
                <div>
                  <h4>{item.entryname || "Standard Revenue Entry"}</h4>
                  <span>{formatTime(item.created_at)}</span>
                </div>
              </div>
              <div className="rt-item-amount positive">+₹2.00</div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="rt-pagination">
          <button
            className="rt-page-nav"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(p => p - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            ← Previous
          </button>
          
          <div className="rt-page-numbers">
             Page <strong>{currentPage}</strong> of {totalPages}
          </div>

          <button
            className="rt-page-nav"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(p => p + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default RevenueTracker;