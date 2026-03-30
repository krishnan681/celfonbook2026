// src/features/admin/components/TopStats.jsx
import '../css/TopStats.css';

export default function TopStats({ 
  profiles = [], 
  isLoading = false, 
  totalCount = 0,
  withoutMobileCount = 0,
  withoutAddressCount = 0,
  withoutBusinessAddressCount = 0 
}) {

  if (isLoading) {
    return (
      <div className="adm-dashboard">
        <div style={{ color: "#64748b", fontSize: 14 }}>Loading dashboard…</div>
      </div>
    );
  }

  const biz = profiles.filter(p => p.business_name || p.is_business).length;
  const individual = profiles.length - biz;

  const initial = (name) => (name ? name[0].toUpperCase() : "?");
  const fmtDate = (s) => s 
    ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) 
    : "—";

  const recent = [...profiles].slice(0, 6);

  return (
    <div className="adm-dashboard">
      <div className="adm-page-title">Dashboard</div>
      <div className="adm-page-sub">
        Overview of all phonebook data • Total Records: <strong>{Number(totalCount).toLocaleString()}</strong>
      </div>

      <div className="adm-stats-grid">
        <StatCard label="Total Profiles" value={Number(totalCount).toLocaleString()} color="green" />
        {/* <StatCard label="Businesses" value={biz} /> */}
        {/* <StatCard label="Individuals" value={individual} color="amber" /> */}
        
        <StatCard 
          label="Without Mobile" 
          value={Number(withoutMobileCount).toLocaleString()} 
          color="amber" 
          note="No contact number" 
        />
        <StatCard 
          label="Without Address" 
          value={Number(withoutAddressCount).toLocaleString()} 
          color="amber" 
          note="Personal address missing" 
        />
        <StatCard 
          label="Without Biz Address" 
          value={Number(withoutBusinessAddressCount).toLocaleString()} 
          color="amber" 
          note="Business address missing" 
        />
      </div>

      <div className="adm-section-title">Recent Entries</div>
      <div className="adm-recent-list">
        {recent.map((p) => (
          <div className="adm-recent-item" key={p.id}>
            <div className="adm-recent-avatar">
              {initial(p.display_name || p.person_name || p.business_name)}
            </div>
            <div>
              <div className="adm-recent-name">
                {p.display_name || p.person_name || p.business_name || "Unknown"}
              </div>
              <div className="adm-recent-sub">
                {p.business_name ? "Business" : "Individual"}
              </div>
            </div>
            <div className="adm-recent-time">{fmtDate(p.created_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, note }) {
  return (
    <div className="adm-stat-card">
      <div className="adm-stat-label">{label}</div>
      <div className={`adm-stat-value ${color || ""}`}>{value}</div>
      {note && <div className="adm-stat-note">{note}</div>}
    </div>
  );
}