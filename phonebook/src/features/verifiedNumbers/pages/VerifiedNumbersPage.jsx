import { useEffect, useState } from "react";
import { supabase } from "../../../core/config/supabaseClient";
import "../css/verifiedNumbers.css";
import {
  Check, X, Search,
  ShieldCheck, ChevronRight,
  PhoneCall
} from "lucide-react";

export default function VerifiedNumbersPage() {

  const [verifyList, setVerifyList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("verify");

  const [callStatus, setCallStatus] = useState({});
  const [remark, setRemark] = useState("");
  const [adminId, setAdminId] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 50;

  useEffect(() => { init(); }, []);
  useEffect(() => {
    if (adminId && tab === "verify") fetchProfiles();
  }, [search, adminId, tab, page]);

  async function init() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const { data } = await supabase
      .from("profiles")
      .select("id, is_admin")
      .eq("id", userData.user.id)
      .single();

    if (data?.is_admin) setAdminId(data.id);
    else alert("Admin only");
  }

  /* ================= VERIFY LIST ================= */
  async function fetchProfiles() {
    try {
      const { data: logs } = await supabase
        .from("verification_logs")
        .select("profile_id");

      const ids = logs?.map(l => l.profile_id) || [];

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("profiles")
        .select("*")
        .range(from, to);

      if (search) {
        query = query.or(
          `person_name.ilike.%${search}%,business_name.ilike.%${search}%,mobile_number.ilike.%${search}%`
        );
      }

      if (ids.length > 0) {
        query = query.not("id", "in", `(${ids.join(",")})`);
      }

      const { data } = await query;
      setVerifyList(data || []);

    } catch (err) {
      console.error(err);
    }
  }

  /* ================= HISTORY ================= */
  async function fetchHistory() {
    const { data } = await supabase
      .from("verification_logs")
      .select(`
        id,
        status,
        call_status,
        remark,
        created_at,
        profiles:profile_id (
          person_name,
          business_name,
          mobile_number
        ),
        admin:verified_by (
          person_name,
          business_name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    setHistoryList(data || []);
  }

  const getName = (p) =>
    p?.business_name || p?.person_name || "Unknown";

  /* ================= ACTION ================= */
  const handleAction = async (status) => {
    if (!selectedProfile) return;

    const cStatus = callStatus[selectedProfile.id];
    if (!cStatus) return alert("Select call status");

    await supabase.from("verification_logs").insert([{
      profile_id: selectedProfile.id,
      verified_by: adminId,
      status,
      call_status: cStatus,
      remark
    }]);

    setSelectedProfile(null);
    setRemark("");
    fetchProfiles();
  };

  if (!adminId) {
    return <div className="vnp-denied">Access Denied</div>;
  }

  return (
    <div className="vnp-wrapper">

      {/* HEADER */}
      <header className="vnp-navbar">
        <div className="vnp-navbar__left">
          <div className="vnp-logo">
            <ShieldCheck />
            <span>Verification</span>
          </div>

          <div className="vnp-nav-tabs">
            <button
              className={tab === "verify" ? "active" : ""}
              onClick={() => {
                setTab("verify");
                setPage(1);
              }}
            >
              Verify
            </button>

            <button
              className={tab === "history" ? "active" : ""}
              onClick={() => {
                setTab("history");
                fetchHistory();
              }}
            >
              History
            </button>
          </div>
        </div>

        <div className="vnp-search-container">
          <Search size={16} />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </header>

      {/* MAIN */}
      <main className="vnp-content">

        {tab === "verify" ? (
          <div className="vnp-split-view">

            {/* LEFT LIST */}
            <aside className="vnp-list-section">
              {verifyList.map(profile => (
                <div
                  key={profile.id}
                  className={`vnp-item-card ${selectedProfile?.id === profile.id ? "active" : ""
                    }`}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <div className="vnp-avatar">
                    {getName(profile).charAt(0)}
                  </div>

                  <div className="vnp-item-meta">
                    <div className="vnp-item-name">
                      {getName(profile)}
                    </div>
                    <div className="vnp-item-sub">
                      {profile.mobile_number}
                    </div>
                  </div>

                  <ChevronRight size={16} />
                </div>
              ))}
            </aside>

            {/* DETAILS PANEL */}
            <section className="vnp-details-section">
              {selectedProfile ? (
                <div className="vnp-details-card">

                  <div className="vnp-details-header">
                    <h2>{getName(selectedProfile)}</h2>
                    <span className="vnp-id-tag">
                      {selectedProfile.user_type}
                    </span>
                  </div>

                  <div className="vnp-details-grid">

                    <div className="vnp-info-box">
                      <label><PhoneCall size={14} /> Mobile</label>
                      <p>{selectedProfile.mobile_number || "-"}</p>
                    </div>

                    <div className="vnp-info-box">
                      <label>Email</label>
                      <p>{selectedProfile.email || "-"}</p>
                    </div>

                    <div className="vnp-info-box">
                      <label>City</label>
                      <p>{selectedProfile.city || "-"}</p>
                    </div>

                    <div className="vnp-info-box">
                      <label>Pincode</label>
                      <p>{selectedProfile.pincode || "-"}</p>
                    </div>

                    <div className="vnp-info-box">
                      <label>Website</label>
                      <p>{selectedProfile.web_site || "-"}</p>
                    </div>

                    <div className="vnp-info-box">
                      <label>WhatsApp</label>
                      <p>{selectedProfile.whats_app || "-"}</p>
                    </div>

                    <div className="vnp-info-box vnp-full-width">
                      <label>Address</label>
                      <p>{selectedProfile.address || "-"}</p>
                    </div>

                    <div className="vnp-info-box vnp-full-width">
                      <label>Description</label>
                      <p>{selectedProfile.description || "-"}</p>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="vnp-action-area">

                    <div className="vnp-status-toggle">
                      {[
                        "verified_correct",
                        "not_reachable",
                        "switched_off",
                        "wrong_number"
                      ].map(s => (
                        <button
                          key={s}
                          className={
                            callStatus[selectedProfile.id] === s
                              ? "selected"
                              : ""
                          }
                          onClick={() =>
                            setCallStatus({
                              ...callStatus,
                              [selectedProfile.id]: s
                            })
                          }
                        >
                          {s.replace("_", " ")}
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="Remarks..."
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />

                    <div className="vnp-button-group">
                      <button
                        className="vnp-btn vnp-btn-outline"
                        onClick={() => handleAction("rejected")}
                      >
                        <X size={18} /> Reject
                      </button>

                      <button
                        className="vnp-btn vnp-btn-primary"
                        onClick={() => handleAction("approved")}
                      >
                        <Check size={18} /> Approve
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="vnp-placeholder">
                  Select a profile
                </div>
              )}
            </section>

          </div>
        ) : (
          <table className="vnp-modern-table">
            <tbody>
              {historyList.map(item => (
                <tr key={item.id}>
                  <td>{getName(item.profiles)}</td>
                  <td>{item.call_status}</td>
                  <td>{item.status}</td>
                  <td>{item.remark || "-"}</td>
                  <td>
                    {item.admin?.person_name ||
                      item.admin?.business_name ||
                      "System"}
                  </td>
                  <td>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAGINATION ONLY UNDER VERIFY LIST */}
        {tab === "verify" && (
          <div className="vnp-pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span>Page {page}</span>
            <button onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        )}

      </main>
    </div>
  );
}