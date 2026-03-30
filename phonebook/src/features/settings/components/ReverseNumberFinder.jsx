import { useState } from "react";
import { supabase } from "../../../core/config/supabaseClient";
import {
  Search, Phone, MapPin, Briefcase, User, Info, 
  Globe, Mail, MessageCircle, ShieldCheck, Hash, 
  Layout, CheckCircle2, Navigation
} from "lucide-react";
import "../css/reverseFinder.css";

export default function ReverseNumberFinder() {
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 3) return;

    setLoading(true);
    setHasSearched(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`mobile_number.ilike.%${phone}%,whats_app.ilike.%${phone}%,landline_number.ilike.%${phone}%`);

    if (error) {
      console.error("Search error:", error);
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="rnf-container">
      <div className="rnf-blob rnf-blob-1"></div>
      <div className="rnf-blob rnf-blob-2"></div>

      <div className="rnf-content">
        <header className="rnf-hero">
          <div className="rnf-icon-badge"><Search size={32} /></div>
          <h1>Reverse Number <span>Finder</span></h1>
          <p>Global Identity Intelligence. Decrypt phone numbers into verified profiles.</p>
        </header>

        <form className="rnf-search-wrapper" onSubmit={handleSearch}>
          <div className="rnf-input-group">
            <Phone className="rnf-search-icon" size={20} />
            <input
              type="tel"
              placeholder="Enter mobile or landline number..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button type="submit" className="rnf-search-btn" disabled={loading}>
            {loading ? <div className="rnf-spinner"></div> : "Search Intelligence"}
          </button>
        </form>

        <section className="rnf-results">
          {loading && (
            <div className="rnf-loading-state">
              <div className="rnf-pulse"></div>
              <p>Scanning global registry for {phone}...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="rnf-report-container">
              {results.map((item) => (
                <div key={item.id} className="rnf-big-card">
                  {/* HEADER SECTION */}
                  <div className="rnf-report-header">
                    <div className="rnf-main-identity">
                      <div className="rnf-avatar-large">
                        {item.profile_image ? (
                          <img src={item.profile_image} alt="Profile" />
                        ) : (
                          <User size={40} />
                        )}
                      </div>
                      <div className="rnf-title-group">
                        <span className="rnf-pre-title">Verified Registered Identity</span>
                        <h2>
                          {item.business_prefix} {item.business_name || item.person_name}
                          {item.is_prime && <ShieldCheck className="rnf-prime-icon" size={20} title="Prime Member" />}
                        </h2>
                        
                      </div>
                    </div>
                    {item.is_business && <div className="rnf-verified-stamp">BUSINESS VERIFIED</div>}
                  </div>

                  <div className="rnf-report-grid">
                    {/* LEFT COL: CONTACT DETAILS */}
                    <div className="rnf-col">
                      <h4 className="rnf-col-label">Contact Intelligence</h4>
                      <div className="rnf-data-row">
                        <Phone size={16} />
                        <div>
                          <label>Primary Mobile</label>
                          <p>{item.mobile_number}</p>
                        </div>
                      </div>
                      {item.whats_app && (
                        <div className="rnf-data-row">
                          <MessageCircle size={16} color="#25D366" />
                          <div>
                            <label>WhatsApp Link</label>
                            <p>{item.whats_app}</p>
                          </div>
                        </div>
                      )}
                      {(item.landline_number || item.landline) && (
                        <div className="rnf-data-row">
                          <Hash size={16} />
                          <div>
                            <label>Landline</label>
                            <p>{item.landline_code} {item.landline_number || item.landline}</p>
                          </div>
                        </div>
                      )}
                      {item.email && (
                        <div className="rnf-data-row">
                          <Mail size={16} />
                          <div>
                            <label>Official Email</label>
                            <p>{item.email}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RIGHT COL: LOCATION & WEB */}
                    <div className="rnf-col">
                      <h4 className="rnf-col-label">Geographic Data</h4>
                      <div className="rnf-data-row">
                        <MapPin size={16} />
                        <div>
                          <label>Operating City</label>
                          <p>{item.city} - {item.pincode}</p>
                        </div>
                      </div>
                      <div className="rnf-data-row">
                        <Navigation size={16} />
                        <div>
                          <label>Physical Address</label>
                          <p className="rnf-address-text">{item.address || item.bussiness_address || "N/A"}</p>
                        </div>
                      </div>
                      {item.web_site && (
                        <div className="rnf-data-row">
                          <Globe size={16} />
                          <div>
                            <label>Digital Assets</label>
                            <p className="rnf-link">{item.web_site}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DESCRIPTION / ACTIVITY BLOCK */}
                  <div className="rnf-report-footer">
                    <div className="rnf-desc-block">
                      <label><Layout size={14} /> Description & Activity</label>
                      <p>{item.description || item.activity || "No additional records found for this identity."}</p>
                    </div>
                    {item.keywords && (
                      <div className="rnf-keyword-cloud">
                        {item.keywords.split(',').map((k, i) => (
                          <span key={i} className="rnf-k-pill">#{k.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && hasSearched && results.length === 0 && (
            <div className="rnf-empty">
              <Info size={48} />
              <h3>Identity Registry: No Match</h3>
              <p>The number <strong>{phone}</strong> is not associated with any verified business or individual in our system.</p>
            </div>
          )}
        </section>

        {/* HOW IT WORKS (ONLY SHOWN BEFORE SEARCH) */}
        {!hasSearched && (
          <section className="rnf-how-section">
             <h2 className="rnf-section-title">Protocol Intelligence</h2>
             <div className="rnf-benefits">
                <div className="rnf-benefit">
                  <h4><CheckCircle2 size={18} /> Deep Scanning</h4>
                  <p>Our engine cross-references mobile, landline, and WhatsApp digits against 100+ data points.</p>
                </div>
                <div className="rnf-benefit">
                  <h4><CheckCircle2 size={18} /> Entity Extraction</h4>
                  <p>We reveal business prefixes, trade names, and authorized personnel linked to the number.</p>
                </div>
                <div className="rnf-benefit">
                  <h4><CheckCircle2 size={18} /> Location Mapping</h4>
                  <p>Pinpoint the operational headquarters and postal codes associated with the entry.</p>
                </div>
             </div>
          </section>
        )}
      </div>
    </div>
  );
}