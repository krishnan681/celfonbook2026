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
  fetchPlaybooks,
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

export const DEFAULT_PLAYBOOKS_FALLBACK = [
  {
    id: 1,
    title: "Directory 2023",
    image_url:
      "https://nryjcdhvqsywptlwdymx.supabase.co/storage/v1/object/public/tiles/2023.jpg",
    redirect_url:
      "https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_Signpost_COIMBATORE_2023?id=wrLBEAAAQBAJ&hl=en_IN",
  },
  {
    id: 2,
    title: "Coimbatore Industrial Directory 2026",
    image_url:
      "https://nryjcdhvqsywptlwdymx.supabase.co/storage/v1/object/public/tiles/2026.jpg",
    redirect_url:
      "https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_COIMBATORE_2025_26_Indust?id=sCE6EQAAQBAJ&hl=en_IN",
  },
  {
    id: 3,
    title: "Coimbatore North",
    image_url:
      "https://nryjcdhvqsywptlwdymx.supabase.co/storage/v1/object/public/tiles/2020.jpg",
    redirect_url:
      "https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_Chief_Editor_COIMBATORE_N?id=nCpLDwAAQBAJ&hl=en_IN",
  },
];

export const useHomeController = () => {
  const [onlineDirectories, setOnlineDirectories] = useState([]);
  const [expos, setExpos] = useState([]);
  const [popularFirms, setPopularFirms] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [directories, expoData, firms, clubsData, playbooksData] =
        await Promise.all([
          fetchOnlineDirectories(),
          fetchExpos(),
          fetchPopularFirms(),
          fetchClubs(),
          fetchPlaybooks(),
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

      // If backend returns playbooks from database, use them; otherwise use default playbooks fallback
      if (playbooksData && playbooksData.length > 0) {
        setPlaybooks(playbooksData);
      } else {
        setPlaybooks(DEFAULT_PLAYBOOKS_FALLBACK);
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
    playbooks,
    loading,
    error,
    reload: loadAllData,
  };
};