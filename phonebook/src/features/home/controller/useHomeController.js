import { useEffect, useState } from "react";
import {
  fetchAllProfiles,
  getProfiles,
} from "../../../core/services/profileService";

export const useHomeController = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      await fetchAllProfiles();
      const data = getProfiles();

      setProfiles(data);
    } catch (err) {
      setError(err?.message || "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    reload: loadProfiles,
  };
};
