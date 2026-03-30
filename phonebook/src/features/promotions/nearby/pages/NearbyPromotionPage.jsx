import { useState } from "react";
import { useNearbyController } from "../controller/useNearbyController";
import "../css/nearbyPage.css";
import "../css/nearbyResults.css";

const NearbyPromotionPage = () => {
  const { search, markAsSent, maskMobile } = useNearbyController();

  // Search States
  const [pincode, setPincode] = useState("");
  const [category, setCategory] = useState("Gents");
  const [message, setMessage] = useState("I Saw Your Listing in SIGNPOST PHONE BOOK...");
  const [loading, setLoading] = useState(false);
  
  // Results States
  const [results, setResults] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sentIds, setSentIds] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (pincode.length !== 6) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    const data = await search(pincode, category);
    setResults(data || []);
    setHasSearched(true);
    setSelectedIds([]); // Reset selection on new search
    setLoading(false);
  };

  const toggleSelect = (id) => {
    if (sentIds.includes(id)) return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === results.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(results.map(r => r.mobileNumber));
    }
  };

  const sendSMS = () => {
    if (!selectedIds.length) return;
    const selectedItems = results.filter(r => selectedIds.includes(r.mobileNumber));
    const numbers = selectedItems.map((e) => e.mobileNumber).join(",");
    
    window.location.href = `sms:${numbers}?body=${encodeURIComponent(message)}`;

    markAsSent(selectedItems);
    setSentIds([...sentIds, ...selectedIds]);
    setSelectedIds([]);
  };

  return (
    <div className="nearby-dashboard">
      
      {/* LEFT SIDE: SEARCH PANEL */}
      <aside className="search-sidebar">
        <div className="search-card">
          <header className="search-header">
            <h2>Nearby Promotion</h2>
            <p>Find prospects by location</p>
          </header>

          <div className="form-group">
            <label className="input-label">Custom Message</label>
            <textarea
              className="message-area"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="input-label">Target Audience</label>
            <div className="category-toggle-group">
              {["Gents", "Ladies", "Firms"].map((c) => (
                <label key={c} className={`toggle-chip ${category === c ? "active" : ""}`}>
                  <input type="radio" name="category" onChange={() => setCategory(c)} />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Pincode</label>
            <div className="input-with-icon">
              <span className="input-icon">📍</span>
              <input
                className="pincode-input"
                type="number"
                placeholder="641001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
          </div>

          <button 
            className={`search-submit-btn ${loading ? "loading" : ""}`} 
            onClick={handleSearch} 
            disabled={loading}
          >
            {loading ? "Searching..." : "Find Customers"}
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE: RESULTS PANEL */}
      <main className="results-main-content">
        {!hasSearched ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Ready to find customers?</h3>
            <p>Enter a pincode and select a category to start your campaign.</p>
          </div>
        ) : (
          <div className="results-wrapper">
            <header className="results-list-header">
              <div className="header-info">
                <h1>{results.length} Prospects Found</h1>
                <p>Location: {pincode} | Category: {category}</p>
              </div>
              <button className="select-all-btn" onClick={handleSelectAll}>
                {selectedIds.length === results.length ? "Deselect All" : "Select All"}
              </button>
            </header>

            <div className="results-grid">
              {results.map((item, i) => {
                const isSelected = selectedIds.includes(item.mobileNumber);
                const isSent = sentIds.includes(item.mobileNumber);
                return (
                  <div 
                    key={i} 
                    className={`result-item ${isSelected ? 'selected' : ''} ${isSent ? 'sent' : ''}`}
                    onClick={() => toggleSelect(item.mobileNumber)}
                  >
                    <div className="selection-indicator">
                      {isSent ? "✓" : isSelected ? "●" : ""}
                    </div>
                    <div className="result-info">
                      <h4>{item.businessName || item.personName || "Hidden Identity"}</h4>
                      <p>{maskMobile(item.mobileNumber)}</p>
                    </div>
                    {isSent && <span className="status-badge">Sent</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FLOATING ACTION BAR */}
        <footer className={`action-bar ${selectedIds.length > 0 ? 'active' : ''}`}>
          <div className="selection-count">
            <strong>{selectedIds.length}</strong> selected
          </div>
          <button className="send-sms-btn" onClick={sendSMS}>
            Send SMS
          </button>
        </footer>
      </main>
    </div>
  );
};

export default NearbyPromotionPage;