// src/features/admin/components/SidebarList.jsx
import { useState } from "react";
import SearchBar from "./SearchBar";
import '../css/SidebarList.css';

export default function SidebarList({
  profiles,
  selectedProfile,
  setSelectedProfile,
  isLoading,
  totalCount,
  currentPage,
  itemsPerPage,
  goToPage,
}) {
  const [listOpen, setListOpen] = useState(false);

  const handleSelect = (p) => {
    setSelectedProfile(p);
    
    // Small delay to prevent flashing on mobile
    setTimeout(() => {
      setListOpen(false);
    }, 150);
  };

  return (
    <>
      {/* Mobile List Overlay */}
      <div 
        className={`adm-list-overlay ${listOpen ? "open" : ""}`} 
        onClick={() => setListOpen(false)} 
      />

      {/* Profile List Panel */}
      <div className={`adm-list-panel ${listOpen ? "open" : ""}`}>
        <SearchBar
          profiles={profiles}
          selected={selectedProfile}
          onSelect={handleSelect}
          isLoading={isLoading}
          totalCount={totalCount}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          goToPage={goToPage}
        />
      </div>

      {/* Mobile "All Profiles" Button */}
      <button 
        className="adm-mobile-list-btn" 
        onClick={() => setListOpen(true)}
      >
        ☰ All Profiles ({totalCount.toLocaleString()})
      </button>
    </>
  );
}