// import React, { useState } from "react";
// import { supabase } from "../../../core/config/supabaseClient";
// import "../components/css/FavoriteModal.css";

// const FavoriteModal = ({ show, onClose, selectedItem, onSaved }) => {
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   if (!show || !selectedItem) return null;

//   const businessName =
//     selectedItem.business_name || selectedItem.person_name;
//   const mobile = selectedItem.mobile_number;

//   const options = [
//     { id: "My Buyers", label: "My Buyers", icon: "👤" },
//     { id: "My Sellers", label: "My Sellers", icon: "🏠" },
//     { id: "Family & Friends", label: "Family & Friends", icon: "❤️" },
//     { id: "My List", label: "My List", icon: "📋" },
//   ];

// const handleSave = async () => {
//   if (!selectedOption) return;

//   setIsLoading(true);

//   try {
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       alert("Please login first.");
//       return;
//     }

//     const userId = user.id;

//     // 1️⃣ Check if group exists
//     const { data: existingGroups, error: groupError } =
//       await supabase
//         .from("groups")
//         .select("id")
//         .eq("name", selectedOption)
//         .eq("user_id", userId);

//     if (groupError) throw groupError;

//     let groupId;

//     if (existingGroups && existingGroups.length > 0) {
//       groupId = existingGroups[0].id;
//     } else {
//       const { data: newGroup, error: insertGroupError } =
//         await supabase
//           .from("groups")
//           .insert({
//             name: selectedOption,
//             user_id: userId,
//           })
//           .select()
//           .single();

//       if (insertGroupError) throw insertGroupError;

//       groupId = newGroup.id;
//     }

//     // 2️⃣ Prevent duplicate
//     const { data: duplicate } = await supabase
//       .from("favorites")
//       .select("id")
//       .eq("group_id", groupId)
//       .eq("mobile_number", mobile);

//     if (duplicate && duplicate.length > 0) {
//       alert(`${businessName} already exists in ${selectedOption}`);
//       return;
//     }

//     // 3️⃣ Insert favorite
//     const { error: insertFavError } =
//       await supabase.from("favorites").insert({
//         user_id: userId,
//         group_id: groupId,
//         business_name: selectedItem.business_name,
//         person_name: selectedItem.person_name,
//         mobile_number: mobile,
//       });

//     if (insertFavError) throw insertFavError;

//     if (onSaved) {
//       window.dispatchEvent(new Event("favorites-updated"));
//     }

//     onClose();
//   } catch (error) {
//     console.error("Error saving favorite:", error);
//     alert("Failed to save favorite.");
//   } finally {
//     setIsLoading(false);
//   }
// };

//   return (
//     <div
//       className="favorite-modal-overlay"
//       onClick={onClose}
//     >
//       <div
//         className="favorite-modal-container"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="modal-brand-header">
//           <div className="brand-left">
//             <div className="brand-logo-box">🛍️</div>
//             <span>Favorites</span>
//           </div>
//           <button
//             className="modal-close-x"
//             onClick={onClose}
//           >
//             ×
//           </button>
//         </div>

//         <div className="modal-content-blue">
//           <div className="top-accent-bar"></div>
//           <h2>Save {businessName}</h2>
//           <p className="subtitle">
//             Choose a group to categorize this contact
//           </p>

//           <div className="options-grid">
//             {options.map((o) => (
//               <div
//                 key={o.id}
//                 className={`grid-item ${
//                   selectedOption === o.id ? "selected" : ""
//                 }`}
//                 onClick={() => setSelectedOption(o.id)}
//               >
//                 <span className="item-icon">
//                   {o.icon}
//                 </span>
//                 <span className="item-label">
//                   {o.label}
//                 </span>
//                 <div className="selection-indicator">
//                   {selectedOption === o.id && "✓"}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button
//             className="save-submit-btn"
//             disabled={!selectedOption || isLoading}
//             onClick={handleSave}
//           >
//             {isLoading ? "Saving..." : "Save Contact →"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FavoriteModal;














import React, { useState } from "react";
import { supabase } from "../../../core/config/supabaseClient";
import "../components/css/FavoriteModal.css";

const FavoriteModal = ({ show, onClose, selectedItem, onSaved }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!show || !selectedItem) return null;

  const businessName =
    selectedItem.business_name || selectedItem.person_name;

  const mobile = selectedItem.mobile_number;

  const options = [
    { id: "My Buyers", label: "My Buyers", icon: "👤" },
    { id: "My Sellers", label: "My Sellers", icon: "🏠" },
    { id: "Family & Friends", label: "Family & Friends", icon: "❤️" },
    { id: "My List", label: "My List", icon: "📋" },
  ];

  const handleSave = async () => {
    if (!selectedOption) return;

    setIsLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("Please login first.");
        setIsLoading(false);
        return;
      }

      const userId = user.id;

      // Check if group exists
      const { data: existingGroups, error: groupError } =
        await supabase
          .from("groups")
          .select("id")
          .eq("name", selectedOption)
          .eq("user_id", userId);

      if (groupError) throw groupError;

      let groupId;

      if (existingGroups && existingGroups.length > 0) {
        groupId = existingGroups[0].id;
      } else {
        const { data: newGroup, error: insertGroupError } =
          await supabase
            .from("groups")
            .insert({
              name: selectedOption,
              user_id: userId,
            })
            .select()
            .single();

        if (insertGroupError) throw insertGroupError;

        groupId = newGroup.id;
      }

      // Prevent duplicate
      const { data: duplicate } = await supabase
        .from("favorites")
        .select("id")
        .eq("group_id", groupId)
        .eq("mobile_number", mobile);

      if (duplicate && duplicate.length > 0) {
        alert(`${businessName} already exists in ${selectedOption}`);
        setIsLoading(false);
        return;
      }

      // Insert favorite
      const { error: insertFavError } =
        await supabase.from("favorites").insert({
          user_id: userId,
          group_id: groupId,
          business_name: selectedItem.business_name,
          person_name: selectedItem.person_name,
          mobile_number: mobile,
        });

      if (insertFavError) throw insertFavError;

      if (onSaved) onSaved();

      onClose();
    } catch (error) {
      console.error("Error saving favorite:", error);
      alert("Failed to save favorite.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="favorite-modal-overlay"
      onClick={onClose}
    >
      <div
        className="favorite-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-brand-header">
          <div className="brand-left">
            <div className="brand-logo-box">🛍️</div>
            <span>Favorites</span>
          </div>
          <button
            className="modal-close-x"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-content-blue">
          <div className="top-accent-bar"></div>
          <h2>Save {businessName}</h2>
          <p className="subtitle">
            Choose a group to categorize this contact
          </p>

          <div className="options-grid">
            {options.map((o) => (
              <div
                key={o.id}
                className={`grid-item ${
                  selectedOption === o.id ? "selected" : ""
                }`}
                onClick={() => setSelectedOption(o.id)}
              >
                <span className="item-icon">{o.icon}</span>
                <span className="item-label">{o.label}</span>
                <div className="selection-indicator">
                  {selectedOption === o.id && "✓"}
                </div>
              </div>
            ))}
          </div>

          <button
            className="save-submit-btn"
            disabled={!selectedOption || isLoading}
            onClick={handleSave}
            type="button"
          >
            {isLoading ? "Saving..." : "Save Contact →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteModal;