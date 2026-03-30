import { useEffect, useState } from "react";
import { supabase } from "../../../core/config/supabaseClient";

export default function useFavoritesController() {
  const [groups, setGroups] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setGroups(data || []);
    setLoading(false);
  };

  const fetchFavorites = async (groupId) => {
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false });

    setFavorites(data || []);
  };

  useEffect(() => {
    fetchGroups();

    const listener = () => fetchGroups();
    window.addEventListener("favorites-updated", listener);

    return () =>
      window.removeEventListener("favorites-updated", listener);
  }, []);

  return {
    groups,
    favorites,
    selectedGroupId,
    setSelectedGroupId,
    fetchFavorites,
    loading,
  };
}