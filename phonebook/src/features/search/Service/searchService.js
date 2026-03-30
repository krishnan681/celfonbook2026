import { supabase } from "../../../core/config/supabaseClient";

export const SearchService = {
  async searchProfiles(filters, page, pageSize) {
    let query = supabase
      .from("profiles")
      .select("*", { count: "planned" })
      .eq("is_admin", false);

    if (filters.businessName?.trim() || filters.keywords?.trim()) {
      const term = (
        filters.businessName || filters.keywords
      ).trim().replace(/,/g, "");

      query = query.or(
        `business_name.ilike.%${term}%,person_name.ilike.%${term}%,keywords.ilike.%${term}%`
      );
    }

    if (filters.letter) {
      query = query.ilike(
        "business_name",
        `${filters.letter.toUpperCase()}%`
      );
    }

    if (filters.city?.trim()) {
      query = query.ilike("city", `%${filters.city.trim()}%`);
    }

    if (filters.userType) {
      query = query.eq("user_type", filters.userType);
    }

    if (filters.primeOnly) {
      query = query.eq("is_prime", true);
    }

    if (filters.sort === "priority") {
      query = query
        .order("is_prime", { ascending: false })
        .order("is_business", { ascending: false })
        .order("normal_list", { ascending: false })
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });
    }

    if (filters.sort === "views") {
      query = query.order("views", { ascending: false });
    }

    if (filters.sort === "latest") {
      query = query.order("created_at", { ascending: false });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);

    return await query;
  },

  // ✅ NEW: SEARCH LOG FUNCTION (Flutter equivalent)
  async logSearch(query, filter) {
    try {
      if (!query || query.length < 2) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // optional: allow anonymous logging
      const payload = {
        query,
        filter,
        user_id: user?.id || null,
      };

      const { error } = await supabase
        .from("search_logs")
        .insert(payload);

      if (error) {
        console.error("❌ search_logs error:", error.message);
      }
    } catch (err) {
      console.error("❌ search_logs exception:", err);
    }
  },
};