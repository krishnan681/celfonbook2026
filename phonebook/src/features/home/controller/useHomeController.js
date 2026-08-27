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




import { useEffect, useState } from "react";
import {
  fetchOnlineDirectories,
  fetchExpos,
  fetchPopularFirms,
  fetchClubs,
} from "../services/homeService";

export const DEFAULT_CLUBS_FALLBACK = [
  {
    id: "lions",
    slug: "lions",
    name: "Lions Clubs International",
    short_name: "Lions Club",
    logo_url: null,
  },
  {
    id: "vasavi",
    slug: "vasavi",
    name: "Vasavi Clubs International",
    short_name: "Vasavi Club",
    logo_url: null,
  },
];

export const useHomeController = () => {
  const [onlineDirectories, setOnlineDirectories] = useState([]);
  const [expos, setExpos] = useState([]);
  const [popularFirms, setPopularFirms] = useState([]);
  const [clubs, setClubs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [directories, expoData, firms, clubsData] = await Promise.all([
        fetchOnlineDirectories(),
        fetchExpos(),
        fetchPopularFirms(),
        fetchClubs(),
      ]);

      setOnlineDirectories(directories);
      setExpos(expoData);
      setPopularFirms(firms);

      // If backend returns clubs from database, use them; otherwise use default clubs fallback
      if (clubsData && clubsData.length > 0) {
        setClubs(clubsData);
      } else {
        setClubs(DEFAULT_CLUBS_FALLBACK);
      }
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
    clubs,
    loading,
    error,
    reload: loadAllData,
  };
};