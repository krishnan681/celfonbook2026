// import { useEffect, useState } from "react";
// import { supabase } from "../../../core/config/supabaseClient";

// export default function useAdminController() {

//   // ✅ Persist page (CRITICAL FIX)
//   const [page, setPage] = useState(() => {
//     return Number(localStorage.getItem("admin_page")) || 1;
//   });

//   const [profiles, setProfiles] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const limit = 20;
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);

//   const [search, setSearch] = useState("");

//   // ✅ persist page
//   useEffect(() => {
//     localStorage.setItem("admin_page", page);
//   }, [page]);

//   // ================= FETCH =================
//   const fetchProfiles = async () => {
//     setLoading(true);

//     try {
//       const from = (page - 1) * limit;
//       const to = from + limit - 1;

//       let query = supabase
//         .from("profiles")
//         .select("*", { count: "exact", head: false })
//         .order("created_at", { ascending: false })
//         .range(from, to);

//       if (search) {
//         query = query.or(
//           `person_name.ilike.%${search}%,business_name.ilike.%${search}%,mobile_number.ilike.%${search}%`
//         );
//       }

//       const { data, count, error } = await query;

//       if (error) {
//         console.error("Fetch error:", error);
//         return;
//       }

//       setProfiles(data || []);

//       if (count !== null) {
//         setTotalCount(count);
//         setTotalPages(Math.max(1, Math.ceil(count / limit)));
//       }

//       // console.log("PAGE:", page, "COUNT:", count);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FETCH TRIGGER
//   useEffect(() => {
//     fetchProfiles();
//   }, [page, search]);

//   // ================= SEARCH =================
//   const searchProfiles = (q) => {
//     setSearch(q);
//     setPage(1); // reset only when real search
//   };

//   // ================= UPDATE =================
//   const updateProfile = async (updated) => {
//     const forbidden = ["id", "created_at", "updated_at"];

//     const clean = Object.fromEntries(
//       Object.entries(updated).filter(([k]) => !forbidden.includes(k))
//     );

//     const { error } = await supabase
//       .from("profiles")
//       .update(clean)
//       .eq("id", updated.id);

//     if (error) {
//       console.error("Update error:", error);
//       return;
//     }

//     fetchProfiles();
//     setSelected(updated);
//   };

//   // ================= DELETE =================
//   const deleteProfile = async (id) => {
//     await supabase.from("profiles").delete().eq("id", id);
//     fetchProfiles();
//     setSelected(null);
//   };

//   return {
//     loading,
//     profiles,
//     selected,
//     setSelected,
//     page,
//     setPage,
//     totalPages,
//     totalCount,
//     searchProfiles,
//     updateProfile,
//     deleteProfile,
//   };
// }



// src/features/admin/components/controller/useAdminController.js
import { useState, useEffect, useCallback } from "react";

const ITEMS_PER_PAGE = 50;

export default function useAdminController() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [totalCount, setTotalCount] = useState(0);
  const [withoutMobileCount, setWithoutMobileCount] = useState(0);
  const [withoutAddressCount, setWithoutAddressCount] = useState(0);        // address field
  const [withoutBusinessAddressCount, setWithoutBusinessAddressCount] = useState(0); // bussiness_address field

  const [currentPage, setCurrentPage] = useState(1);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const { supabase } = await import("../../../core/config/supabaseClient");

      // Total Profiles
      const { count: total } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Without Mobile Number
      const { count: noMobile } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .or("mobile_number.is.null,mobile_number.eq.");

      // Without Address (personal address)
      const { count: noAddress } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .or("address.is.null,address.eq.");

      // Without Business Address
      const { count: noBusinessAddress } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .or("bussiness_address.is.null,bussiness_address.eq.");

      setTotalCount(total || 0);
      setWithoutMobileCount(noMobile || 0);
      setWithoutAddressCount(noAddress || 0);
      setWithoutBusinessAddressCount(noBusinessAddress || 0);

    } catch (err) {
      console.error("Dashboard stats error:", err);
    }
  }, []);

  const fetchProfiles = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const { supabase } = await import("../../../core/config/supabaseClient");

      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      setProfiles(data || []);
      setCurrentPage(page);

      if (data?.length && !selectedProfile) {
        setSelectedProfile(data[0]);
      }
    } catch (err) {
      console.error("Fetch profiles error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProfile]);

  useEffect(() => {
    fetchDashboardStats();
    fetchProfiles(1);
  }, [fetchDashboardStats, fetchProfiles]);

  const deleteProfile = async (id) => {
    if (!window.confirm("Delete this profile permanently?")) return;
    try {
      const { supabase } = await import("../../../core/config/supabaseClient");
      await supabase.from("profiles").delete().eq("id", id);
      fetchDashboardStats();
      fetchProfiles(currentPage);
    } catch (err) {
      alert("Delete failed");
    }
  };

const updateProfile = async (id, updates) => {
  try {
    const { supabase } = await import("../../../core/config/supabaseClient");

    console.log("Update payload:", updates);

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      console.error("❌ Supabase update error:", error);
      alert(error.message);
      return;
    }

    console.log("✅ Updated:", data);

    // Refresh UI
    fetchDashboardStats();
    fetchProfiles(currentPage);

    // Optimistic update
    setSelectedProfile((prev) =>
      prev?.id === id ? { ...prev, ...updates } : prev
    );

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    alert("Update failed");
  }
};

  const goToPage = (page) => {
    if (page < 1 || page > Math.ceil(totalCount / ITEMS_PER_PAGE)) return;
    fetchProfiles(page);
  };

  return {
    profiles,
    selectedProfile,
    setSelectedProfile,
    isLoading,
    totalCount,
    withoutMobileCount,
    withoutAddressCount,
    withoutBusinessAddressCount,     // ← New
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    deleteProfile,
    updateProfile,
    goToPage,
  };
}