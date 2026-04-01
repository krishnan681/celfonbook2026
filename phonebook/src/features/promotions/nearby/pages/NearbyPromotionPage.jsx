import { useState } from "react";
import { useNearbyController } from "../controller/useNearbyController";
import "../css/nearbyPage.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const NearbyPromotionPage = () => {
  const { search, markAsSent, maskMobile } = useNearbyController();

  const [pincode, setPincode] = useState("");
  const [category, setCategory] = useState("Gents");
  const [message, setMessage] = useState(
    "I Saw Your Listing in SIGNPOST PHONE BOOK. I am Interested in your Products."
  );
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sentIds, setSentIds] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // ✅ Accordion state
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSearch = async () => {
    if (pincode.length !== 6) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    const data = await search(pincode, category);
    setResults(data || []);
    setHasSearched(true);
    setSelectedIds([]);
    setLoading(false);
  };

  const toggleSelect = (mobileNumber) => {
    if (sentIds.includes(mobileNumber)) return;

    setSelectedIds((prev) =>
      prev.includes(mobileNumber)
        ? prev.filter((id) => id !== mobileNumber)
        : [...prev, mobileNumber]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === results.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(results.map((r) => r.mobileNumber));
    }
  };

  const sendSMS = () => {
    if (selectedIds.length === 0) return;

    const selectedItems = results.filter((r) =>
      selectedIds.includes(r.mobileNumber)
    );

    const numbers = selectedItems
      .map((item) => item.mobileNumber)
      .join(",");

    window.location.href = `sms:${numbers}?body=${encodeURIComponent(
      message
    )}`;

    markAsSent(selectedItems);
    setSentIds((prev) => [...prev, ...selectedIds]);
    setSelectedIds([]);
  };

  const selectedCount = selectedIds.length;
  const isDisabled = selectedCount === 0;

  return (
    <div className="nearby-dashboard">
      {/* Sidebar */}
      <aside className="search-sidebar">
        <div className="search-card">
          <header className="search-header">
            <h2>Nearby Promotion</h2>
            <p>Find prospects by location</p>
          </header>

          {/* ✅ ACCORDION */}
          <div className="accordion-container">
            <div
              className="accordion-header"
              onClick={() =>
                setShowInstructions((prev) => !prev)
              }
            >
              <span>How to use Nearby Promotion</span>
              <span
                className={`accordion-icon ${
                  showInstructions ? "rotate" : ""
                }`}
              >
                ▼
              </span>
            </div>

            <div
              className={`accordion-body ${
                showInstructions ? "open" : ""
              }`}
            >
              <p>
                Send Text messages to Mobile Users in desired
                Pincode Area
                <br />
                <br />
                1) First edit / create message to be sent.
                Minimum 1 Count (145 characters), Maximum 2
                counts (290 characters)
                <br />
                <br />
                2) Select type of Recipient (Males / Females /
                Business Firms)
                <br />
                <br />
                3) Type Pincode Number of Targetted area for
                Promotion
                <br />
                <br />
                4) For error free delivery of messages, send in
                batches of 10 nos. each time
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="form-group">
            <label className="input-label">
              Custom Message
            </label>
            <textarea
              className="message-area"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              rows="4"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="input-label">
              Target Audience
            </label>
            <div className="category-toggle-group">
              {["Gents", "Ladies", "Firms"].map((c) => (
                <label
                  key={c}
                  className={`toggle-chip ${
                    category === c ? "active" : ""
                  }`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Pincode */}
          <div className="form-group">
            <label className="input-label">
              <span className="input-icon-for-location">
                <FaMapMarkerAlt />
              </span>
              Pincode
            </label>

            <input
              className="pincode-input"
              type="number"
              placeholder="641001"
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value.slice(0, 6))
              }
            />
          </div>

          {/* Search Button */}
          <button
            className={`search-submit-btn ${
              loading ? "loading" : ""
            }`}
            onClick={handleSearch}
            disabled={
              loading || pincode.length !== 6 || hasSearched
            }
          >
            {loading
              ? "Searching..."
              : hasSearched
              ? "Search Completed"
              : "Find Customers"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="results-main-content">
        {!hasSearched ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Ready to find customers?</h3>
            <p>
              Enter a pincode and select a category to start
              your campaign.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="results-list-header">
              <div className="header-info">
                <h1>{results.length} Prospects Found</h1>
                <p>
                  Location: {pincode} | Category: {category}
                </p>
              </div>

              <div className="header-actions">
                <div className="selected-text">
                  Selected: <strong>{selectedCount}</strong>
                </div>

                <button
                  className="select-all-btn"
                  onClick={handleSelectAll}
                >
                  {selectedIds.length === results.length
                    ? "Deselect All"
                    : "Select All"}
                </button>

                <button
                  className="send-sms-btn top-btn"
                  onClick={sendSMS}
                  disabled={isDisabled}
                >
                  Send SMS
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="results-grid">
              {results.map((item) => {
                const id = item.mobileNumber;
                const isSelected =
                  selectedIds.includes(id);
                const isSent = sentIds.includes(id);

                return (
                  <div
                    key={id}
                    className={`result-item ${
                      isSelected ? "selected" : ""
                    } ${isSent ? "sent" : ""}`}
                    onClick={() => toggleSelect(id)}
                  >
                    <div className="result-content">
                      <h4>
                        {item.businessName ||
                          item.personName ||
                          "Hidden Identity"}
                      </h4>
                      <p className="mobile-mask">
                        {maskMobile(item.mobileNumber)}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="result-checkbox"
                    />
                  </div>
                );
              })}
            </div>

            {/* Bottom Button */}
            <div className="send-button-container">
              <button
                className="send-sms-btn main-btn"
                onClick={sendSMS}
                disabled={isDisabled}
              >
                Send SMS
              </button>
            </div>
          </>
        )}

        {/* Fixed Bottom Bar */}
        {hasSearched && (
          <div className="action-bar">
            <div className="selection-count">
              Selected: <strong>{selectedCount}</strong>
            </div>

            <button
              className="send-sms-btn bottom-btn"
              onClick={sendSMS}
              disabled={isDisabled}
            >
              Send SMS Campaign
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default NearbyPromotionPage;