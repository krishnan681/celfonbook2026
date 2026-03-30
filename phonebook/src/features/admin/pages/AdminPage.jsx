// import { useState } from "react";
// import useAdminController from "../controller/useAdminController";
// import SidebarList from "../components/SidebarList";
// import ProfileDetail from "../components/ProfileDetail";
// import SearchBar from "../components/SearchBar";

// import "../css/admin.css";

// export default function AdminPage() {
//   const ctrl = useAdminController();
//   const [view, setView] = useState("dashboard");

//   if (ctrl.loading) return <div className="loader">Loading...</div>;

//   return (
//     <div className="admin-layout">

//       {/* ================= SIDEBAR (DESKTOP) ================= */}
//       <div className="nav">
//         <div
//           className={view === "dashboard" ? "nav-item active" : "nav-item"}
//           onClick={() => setView("dashboard")}
//         >
//           Dashboard
//         </div>

//         <div
//           className={view === "manage" ? "nav-item active" : "nav-item"}
//           onClick={() => setView("manage")}
//         >
//           Manage
//         </div>
//       </div>

//       {/* ================= CONTENT ================= */}
//       <div className="content">

//         {/* DASHBOARD */}
//         {view === "dashboard" && (
//           <div className="dashboard">

//             <div className="stats-card">
//               <h2>Total Records</h2>
//               <p>{ctrl.totalCount}</p>
//             </div>

//             <div className="recent-list">
//               <h3>Recent Entries</h3>

//               {ctrl.profiles.slice(0, 10).map((p) => (
//                 <div key={p.id} className="recent-row">
//                   <div>{p.business_name || p.person_name}</div>
//                   <small>{p.mobile_number}</small>
//                 </div>
//               ))}
//             </div>

//           </div>
//         )}

//         {/* MANAGE */}
//         {view === "manage" && (
//           <div className="admin-main">

//             <div className="admin-left">
//               <SearchBar onSearch={ctrl.searchProfiles} />

//               <SidebarList
//                 data={ctrl.profiles}
//                 onSelect={ctrl.setSelected}
//                 selected={ctrl.selected}
//                 page={ctrl.page}
//                 setPage={ctrl.setPage}
//                 totalPages={ctrl.totalPages}
//               />
//             </div>

//             <div className="admin-right">
//               {ctrl.selected ? (
//                 <ProfileDetail
//                   profile={ctrl.selected}
//                   onUpdate={ctrl.updateProfile}
//                   onDelete={ctrl.deleteProfile}
//                 />
//               ) : (
//                 <div className="empty">Select a profile</div>
//               )}
//             </div>

//           </div>
//         )}

//       </div>

//       {/* ================= MOBILE BOTTOM NAV ================= */}
//       <div className="bottom-nav">

//         <div
//           className={view === "dashboard" ? "bottom-item active" : "bottom-item"}
//           onClick={() => setView("dashboard")}
//         >
//           📊
//           <div>Dashboard</div>
//         </div>

//         <div
//           className={view === "manage" ? "bottom-item active" : "bottom-item"}
//           onClick={() => setView("manage")}
//         >
//           📂
//           <div>Manage</div>
//         </div>

//       </div>

//     </div>
//   );
// }
// src/features/admin/pages/AdminPage.jsx







// src/features/admin/pages/AdminPage.jsx
import { useState } from "react";
import '../css/admin.css';

import TopStats from "../components/TopStats";
import SidebarList from "../components/SidebarList";
import ProfileDetail from "../components/ProfileDetail";
import useAdminController from "../controller/useAdminController";

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");

  const {
    profiles,
    selectedProfile,
    setSelectedProfile,
    isLoading,
    deleteProfile,
    updateProfile,
    totalCount = 0,
    withoutMobileCount = 0,
    withoutAddressCount,
    withoutBusinessAddressCount,
    currentPage = 1,
    itemsPerPage = 50,
    goToPage,
  } = useAdminController();

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "edit", label: "Edit Data", icon: "✎" },
  ];

  return (
    <div className="adm-root">
      {/* Top Bar */}
      <div className="adm-topbar">
        <div className="adm-logo">
          cel<span>fon</span>
        </div>

        <div className="adm-topbar-right">
          <span className="adm-badge">{Number(totalCount).toLocaleString()} profiles</span>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="adm-mobile-tabs">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`adm-mobile-tab ${tab === n.id ? "active" : ""}`}
            onClick={() => setTab(n.id)}
          >
            <span className="adm-mobile-tab-icon">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>

      <div className="adm-body">
        {/* Desktop Sidebar */}
        <nav className="adm-sidebar">
          <div className="adm-nav-section">Menu</div>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`adm-nav-btn ${tab === n.id ? "active" : ""}`}
              onClick={() => setTab(n.id)}
            >
              <span className="adm-nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className="adm-main">
          {tab === "dashboard" && (
            <TopStats
              profiles={profiles}
              isLoading={isLoading}
              totalCount={totalCount}
              withoutMobileCount={withoutMobileCount}
              withoutAddressCount={withoutAddressCount}
              withoutBusinessAddressCount={withoutBusinessAddressCount}
            />
          )}

          {tab === "edit" && (
            <div className="adm-edit-layout">
              <SidebarList
                profiles={profiles}
                selectedProfile={selectedProfile}
                setSelectedProfile={setSelectedProfile}
                isLoading={isLoading}
                totalCount={totalCount}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                goToPage={goToPage}
              />

              {/* Right Side - Profile Detail */}
              <div className="adm-detail-wrapper">
                <div className="adm-detail-panel">
                  <ProfileDetail
                    profile={selectedProfile}
                    onDelete={deleteProfile}
                    onUpdate={updateProfile}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}