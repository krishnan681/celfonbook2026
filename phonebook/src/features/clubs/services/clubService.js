// src/features/clubs/services/clubService.js
import { supabase } from "../../../core/config/supabaseClient";

/**
 * Built-in fallback definitions for known clubs when backend table is not yet seeded
 */
export const KNOWN_CLUBS = {
  lions: {
    id: "lions",
    slug: "lions",
    name: "Lions Clubs International",
    short_name: "Lions Club",
    search_keyword: "Lions",
    logo_url: null,
    default_district: "3242C",
    theme_color: "#005a36",
  },
  vasavi: {
    id: "vasavi",
    slug: "vasavi",
    name: "Vasavi Clubs International",
    short_name: "Vasavi Club",
    search_keyword: "Vasavi",
    logo_url: null,
    default_district: "V501A",
    theme_color: "#7c2d12",
  },
};

/**
 * Expand short post codes to readable titles
 */
export const expandPostTitle = (post) => {
  if (!post) return "Member";
  const clean = post.trim();
  const lower = clean.toLowerCase();

  if (lower === "rc") return "Region Chairperson (RC)";
  if (lower === "zc") return "Zone Chairperson (ZC)";
  if (lower === "dc") return "District Chairperson (DC)";
  if (lower === "dg") return "District Governor (DG)";
  if (lower === "vdg1" || lower === "1st vdg") return "First Vice District Governor (1st VDG)";
  if (lower === "vdg2" || lower === "2nd vdg") return "Second Vice District Governor (2nd VDG)";
  if (lower === "cp") return "Charter President";
  if (lower === "cs") return "Charter Secretary";
  if (lower === "ipp") return "Immediate Past President (IPP)";
  return clean;
};

/**
 * Check if a post indicates a designated officer / leader
 */
export const checkIsLeadership = (post) => {
  if (!post) return false;
  const lower = post.trim().toLowerCase();
  if (!lower || lower === "member" || lower === "user" || lower === "general member") {
    return false;
  }
  return true;
};

/**
 * Normalize raw Supabase profile row into standard club member format
 */
export const normalizeMember = (profile, defaultDistrict = "3242C", clubSlug = "lions") => {
  if (!profile) return null;

  const fullName = profile.person_prefix
    ? `${profile.person_prefix} ${profile.person_name || ""}`.trim()
    : profile.person_name || profile.business_name || "Unnamed Member";

  const fullBusinessName = profile.business_prefix
    ? `${profile.business_prefix} ${profile.business_name || ""}`.trim()
    : profile.business_name || "";

  const rawPost = profile.post_of_member || profile.role || "Member";
  const postFull = expandPostTitle(rawPost);
  const isOfficer = checkIsLeadership(rawPost);

  const district = profile.district || defaultDistrict;

  return {
    ...profile,
    id: profile.id,
    clubSlug: clubSlug,
    memberNo: profile.member_num || "",
    name: profile.person_name || profile.business_name || "Unnamed Member",
    fullName,
    prefix: profile.person_prefix || "",
    mobile: profile.mobile_number || "",
    phone: profile.mobile_number || profile.landline || "",
    post: rawPost,
    postFull: postFull,
    businessName: profile.business_name || "",
    businessPrefix: profile.business_prefix || "",
    fullBusinessName,
    keywords: profile.keywords || "",
    profession: profile.activity || profile.keywords || profile.description || "",
    description: profile.description || "",
    city: profile.city || "Coimbatore",
    pincode: profile.pincode || "",
    email: profile.email || "",
    address: profile.address || profile.bussiness_address || "",
    dob: profile.DOB || profile.dob || "",
    birthday: profile.DOB || profile.dob || "",
    dow: profile.DOW || profile.dow || "",
    anniversary: profile.DOW || profile.dow || "",
    spouse: profile.spouse || "",
    bloodGroup: profile.blood_group || "",
    assn: profile.assn || "Club",
    district,
    districtId: district,
    club: profile.club || "Club",
    clubName: profile.club || "Club",
    clubId: profile.club ? encodeURIComponent(profile.club.trim()) : "default",
    profileImage: profile.profile_image || "",
    coverImage: profile.cover_image || "",
    isLeadership: isOfficer,
  };
};

/**
 * Fetch club metadata by slug from Supabase `clubs` table (with fallback)
 */
export async function getClubInfo(clubSlug = "lions") {
  const cleanSlug = (clubSlug || "lions").toLowerCase().trim();

  try {
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (error) {
      console.warn(`Club query for slug "${cleanSlug}" returned error:`, error.message);
    }

    if (data) {
      return {
        ...data,
        slug: data.slug,
        name: data.name,
        short_name: data.short_name || data.name,
        search_keyword: data.short_name || data.name,
        logo_url: data.logo_url || null,
        theme_color: cleanSlug === "vasavi" ? "#7c2d12" : "#005a36",
      };
    }
  } catch (err) {
    console.error("Error in getClubInfo:", err);
  }

  // Fallback to known clubs if not in DB yet
  if (KNOWN_CLUBS[cleanSlug]) {
    return KNOWN_CLUBS[cleanSlug];
  }

  // Generic fallback for any new slug
  const title = cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);
  return {
    id: cleanSlug,
    slug: cleanSlug,
    name: `${title} Club International`,
    short_name: `${title} Club`,
    search_keyword: title,
    logo_url: null,
    default_district: "General",
    theme_color: "#005a36",
  };
}

/**
 * Fetch all distinct districts and stats for a given club slug
 */
export async function getDistricts(clubSlug = "lions") {
  const clubInfo = await getClubInfo(clubSlug);
  const searchKeyword = clubInfo.search_keyword || clubSlug;

  try {
    // 1. Check if districts are defined in public.club_districts
    if (clubInfo && clubInfo.id) {
      const { data: dbDistricts, error: distErr } = await supabase
        .from("club_districts")
        .select("*")
        .eq("club_id", clubInfo.id)
        .order("sort_order", { ascending: true });

      if (!distErr && dbDistricts && dbDistricts.length > 0) {
        // Query profiles for member counts in parallel
        const { data: profs } = await supabase
          .from("profiles")
          .select("district, club");

        return dbDistricts.map((d) => {
          const code = (d.district_code || "").trim();
          const matchingProfs = (profs || []).filter(
            (p) => (p.district || "").trim().toLowerCase() === code.toLowerCase()
          );
          const clubsSet = new Set(
            matchingProfs
              .map((p) => (p.club || "").trim())
              .filter(Boolean)
          );

          return {
            id: code,
            name: d.district_name || `District ${code}`,
            logo_url: d.logo_url || clubInfo.logo_url || null,
            totalClubs: clubsSet.size,
            totalMembers: matchingProfs.length,
          };
        });
      }
    }

    // 2. Fallback: Query unique districts from profiles table directly
    let query = supabase
      .from("profiles")
      .select("district, club, id, assn")
      .not("district", "is", null)
      .neq("district", "");

    if (searchKeyword && searchKeyword.toLowerCase() !== "all") {
      query = query.ilike("assn", `%${searchKeyword}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) {
      return [
        {
          id: clubInfo.default_district || "3242C",
          name: `District ${clubInfo.default_district || "3242C"}`,
          logo_url: clubInfo.logo_url || null,
          totalClubs: 0,
          totalMembers: 0,
        },
      ];
    }

    // Group by district name
    const districtMap = new Map();

    data.forEach((row) => {
      const dist = (row.district || "").trim();
      if (!dist) return;

      if (!districtMap.has(dist)) {
        districtMap.set(dist, {
          id: dist,
          name: dist.toLowerCase().startsWith("district") ? dist : `District ${dist}`,
          logo_url: clubInfo.logo_url || null,
          clubsSet: new Set(),
          totalMembers: 0,
        });
      }

      const item = districtMap.get(dist);
      item.totalMembers += 1;
      if (row.club && row.club.trim()) {
        item.clubsSet.add(row.club.trim());
      }
    });

    return Array.from(districtMap.values()).map((d) => ({
      id: d.id,
      name: d.name,
      logo_url: d.logo_url,
      totalClubs: d.clubsSet.size,
      totalMembers: d.totalMembers,
    }));
  } catch (err) {
    console.error("Error fetching districts from Supabase:", err);
    return [
      {
        id: clubInfo.default_district || "3242C",
        name: `District ${clubInfo.default_district || "3242C"}`,
        logo_url: clubInfo.logo_url || null,
        totalClubs: 0,
        totalMembers: 0,
      },
    ];
  }
}

/**
 * Fetch all distinct clubs and normalized members for a given district
 */
export async function getDistrictData(districtId, clubSlug = "lions") {
  try {
    let cleanDist = (districtId || "").trim();
    let query = supabase.from("profiles").select("*");

    if (cleanDist) {
      const distNoSpace = cleanDist.replace(/\s+/g, "");
      query = query.or(
        `district.eq.${cleanDist},district.ilike.%${cleanDist}%,district.ilike.%${distNoSpace}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    let rawData = data || [];
    if (rawData.length === 0 && clubSlug) {
      const clubInfo = await getClubInfo(clubSlug);
      const { data: fallbackData } = await supabase
        .from("profiles")
        .select("*")
        .ilike("assn", `%${clubInfo.search_keyword || clubSlug}%`);

      rawData = fallbackData || [];
    }

    const clubs = groupProfilesIntoClubs(rawData, cleanDist, clubSlug);
    const members = rawData.map((row) => normalizeMember(row, cleanDist, clubSlug));

    return { clubs, members };
  } catch (err) {
    console.error("Error fetching district data from Supabase:", err);
    return { clubs: [], members: [] };
  }
}

/**
 * Fetch all clubs for a given district
 */
export async function getClubsByDistrict(districtId, clubSlug = "lions") {
  const data = await getDistrictData(districtId, clubSlug);
  return data.clubs || [];
}

/**
 * Helper to group profile rows by club name
 */
function groupProfilesIntoClubs(profiles, districtId, clubSlug = "lions") {
  const clubMap = new Map();

  profiles.forEach((row) => {
    const rawClub = row.club ? row.club.trim() : "";
    const clubName = rawClub || "General Club";

    if (!clubMap.has(clubName)) {
      const distCode = row.district || districtId || "3242C";
      clubMap.set(clubName, {
        id: encodeURIComponent(clubName),
        districtId: distCode,
        name: clubName,
        shortName: clubName.replace(/^(Lions|Vasavi|Rotary)\s+Club\s+of\s+/i, ""),
        clubNo: `${clubSlug.toUpperCase().slice(0, 2)}-${distCode.replace(/\s+/g, "")}`,
        charterDate: "Chartered",
        milestone: "International",
        totalMembers: 0,
        members: [],
      });
    }

    const club = clubMap.get(clubName);
    club.totalMembers += 1;
    club.members.push(row);
  });

  return Array.from(clubMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

/**
 * Fetch all members belonging to a specific club
 */
export async function getClubMembers(districtId, clubIdentifier, clubSlug = "lions") {
  try {
    const decodedClubName = decodeURIComponent(clubIdentifier || "").trim();

    let query = supabase.from("profiles").select("*");

    if (decodedClubName) {
      query = query.ilike("club", `%${decodedClubName}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((row) => normalizeMember(row, districtId, clubSlug));
  } catch (err) {
    console.error("Error fetching club members from Supabase:", err);
    return [];
  }
}

/**
 * Fetch a single member profile by ID
 */
export async function getMemberById(memberId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", memberId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const clubSlug = (data.assn || "").toLowerCase().includes("vasavi")
      ? "vasavi"
      : "lions";

    return normalizeMember(data, data.district || "3242C", clubSlug);
  } catch (err) {
    console.error("Error fetching member from Supabase:", err);
    return null;
  }
}

/**
 * Helper to check if a date matches today's month and day (DD/MM)
 */
export function isDateToday(dateStr) {
  if (!dateStr) return false;
  try {
    // Supports YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY
    let day, month;
    if (typeof dateStr === "string" && dateStr.includes("-")) {
      const parts = dateStr.split("-");
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      } else {
        // DD-MM-YYYY
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
      }
    } else if (typeof dateStr === "string" && dateStr.includes("/")) {
      const parts = dateStr.split("/");
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
    } else {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      day = d.getDate();
      month = d.getMonth();
    }

    const now = new Date();
    return day === now.getDate() && month === now.getMonth();
  } catch (e) {
    return false;
  }
}

/**
 * Fetch Today's Birthday & Wedding Anniversary Celebrations directly from profiles table
 */
export async function getClubCelebrations(clubSlug = "lions", districtId = null) {
  try {
    let query = supabase.from("profiles").select("*");

    // Strict club isolation
    if (clubSlug === "vasavi") {
      query = query.or("assn.ilike.%vasavi%,district.eq.V501A");
    } else if (clubSlug === "lions") {
      query = query.or("assn.ilike.%lion%,district.eq.3241D,district.eq.3242C");
    } else {
      const clubInfo = await getClubInfo(clubSlug);
      if (clubInfo.search_keyword) {
        query = query.ilike("assn", `%${clubInfo.search_keyword}%`);
      }
    }

    if (districtId) {
      query = query.eq("district", districtId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const celebrations = [];

    (data || []).forEach((row) => {
      const member = normalizeMember(row, districtId || "3242C", clubSlug);

      if (isDateToday(row.DOB)) {
        celebrations.push({
          id: `${row.id}-dob`,
          memberId: row.id,
          type: "BIRTHDAY",
          title: "Happy Birthday! 🎂",
          date: row.DOB,
          member,
        });
      }

      if (isDateToday(row.DOW)) {
        celebrations.push({
          id: `${row.id}-dow`,
          memberId: row.id,
          type: "ANNIVERSARY",
          title: "Happy Wedding Anniversary! 💍",
          date: row.DOW,
          spouse: row.spouse || "",
          member,
        });
      }
    });

    return celebrations;
  } catch (err) {
    console.error("Error fetching club celebrations:", err);
    return [];
  }
}

/**
 * Global search strictly isolated to a specific club
 */
export async function searchClubMembers(clubSlug = "lions", nameQuery = "", keyQuery = "") {
  try {
    const cleanName = nameQuery.trim();
    const cleanKey = keyQuery.trim();

    if (!cleanName && !cleanKey) return [];

    let query = supabase.from("profiles").select("*");

    // Strict club isolation
    if (clubSlug === "vasavi") {
      query = query.or("assn.ilike.%vasavi%,district.eq.V501A");
    } else if (clubSlug === "lions") {
      query = query.or("assn.ilike.%lion%,district.eq.3241D,district.eq.3242C");
    } else {
      const clubInfo = await getClubInfo(clubSlug);
      if (clubInfo.search_keyword) {
        query = query.ilike("assn", `%${clubInfo.search_keyword}%`);
      }
    }

    if (cleanName) {
      query = query.or(
        `person_name.ilike.%${cleanName}%,business_name.ilike.%${cleanName}%,keywords.ilike.%${cleanName}%`
      );
    }

    if (cleanKey) {
      query = query.or(
        `member_num.ilike.%${cleanKey}%,mobile_number.ilike.%${cleanKey}%,keywords.ilike.%${cleanKey}%`
      );
    }

    const { data, error } = await query.limit(100);
    if (error) throw error;

    // Filter out rows from other clubs in case of loose or query
    const filtered = (data || []).filter((row) => {
      const assn = (row.assn || "").toLowerCase();
      const dist = (row.district || "").toUpperCase();
      if (clubSlug === "vasavi") {
        return assn.includes("vasavi") || dist === "V501A";
      } else if (clubSlug === "lions") {
        return (assn.includes("lion") || dist === "3241D" || dist === "3242C") && !assn.includes("vasavi");
      }
      return true;
    });

    return filtered.map((row) => normalizeMember(row, row.district || "3242C", clubSlug));
  } catch (err) {
    console.error("Error searching club members in Supabase:", err);
    return [];
  }
}
