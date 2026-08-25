// src/features/clubs/services/lionsClubService.js
import { supabase } from "../../../core/config/supabaseClient";

/**
 * Expand short post codes to readable titles
 */
const expandPostTitle = (post) => {
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
const checkIsLeadership = (post) => {
  if (!post) return false;
  const lower = post.trim().toLowerCase();
  if (!lower || lower === "member" || lower === "user" || lower === "general member") {
    return false;
  }
  return true;
};

/**
 * Normalize raw Supabase profile row into standard Lions member format
 */
export const normalizeLionsMember = (profile, defaultDistrict = "3242C") => {
  if (!profile) return null;

  const fullName = profile.person_prefix
    ? `${profile.person_prefix} ${profile.person_name || ""}`.trim()
    : profile.person_name || profile.business_name || "Unnamed Lion";

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
    memberNo: profile.member_num || "",
    name: profile.person_name || profile.business_name || "Unnamed Lion",
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
    assn: profile.assn || "Lions",
    district,
    districtId: district,
    club: profile.club || "Lions Club",
    clubName: profile.club || "Lions Club",
    clubId: profile.club ? encodeURIComponent(profile.club.trim()) : "default",
    profileImage: profile.profile_image || "",
    coverImage: profile.cover_image || "",
    isLeadership: isOfficer,
  };
};

/**
 * Fetch all distinct districts and their stats from Supabase profiles
 */
export async function getDistricts() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("district, club, id")
      .not("district", "is", null)
      .neq("district", "");

    if (error) throw error;

    if (!data || data.length === 0) {
      return [
        {
          id: "3242C",
          name: "District 3242C",
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
      totalClubs: d.clubsSet.size,
      totalMembers: d.totalMembers,
    }));
  } catch (err) {
    console.error("Error fetching districts from Supabase:", err);
    return [
      {
        id: "3242C",
        name: "District 3242C",
        totalClubs: 0,
        totalMembers: 0,
      },
    ];
  }
}

/**
 * Fetch all distinct clubs and normalized members for a given district in a single query
 */
export async function getDistrictData(districtId) {
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
    if (rawData.length === 0) {
      const { data: fallbackData } = await supabase
        .from("profiles")
        .select("*")
        .ilike("assn", "%Lions%");

      rawData = fallbackData || [];
    }

    const clubs = groupProfilesIntoClubs(rawData, cleanDist);
    const members = rawData.map((row) => normalizeLionsMember(row, cleanDist));

    return { clubs, members };
  } catch (err) {
    console.error("Error fetching district data from Supabase:", err);
    return { clubs: [], members: [] };
  }
}

/**
 * Fetch all distinct clubs and member statistics for a given district
 */
export async function getClubsByDistrict(districtId) {
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

    if (!data || data.length === 0) {
      // Fallback: If district was not set on some rows, query by assn='Lions'
      const { data: fallbackData } = await supabase
        .from("profiles")
        .select("*")
        .ilike("assn", "%Lions%");

      if (fallbackData && fallbackData.length > 0) {
        return groupProfilesIntoClubs(fallbackData, cleanDist);
      }
      return [];
    }

    return groupProfilesIntoClubs(data, cleanDist);
  } catch (err) {
    console.error("Error fetching clubs from Supabase:", err);
    return [];
  }
}

/**
 * Helper to group profile rows by club name
 */
function groupProfilesIntoClubs(profiles, districtId) {
  const clubMap = new Map();

  profiles.forEach((row) => {
    const rawClub = row.club ? row.club.trim() : "";
    const clubName = rawClub || "General Lions Club";

    if (!clubMap.has(clubName)) {
      const distCode = row.district || districtId || "3242C";
      clubMap.set(clubName, {
        id: encodeURIComponent(clubName),
        districtId: distCode,
        name: clubName,
        shortName: clubName.replace(/^Lions Club of\s+/i, ""),
        clubNo: `LC-${distCode.replace(/\s+/g, "")}`,
        charterDate: "Chartered",
        milestone: "Lions International",
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
export async function getClubMembers(districtId, clubIdentifier) {
  try {
    const decodedClubName = decodeURIComponent(clubIdentifier || "").trim();

    let query = supabase.from("profiles").select("*");

    if (decodedClubName) {
      query = query.ilike("club", `%${decodedClubName}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((row) => normalizeLionsMember(row, districtId));
  } catch (err) {
    console.error("Error fetching club members from Supabase:", err);
    return [];
  }
}

/**
 * Fetch a single member profile by ID
 */
export async function getLionsMemberById(memberId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", memberId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return normalizeLionsMember(data);
  } catch (err) {
    console.error("Error fetching member from Supabase:", err);
    return null;
  }
}

/**
 * Global search across Lions members in Supabase
 */
export async function searchLionsMembers(nameQuery = "", keyQuery = "") {
  try {
    const cleanName = nameQuery.trim();
    const cleanKey = keyQuery.trim();

    if (!cleanName && !cleanKey) return [];

    let query = supabase.from("profiles").select("*");

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

    return (data || []).map((row) => normalizeLionsMember(row));
  } catch (err) {
    console.error("Error searching Lions members in Supabase:", err);
    return [];
  }
}
