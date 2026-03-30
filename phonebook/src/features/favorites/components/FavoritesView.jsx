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

  /* ========================= */
  /* SEND SMS FUNCTION */
  /* ========================= */

  const sendSMS = async () => {
    if (!message.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Message Required",
        text: "Message cannot be empty",
      });
      return;
    }

    if (selectedMembers.length === 0) {
      await Swal.fire({
        icon: "error",
        title: "No Recipients",
        text: "Select at least one member",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Send SMS?",
      text: `This will open your SMS app for ${selectedMembers.length} recipient(s).`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Send",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
    });

    if (!result.isConfirmed) return;

    const numbers = selectedMembers.join(",");

    await Swal.fire({
      icon: "success",
      title: "Opening SMS App",
      text: "Redirecting to messaging application...",
      timer: 1200,
      showConfirmButton: false,
    });

    window.location.href = `sms:${numbers}?body=${encodeURIComponent(message)}`;
  };

  /* ========================= */
  /* DELETE SELECTED MEMBERS */
  /* ========================= */

  const deleteSelectedMembers = async () => {
    if (selectedMembers.length === 0) {
      await Swal.fire({
        icon: "error",
        title: "No Selection",
        text: "No members selected",
      });
      return;
    }

    const result = await Swal.fire({
      title: `Remove ${selectedMembers.length} member(s)?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
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
        text: "Selected members have been deleted successfully.",
      });

      setSelectedMembers([]);
      fetchFavorites(selectedGroupId);

    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "Something went wrong while deleting members.",
      });
    }
  };

  /* ========================= */
  /* DELETE GROUP */
  /* ========================= */

  const deleteGroup = async () => {
    const result = await Swal.fire({
      title: "Delete Group?",
      text: "This will permanently delete the group and all its members.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await supabase
        .from("favorites")
        .delete()
        .eq("group_id", selectedGroupId);

      const { error } = await supabase
        .from("groups")
        .delete()
        .eq("id", selectedGroupId);

      if (error) throw error;

      await Swal.fire({
        icon: "success",
        title: "Group Deleted",
        text: "Group and its members were deleted successfully.",
      });

      setSelectedGroupId(null);

    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Unable to delete group.",
      });
    }
  };

  /* ========================= */

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <div className="favorites-layout">

      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Favorites CRM</div>

        <div className="sidebar-section">
          <div className="sidebar-title">Groups</div>

          {groups.map((group) => (
            <div
              key={group.id}
              className={`group-tab ${
                selectedGroupId === group.id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedGroupId(group.id);
                fetchFavorites(group.id);
              }}
            >
              <span>{group.name}</span>

              {selectedGroupId === group.id && (
                <button
                  className="icon-del"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGroup();
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>

      <div className="dashboard-main">

        <div className="dashboard-header">
          <h1>Favorites Dashboard</h1>
          <div>{selectedMembers.length} Selected</div>
        </div>

        <div className="dashboard-content">

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Groups</h3>
              <p>{groups.length}</p>
            </div>

            <div className="stat-card">
              <h3>Total Members</h3>
              <p>{favorites.length}</p>
            </div>

            <div className="stat-card">
              <h3>Selected</h3>
              <p>{selectedMembers.length}</p>
            </div>
          </div>

          <div className="composer-card">
            <h2>Send SMS Campaign</h2>

            <div className="input-group">
              <textarea
                rows="3"
                value={message}
                maxLength={maxLength}
                onChange={(e) => setMessage(e.target.value)}
              />
              <span className="char-badge">
                {maxLength - message.length}
              </span>
            </div>

            <button className="send-btn" onClick={sendSMS}>
              Send SMS ({selectedMembers.length})
            </button>
          </div>

          {selectedGroupId ? (
            <div>
              {selectedMembers.length > 0 && (
                <button
                  className="send-btn"
                  style={{ background: "#dc2626", marginBottom: "20px" }}
                  onClick={deleteSelectedMembers}
                >
                  Remove Selected ({selectedMembers.length})
                </button>
              )}

              <div className="member-grid">
                {favorites.map((fav) => {
                  const mobile = fav.mobile_number || "";
                  const name =
                    fav.business_name ||
                    fav.person_name ||
                    "Unknown Member";

                  const isSelected = selectedMembers.includes(mobile);

                  return (
                    <div
                      key={fav.id}
                      className={`member-tile ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() => toggleMember(mobile)}
                    >
                      <div className="tile-avatar">
                        {name.charAt(0).toUpperCase()}
                      </div>

                      <div className="tile-info">
                        <strong>{name}</strong>
                        <span>{mobile}</span>
                      </div>

                      <input
                        type="checkbox"
                        readOnly
                        checked={isSelected}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              Select a group to view members
            </div>
          )}

        </div>
      </div>
    </div>
  );
}