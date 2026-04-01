import { useState, useEffect } from "react";
import { supabase } from "../../../core/config/supabaseClient";
import Swal from "sweetalert2";
import "../css/favorites.css";

export default function FavoritesView({
  groups,
  favorites,
  selectedGroupId,
  setSelectedGroupId,
  fetchFavorites,
  loading,
}) {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [message, setMessage] = useState(
    "I Saw Your Listing in SIGNPOST PHONE BOOK. I am Interested in your Products."
  );
  const maxLength = 160;

  useEffect(() => {
    setSelectedMembers([]);
  }, [selectedGroupId]);

  const toggleMember = (mobile) => {
    if (selectedMembers.includes(mobile)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== mobile));
    } else {
      if (selectedMembers.length >= 10) {
        Swal.fire({
          icon: "error",
          title: "Limit Reached",
          text: "Maximum 10 members allowed",
        });
        return;
      }
      setSelectedMembers([...selectedMembers, mobile]);
    }
  };

  const sendSMS = async () => {
    if (!message.trim()) {
      await Swal.fire({ icon: "error", title: "Message Required", text: "Message cannot be empty" });
      return;
    }
    if (selectedMembers.length === 0) {
      await Swal.fire({ icon: "error", title: "No Recipients", text: "Select at least one member" });
      return;
    }

    const result = await Swal.fire({
      title: "Send SMS?",
      text: `This will open your SMS app for ${selectedMembers.length} recipient(s).`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Send",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    const numbers = selectedMembers.join(",");
    window.location.href = `sms:${numbers}?body=${encodeURIComponent(message)}`;
  };

  const deleteSelectedMembers = async () => {
    if (selectedMembers.length === 0) return;

    const result = await Swal.fire({
      title: `Remove ${selectedMembers.length} member(s)?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("group_id", selectedGroupId)
        .in("mobile_number", selectedMembers);

      if (error) throw error;

      await Swal.fire({
        icon: "success",
        title: "Members Removed",
        text: "Selected members deleted successfully.",
      });

      setSelectedMembers([]);
      fetchFavorites(selectedGroupId);
    } catch (err) {
      await Swal.fire({ icon: "error", title: "Deletion Failed", text: "Something went wrong." });
    }
  };

  const deleteGroup = async (e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Delete Group?",
      text: "This will permanently delete the group and all its members.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await supabase.from("favorites").delete().eq("group_id", selectedGroupId);
      const { error } = await supabase.from("groups").delete().eq("id", selectedGroupId);

      if (error) throw error;

      await Swal.fire({
        icon: "success",
        title: "Group Deleted",
      });

      setSelectedGroupId(null);
    } catch (err) {
      await Swal.fire({ icon: "error", title: "Delete Failed" });
    }
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <div className="favorites-layout">
      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Favorites Dashboard</h1>
          <div className="selected-count">
            {selectedMembers.length} Selected
          </div>
        </div>

        <div className="dashboard-content">
          {/* Groups Section */}
          <div className="groups-section">
            <h2 className="section-title">Your Groups ({groups.length})</h2>

            <div className="groups-grid">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`group-card ${selectedGroupId === group.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    fetchFavorites(group.id);
                  }}
                >
                  <div className="group-info">
                    <strong>{group.name}</strong>
                    <span className="group-count">
                      {favorites.length} members {/* Updated to show actual count when selected */}
                    </span>
                  </div>

                  {selectedGroupId === group.id && (
                    <button className="delete-group-btn" onClick={deleteGroup}>
                      Delete
                    </button>
                  )}
                </div>
              ))}

              {groups.length === 0 && (
                <p className="empty-text">No groups yet. Create your first group!</p>
              )}
            </div>
          </div>

          {/* Members Section */}
          {selectedGroupId && (
            <>
              <div className="members-header">
                <h2>
                  Members in "{groups.find((g) => g.id === selectedGroupId)?.name}"
                </h2>
                <span className="member-total">({favorites.length} total)</span>
              </div>

              {selectedMembers.length > 0 && (
                <button className="delete-selected-btn" onClick={deleteSelectedMembers}>
                  Remove Selected ({selectedMembers.length})
                </button>
              )}

              <div className="member-grid">
                {favorites.map((fav) => {
                  const mobile = fav.mobile_number || "";
                  const name = fav.business_name || fav.person_name || "Unknown";
                  const isSelected = selectedMembers.includes(mobile);

                  return (
                    <div
                      key={fav.id}
                      className={`member-card ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleMember(mobile)}
                    >
                      <div className="avatar">{name.charAt(0).toUpperCase()}</div>
                      <div className="member-info">
                        <strong>{name}</strong>
                        <span>{mobile}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="member-checkbox"
                      />
                    </div>
                  );
                })}

                {favorites.length === 0 && (
                  <p className="empty-text">No members found in this group.</p>
                )}
              </div>
            </>
          )}

          {/* SMS Campaign Section */}
          <div className="composer-card">
            <h2>Send SMS Campaign</h2>
            <div className="input-group">
              <textarea
                rows="4"
                value={message}
                maxLength={maxLength}
                onChange={(e) => setMessage(e.target.value)}
              />
              <span className="char-count">{maxLength - message.length}</span>
            </div>
            <button className="send-btn" onClick={sendSMS}>
              Send SMS ({selectedMembers.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}