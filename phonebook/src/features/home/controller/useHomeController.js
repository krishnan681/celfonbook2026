// import { useEffect, useState } from "react";
// import {
//   fetchAllProfiles,
//   getProfiles,
// } from "../../../core/services/profileService";

// export const useHomeController = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const loadProfiles = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       await fetchAllProfiles();
//       const data = getProfiles();

//       setProfiles(data);
//     } catch (err) {
//       setError(err?.message || "Failed to load profiles");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProfiles();
//   }, []);

//   return {
//     profiles,
//     loading,
//     error,
//     reload: loadProfiles,
//   };
// };




// 02-Jun-2026
import { useEffect, useState } from "react";
import {
  fetchOnlineDirectories,
  fetchExpos,
  fetchPopularFirms,
} from "../services/homeService";

export const useHomeController = () => {
  const [onlineDirectories, setOnlineDirectories] = useState([]);
  const [expos, setExpos] = useState([]);
  const [popularFirms, setPopularFirms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [directories, expoData, firms] = await Promise.all([
        fetchOnlineDirectories(),
        fetchExpos(),
        fetchPopularFirms(),
      ]);

      setOnlineDirectories(directories);
      setExpos(expoData);
      setPopularFirms(firms);
    } catch (err) {
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return {
    onlineDirectories,
    expos,
    popularFirms,
    loading,
    error,
    reload: loadAllData,
  };
};