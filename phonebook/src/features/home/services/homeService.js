import { supabase } from "../../../core/config/supabaseClient";

export const fetchOnlineDirectories = async () => {
  const { data, error } = await supabase
    .from("online_directory")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
};

export const fetchExpos = async () => {
  const { data, error } = await supabase
    .from("expo")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;

  return data || [];
};

export const fetchPopularFirms = async () => {
  const { data, error } = await supabase
    .from("popular_firms")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  return data || [];
};

export const fetchClubs = async () => {
  try {
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("fetchClubs notice (fallback will be used if table is not yet populated):", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("fetchClubs error:", err);
    return [];
  }
};