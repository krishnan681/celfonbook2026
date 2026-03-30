// import { supabase } from "../../../core/config/supabaseClient";

// export const revenueModel = {

//   async getProfileId() {

//     const { data: userData, error: userError } =
//       await supabase.auth.getUser();

//     if (userError || !userData?.user) {
//       console.error("Auth error:", userError);
//       return null;
//     }

//     const authUserId = userData.user.id;

//     const { data, error } = await supabase
//       .from("s_profiles")
//       .select("id")
//       .eq("user_id", authUserId)
//       .single();

//     if (error) {
//       console.error("Profile fetch error:", error);
//       return null;
//     }

//     return data.id;
//   },

//   async fetchLifetimeStats(profileId) {

//     const { data, error } = await supabase
//       .from("data_entry_table")
//       .select("count, earnings")
//       .eq("user_id", profileId);

//     if (error) {
//       console.error("Stats fetch error:", error);
//       return { count: 0, earn: 0 };
//     }

//     let totalCount = 0;
//     let totalEarn = 0;

//     data.forEach(row => {
//       totalCount += row.count || 0;
//       totalEarn += row.earnings || 0;
//     });

//     return {
//       count: totalCount,
//       earn: totalEarn
//     };
//   },

//   async fetchActivities(profileId, start, end) {

//     const { data, error } = await supabase
//       .from("data_entry_name")
//       .select("id, entryname, created_at")
//       .eq("user_id", profileId)
//       .gte("created_at", start)
//       .lte("created_at", end)
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Activity fetch error:", error);
//       return [];
//     }

//     return data || [];
//   }

// };










import { supabase } from "../../../core/config/supabaseClient";

export const revenueModel = {

  async getProfileId() {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error("Auth error:", userError);
      return null;
    }

    const { data, error } = await supabase
      .from("s_profiles")
      .select("id")
      .eq("user_id", userData.user.id)
      .single();

    if (error) {
      console.error("Profile fetch error:", error);
      return null;
    }

    return data.id;
  },

  // ✅ FIX: use RAW table instead of summary
  async fetchLifetimeStats(profileId) {

    const { data, error } = await supabase
      .from("data_entry_name")
      .select("id")
      .eq("user_id", profileId);

    if (error) {
      console.error("Stats fetch error:", error);
      return { count: 0, earn: 0 };
    }

    const totalCount = data.length;
    const totalEarn = totalCount * 2;

    return {
      count: totalCount,
      earn: totalEarn
    };
  },

  async fetchActivities(profileId, start, end) {

    const { data, error } = await supabase
      .from("data_entry_name")
      .select("id, entryname, created_at")
      .eq("user_id", profileId)
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Activity fetch error:", error);
      return [];
    }

    return data || [];
  }

};
