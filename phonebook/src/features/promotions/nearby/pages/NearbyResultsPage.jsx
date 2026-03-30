import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNearbyController } from "../controller/useNearbyController";
import "../css/nearbyResults.css";

const NearbyResultsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { results = [], message = "" } = state || {};

  const { markAsSent, maskMobile } = useNearbyController();

  const [selectedIds, setSelectedIds] = useState([]);
  const [sentIds, setSentIds] = useState([]);

  // Toggle selection by ID
  const toggleSelect = (item) => {
    const id = item.mobileNumber; // Using mobile as unique key
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
    <div className="results-page-container">
      <header className="results-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="header-content">
          <h1>Prospects Found</h1>
          <p>{results.length} contacts available in this area</p>
        </div>
        <button className="select-all-btn" onClick={handleSelectAll}>
          {selectedIds.length === results.length ? "Deselect All" : "Select All"}
        </button>
      </header>

      <div className="results-list">
        {results.map((item, i) => {
          const isSelected = selectedIds.includes(item.mobileNumber);
          const isSent = sentIds.includes(item.mobileNumber);

          return (
            <div 
              key={i} 
              className={`result-item ${isSelected ? 'selected' : ''} ${isSent ? 'sent' : ''}`}
              onClick={() => toggleSelect(item)}
            >
              <div className="selection-indicator">
                {isSent ? "✓" : isSelected ? "●" : ""}
              </div>
              
              <div className="result-info">
                <h4>{item.businessName || item.personName || "Hidden Identity"}</h4>
                <p className="mobile-mask">{maskMobile(item.mobileNumber)}</p>
              </div>

              {isSent && <span className="status-badge">Sent</span>}
            </div>
          );
        })}
      </div>

      {/* STICKY FOOTER ACTION BAR */}
      <footer className={`action-bar ${selectedIds.length > 0 ? 'active' : ''}`}>
        <div className="selection-count">
          <strong>{selectedIds.length}</strong> contacts selected
        </div>
        <button className="send-sms-btn" onClick={sendSMS}>
          Send SMS Campaign
        </button>
      </footer>
    </div>
  );
};

export default NearbyResultsPage;