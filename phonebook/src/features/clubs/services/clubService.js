// src/features/clubs/services/clubService.js
import { supabase } from "../../../core/config/supabaseClient";
import { cacheService } from "../../../core/services/cacheService";
import {
  formatPersonNameWithPrefix,
  getClubPrefixForProfile,
} from "../../../core/utils/nameHelper";
import lionsDefaultLogo from "../../../assets/images/Clubs/Lions_Clubs_International_logo.svg";
import vasaviDefaultLogo from "../../../assets/images/Clubs/Vasavi.png";

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
    logo_url: lionsDefaultLogo,
    default_district: "3242C",
    theme_color: "#005a36",
  },
  vasavi: {
    id: "vasavi",
    slug: "vasavi",
    name: "Vasavi Clubs International",
    short_name: "Vasavi Club",
    search_keyword: "Vasavi",
    logo_url: vasaviDefaultLogo,
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

  const fallbackPrefix = (clubSlug || "").toLowerCase() === "vasavi" ? "Vn" : "Lion";
  const formattedPersonName = formatPersonNameWithPrefix(profile, fallbackPrefix);
  const fullName =
    formattedPersonName ||
    profile.person_name ||
    profile.business_name ||
    "Unnamed Member";

  const memberPrefix = getClubPrefixForProfile(profile, fallbackPrefix);

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
    name: fullName,
    fullName,
    prefix: memberPrefix,
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
  const fallbackLogo = clubSlug === "vasavi" ? vasaviDefaultLogo : lionsDefaultLogo;

  // Helper to format clean district name without "District " prefix
  const cleanDistrictTitle = (name, code) => {
    if (code && code.trim()) {
      return code.trim().replace(/^District\s+/i, "");
    }
    if (name && name.trim()) {
      return name.trim().replace(/^District\s+/i, "");
    }
    return code || name || "";
  };

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
            name: cleanDistrictTitle(d.district_name, code),
            displayName: cleanDistrictTitle(d.district_name, code),
            fullDistrictName: `District ${cleanDistrictTitle(d.district_name, code)}`,
            logo_url: d.logo_url || clubInfo.logo_url || fallbackLogo,
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
      const defaultCode = clubInfo.default_district || (clubSlug === "vasavi" ? "V501A" : "3242C");
      return [
        {
          id: defaultCode,
          name: cleanDistrictTitle(defaultCode, defaultCode),
          displayName: cleanDistrictTitle(defaultCode, defaultCode),
          fullDistrictName: `District ${defaultCode}`,
          logo_url: clubInfo.logo_url || fallbackLogo,
          totalClubs: 0,
          totalMembers: 0,
        },
      ];
    }

    // Group by district name
    const districtMap = new Map();

    data.forEach((row) => {
      const rawDist = (row.district || "").trim();
      if (!rawDist) return;
      const cleanCode = cleanDistrictTitle(rawDist, rawDist);

      if (!districtMap.has(cleanCode)) {
        districtMap.set(cleanCode, {
          id: rawDist,
          name: cleanCode,
          displayName: cleanCode,
          fullDistrictName: `District ${cleanCode}`,
          logo_url: clubInfo.logo_url || fallbackLogo,
          clubsSet: new Set(),
          totalMembers: 0,
        });
      }

      const item = districtMap.get(cleanCode);
      item.totalMembers += 1;
      if (row.club && row.club.trim()) {
        item.clubsSet.add(row.club.trim());
      }
    });

    return Array.from(districtMap.values()).map((d) => ({
      id: d.id,
      name: d.name,
      displayName: d.displayName,
      fullDistrictName: d.fullDistrictName,
      logo_url: d.logo_url || fallbackLogo,
      totalClubs: d.clubsSet.size,
      totalMembers: d.totalMembers,
    }));
  } catch (err) {
    console.error("Error fetching districts from Supabase:", err);
    const defaultCode = clubInfo.default_district || (clubSlug === "vasavi" ? "V501A" : "3242C");
    return [
      {
        id: defaultCode,
        name: cleanDistrictTitle(defaultCode, defaultCode),
        displayName: cleanDistrictTitle(defaultCode, defaultCode),
        fullDistrictName: `District ${defaultCode}`,
        logo_url: clubInfo.logo_url || fallbackLogo,
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

const MONTH_NAMES = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

/**
 * Helper to parse a date string into { month (0-11), day (1-31) }
 */
export function parseDateMonthDay(dateStr) {
  if (!dateStr) return null;
  try {
    if (dateStr instanceof Date && !isNaN(dateStr.getTime())) {
      return { month: dateStr.getMonth(), day: dateStr.getDate() };
    }

    const str = String(dateStr).trim();
    if (!str) return null;

    // Check ISO or standard timestamp format (e.g. 2024-08-15T00:00:00Z)
    if (str.includes("T") || str.includes(":")) {
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        return { month: d.getMonth(), day: d.getDate() };
      }
    }

    // Replace various delimiters with a single hyphen: '/', '.', ' ', ','
    const normalized = str.replace(/[\/,\.\s]+/g, "-");
    const parts = normalized.split("-").filter(Boolean);

    let day, month;

    if (parts.length >= 2) {
      const p0 = parts[0].toLowerCase();
      const p1 = parts[1].toLowerCase();

      // Check if text month name is in part 0 or 1
      if (MONTH_NAMES[p0] !== undefined) {
        month = MONTH_NAMES[p0];
        day = parseInt(p1, 10);
      } else if (MONTH_NAMES[p1] !== undefined) {
        month = MONTH_NAMES[p1];
        day = parseInt(p0, 10);
      } else if (parts[0].length === 4) {
        // YYYY-MM-DD
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2] || parts[1], 10);
      } else if (parts.length >= 3 && parts[2].length === 4) {
        // DD-MM-YYYY (Standard Indian / Global)
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
      } else {
        // General 2-part or 3-part: DD-MM
        const num0 = parseInt(parts[0], 10);
        const num1 = parseInt(parts[1], 10);
        if (num0 > 12) {
          day = num0;
          month = num1 - 1;
        } else if (num1 > 12) {
          day = num1;
          month = num0 - 1;
        } else {
          // Default DD-MM
          day = num0;
          month = num1 - 1;
        }
      }
    } else {
      const d = new Date(str);
      if (isNaN(d.getTime())) return null;
      day = d.getDate();
      month = d.getMonth();
    }

    if (isNaN(day) || isNaN(month) || month < 0 || month > 11 || day < 1 || day > 31) {
      return null;
    }
    return { month, day };
  } catch (e) {
    return null;
  }
}

/**
 * Calculate celebration days difference from today (-180 to +180)
 */
export function getDaysDifferenceFromToday(month, day) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const today = new Date(currentYear, now.getMonth(), now.getDate());

  let targetThisYear = new Date(currentYear, month, day);
  let diffTime = targetThisYear.getTime() - today.getTime();
  let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Handle year boundaries (e.g. late Dec -> early Jan)
  if (diffDays < -180) {
    const targetNextYear = new Date(currentYear + 1, month, day);
    diffDays = Math.round((targetNextYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  } else if (diffDays > 180) {
    const targetPrevYear = new Date(currentYear - 1, month, day);
    diffDays = Math.round((targetPrevYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  return diffDays;
}

/**
 * Format month and day to friendly readable string (e.g. "28 Aug", "14 Oct")
 */
export function formatMonthDayReadable(month, day) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${day} ${months[month] || ""}`;
}

/**
 * Helper to check if a date matches today's month and day (DD/MM)
 */
export function isDateToday(dateStr) {
  const parsed = parseDateMonthDay(dateStr);
  if (!parsed) return false;
  const now = new Date();
  return parsed.day === now.getDate() && parsed.month === now.getMonth();
}

/**
 * Fetch Today's Birthday & Wedding Anniversary Celebrations directly from profiles table
 */
export async function getClubCelebrations(clubSlug = "lions", districtId = null) {
  try {
    const timeline = await getClubCelebrationsTimeline(clubSlug, districtId);
    return timeline.today || [];
  } catch (err) {
    console.error("Error fetching club celebrations:", err);
    return [];
  }
}

/**
 * Comprehensive Celebrations Timeline:
 * Categorizes all member birthdays and anniversaries into:
 * - today (diffDays === 0)
 * - tomorrow (diffDays === 1)
 * - thisWeek (diffDays 0 to 7)
 * - thisMonth (diffDays 0 to 30)
 * - upcoming (all future events within 60 days)
 * - recentPast (diffDays -1 to -7 for belated wishes)
 * - all (all sorted from next upcoming)
 */
export async function getClubCelebrationsTimeline(
  clubSlug = "lions",
  districtId = null,
  _clubName = null
) {
  // District-wide celebration cache key: celebrations must not vary by club
  const cacheKey = `celebrations_${clubSlug}_${districtId || "all"}`;
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

    let { data, error } = await query;
    if (error) throw error;

    // Fallback if specific district has no records
    if (!data || data.length === 0) {
      const fallbackDistrict = clubSlug === "vasavi" ? "V501A" : "3242C";
      const fallbackQuery = supabase
        .from("profiles")
        .select("*")
        .eq("district", fallbackDistrict);
      const { data: fbData } = await fallbackQuery;
      if (fbData && fbData.length > 0) {
        data = fbData;
      }
    }

    const allEvents = [];

    (data || []).forEach((row) => {
      const member = normalizeMember(row, districtId || "3242C", clubSlug);

      // 1. Process Date of Birth (DOB)
      const dobParsed = parseDateMonthDay(row.DOB || row.dob);
      if (dobParsed) {
        const diffDays = getDaysDifferenceFromToday(dobParsed.month, dobParsed.day);
        allEvents.push({
          id: `${row.id}-dob`,
          memberId: row.id,
          type: "BIRTHDAY",
          title: "Birthday 🎂",
          dateFormatted: formatMonthDayReadable(dobParsed.month, dobParsed.day),
          rawDate: row.DOB || row.dob,
          month: dobParsed.month,
          day: dobParsed.day,
          diffDays,
          status:
            diffDays === 0
              ? "Today"
              : diffDays === 1
              ? "Tomorrow"
              : diffDays > 1
              ? `In ${diffDays} days`
              : diffDays === -1
              ? "Yesterday"
              : `${Math.abs(diffDays)} days ago`,
          member,
        });
      }

      // 2. Process Date of Wedding (DOW)
      const dowParsed = parseDateMonthDay(row.DOW || row.dow);
      if (dowParsed) {
        const diffDays = getDaysDifferenceFromToday(dowParsed.month, dowParsed.day);
        allEvents.push({
          id: `${row.id}-dow`,
          memberId: row.id,
          type: "ANNIVERSARY",
          title: "Wedding Anniversary 💍",
          dateFormatted: formatMonthDayReadable(dowParsed.month, dowParsed.day),
          rawDate: row.DOW || row.dow,
          month: dowParsed.month,
          day: dowParsed.day,
          diffDays,
          spouse: row.spouse || "",
          status:
            diffDays === 0
              ? "Today"
              : diffDays === 1
              ? "Tomorrow"
              : diffDays > 1
              ? `In ${diffDays} days`
              : diffDays === -1
              ? "Yesterday"
              : `${Math.abs(diffDays)} days ago`,
          member,
        });
      }
    });

    // Sort chronologically starting from today, upcoming (diffDays >= 0 ascending), then recent past
    const today = allEvents.filter((e) => e.diffDays === 0);
    const tomorrow = allEvents.filter((e) => e.diffDays === 1);
    const thisWeek = allEvents
      .filter((e) => e.diffDays >= 0 && e.diffDays <= 7)
      .sort((a, b) => a.diffDays - b.diffDays);
    const thisMonth = allEvents
      .filter((e) => e.diffDays >= 0 && e.diffDays <= 30)
      .sort((a, b) => a.diffDays - b.diffDays);
    const upcoming = allEvents
      .filter((e) => e.diffDays > 0 && e.diffDays <= 60)
      .sort((a, b) => a.diffDays - b.diffDays);
    const recentPast = allEvents
      .filter((e) => e.diffDays < 0 && e.diffDays >= -7)
      .sort((a, b) => b.diffDays - a.diffDays); // closest past first

    const allSorted = [...allEvents].sort((a, b) => {
      // Prioritize future (0 to positive), followed by past
      const aVal = a.diffDays >= 0 ? a.diffDays : 365 + a.diffDays;
      const bVal = b.diffDays >= 0 ? b.diffDays : 365 + b.diffDays;
      return aVal - bVal;
    });

    const result = {
      today,
      tomorrow,
      thisWeek,
      thisMonth,
      upcoming,
      recentPast,
      all: allSorted,
      totalCelebrants: allEvents.length,
    };

    // Save to client persistence cache
    cacheService.set(cacheKey, result, 1000 * 60 * 15);

    return result;
  } catch (err) {
    console.error("Error generating celebrations timeline:", err);
    // Return cached records on network failure if available
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    return {
      today: [],
      tomorrow: [],
      thisWeek: [],
      thisMonth: [],
      upcoming: [],
      recentPast: [],
      all: [],
      totalCelebrants: 0,
    };
  }
}

/**
 * Club Founder Biography & Book Data Provider
 */
export function getClubFounderInfo(clubSlug = "lions") {
  const slug = (clubSlug || "lions").toLowerCase();

  if (slug === "vasavi") {
    return {
      clubSlug: "vasavi",
      clubName: "Vasavi Clubs International",
      founderName: "VASAVI CLUBS INTERNATIONAL",
      shortSummary:
        "Vasavi Clubs International is a global service organization promoting friendship, fellowship, social welfare, education, healthcare, community development and humanitarian service, empowering members to serve society and improve lives through collective action.",
      secondpara:
        "Download to find - VCI History,  KCGF. Donors,  Vasavi Matha Prayer & Pledge , International Presidents Team,  Intl Office Bearers, Vasavi clubs in India and around the World, Vision and Mission for the year",
      coverImage:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      portraitImage:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
      pdfDownloadUrl: "/docs/vasavi_club_book.pdf",
 
      pages: [
        {
          pageNumber: 1,
          chapter: "1. VCI History & Genesis",
          title: "Origins of Vasavi Clubs International",
          content: [
            "Vasavi Clubs International took its origin to unite Arya Vysya and like-minded individuals worldwide, dedicated to societal welfare, mutual support, education, and cultural heritage.",
            "The foundational vision emphasizes ethical leadership, empowering underprivileged communities through healthcare camps, scholarship endowments, marriage assistance, and business networking among members.",
            "From humble beginnings, the organization has blossomed into a magnificent international movement with hundreds of clubs and thousands of dedicated members serving unconditionally.",
          ],
        },
        {
          pageNumber: 2,
          chapter: "2. Vasavi Matha Prayer & Pledge",
          title: "Divine Prayer & Code of Fellowship",
          content: [
            "Vasavi Matha Prayer: 'O Divine Mother Sri Kanyaka Parameswari, bless us with wisdom, peace, prosperity, and the spirit of selflessness to serve our fellow beings with unconditional love and devotion.'",
            "VCI Member Pledge: 'We, the members of Vasavi Clubs International, pledge ourselves to uphold truth, non-violence, service, and universal brotherhood. We resolve to assist the poor, educate the needy, respect elders, and foster unity across all sections of society.'",
          ],
        },
        {
          pageNumber: 3,
          chapter: "3. KCGF Donors & Charitable Funds",
          title: "Kalpatharuvu Club Growth Fund & Philanthropy",
          content: [
            "The Kalpatharuvu Club Growth Fund (KCGF) represents the lifeblood of humanitarian funding in Vasavi Clubs International. Donors contribute generously to permanent trust funds for healthcare, education, and disaster management.",
            "KCGF Diamond, Platinum, and Gold fellowship titles are conferred on benefactors whose philanthropic support powers state-of-the-art dialysis centers, diagnostic labs, artificial limb centers, and student scholarship foundations.",
          ],
        },
        {
          pageNumber: 4,
          chapter: "4. International President's Team",
          title: "Leadership, Vision & Strategic Goals",
          content: [
            "The International President leads with an inspiring annual theme focusing on 'Service with Compassion and Sustainable Growth'.",
            "Supported by the First Vice International President, Second Vice International President, and the Cabinet Secretariat, the leadership drives innovative welfare programs across all administrative districts.",
          ],
        },
        {
          pageNumber: 5,
          chapter: "5. International Office Bearers",
          title: "Organizational Hierarchy & Administration",
          content: [
            "Vasavi Clubs International operates through a structured democratic administration spanning the International Board, Multiple Council Chairpersons, District Governors (DGs), Region Chairpersons (RCs), Zone Chairpersons (ZCs), and Club Presidents.",
            "Dedicated wings including Vasavi Vanitha Clubs (women empowerment) and Vasavi Junior Clubs (VJC youth leadership) ensure vibrant multi-generational participation.",
          ],
        },
        {
          pageNumber: 6,
          chapter: "6. Vasavi Clubs in India & Around the World",
          title: "Global Footprint of Fellowship & Service",
          content: [
            "Vasavi Clubs have established vibrant chapters across Andhra Pradesh, Telangana, Tamil Nadu, Karnataka, Maharashtra, and North India, alongside international chapters in the USA, UK, UAE, Singapore, Malaysia, and Australia.",
            "Cross-border business networking, youth cultural exchanges, and global disaster relief efforts exemplify the borderless brotherhood of Vasavians worldwide.",
          ],
        },
        {
          pageNumber: 7,
          chapter: "7. Vision & Mission for the Year",
          title: "Empowering Lives Through Sustainable Action",
          content: [
            "Vision: To be the most trusted and impactful community service organization fostering moral values, economic empowerment, and societal welfare.",
            "Mission: To establish healthcare facilities in rural belts, support 10,000+ underprivileged students annually, nurture young entrepreneurs, and expand digital directory connectivity through platforms like Celfonbook 2026.",
          ],
        },
      ],
    };
  }

  // Default: Lions Club
  return {
    clubSlug: "lions",
    clubName: "Lions Clubs International",
    founderName: "LIONS CLUBS INTERNATIONAL",
    shortSummary:
      "Lions Clubs International is a global service organization of volunteers dedicated to improving communities, supporting people in need, promoting health and education, and creating positive change through humanitarian service.",
    secondpara:
      "Download to find - LCI History,  LCIF,  Lions Pledge, International President Team,  Intl Office Bearers, Lionism around the World and India.",
    coverImage:
      "https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?w=600&auto=format&fit=crop&q=80",
    portraitImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    pdfDownloadUrl: "/docs/lions_club_book.pdf",
 
    pages: [
      {
        pageNumber: 1,
        chapter: "1. Melvin Jones & LCI History",
        title: "The Genesis of the World's Greatest Service Movement",
        content: [
          "Melvin Jones was born on January 13, 1879, in Fort Thomas, Arizona, the son of a United States Army captain. As a young man in Chicago, he established a thriving insurance agency in 1913.",
          "He joined the Business Circle luncheon group and promptly asked: 'What if these men, who are successful because of their drive and intelligence, were to put their talents to work improving their communities?'",
          "On June 7, 1917, delegates from men's clubs met in Chicago to establish Lions Clubs International. In October 1917, the historic first national convention convened in Dallas, Texas.",
          "In 1925, at the Cedar Point convention, Helen Keller challenged Lions to become 'Knights of the Blind in the crusade against darkness,' establishing vision care as Lionism's signature cause.",
        ],
      },
      {
        pageNumber: 2,
        chapter: "2. LCIF (Lions Clubs Int. Foundation)",
        title: "Empowering Humanitarian Service Worldwide",
        content: [
          "Lions Clubs International Foundation (LCIF) is the charitable arm of Lions Clubs International, providing millions of dollars in grants for major humanitarian projects.",
          "LCIF champions global causes including: Vision Care (SightFirst), Disaster Relief, Childhood Cancer, Diabetes Awareness, Hunger Relief, Environment Protection, and Youth Empowerment (Lions Quest).",
          "The Melvin Jones Fellowship (MJF) award and Progressive MJF (PMJF) recognize individuals who donate generously to LCIF's world-changing humanitarian mission.",
        ],
      },
      {
        pageNumber: 3,
        chapter: "3. Lions Pledge, Ethics & Purposes",
        title: "Guiding Principles of Lionism",
        content: [
          "Lions Club Motto: 'WE SERVE'",
          "Lions Pledge: 'I pledge allegiance to my country and to the cause of peace throughout the world. I believe in the principles of Lionism: to create and foster a spirit of understanding among the peoples of the world; to promote good citizenship; and to take an active interest in the civic, commercial, social, and moral welfare of the community.'",
          "Lions Code of Ethics emphasizes honesty in business, friendship as an end and not a means, civic responsibility, and loyalty to community and country above personal gain.",
        ],
      },
      {
        pageNumber: 4,
        chapter: "4. International President's Team",
        title: "Global Leadership & Presidential Theme",
        content: [
          "The International President leads the global association under a visionary theme, motivating 1.4 million members across 200+ countries to set new benchmarks in service impact and membership growth.",
          "The executive leadership team comprises the Immediate Past International President, First, Second, and Third Vice Presidents, and the International Board of Directors representing every constitutional area.",
        ],
      },
      {
        pageNumber: 5,
        chapter: "5. International Office Bearers",
        title: "Constitutional Areas & District Administration",
        content: [
          "Lions Clubs International is organized across 8 Constitutional Areas globally, spanning Multiple Districts (e.g., MD 324 in India), Sub-Districts (e.g., District 3242C, 3241D), Regions, and Zones.",
          "District Governors (DG), First Vice District Governors (1st VDG), Second Vice District Governors (2nd VDG), Region Chairpersons (RC), Zone Chairpersons (ZC), and Cabinet Secretary/Treasurer guide local clubs in executing grassroots community welfare projects.",
        ],
      },
      {
        pageNumber: 6,
        chapter: "6. Lionism in India & Around the World",
        title: "A Glorious History of Service in India",
        content: [
          "Lionism in India began on February 3, 1956, when the first Lions Club was chartered in Bombay (Mumbai), sponsored by Lions Clubs of Akron, Ohio.",
          "Today, India is one of the largest and most vibrant Lions constitutional areas globally (ISAME - India, South Asia, Middle East), operating world-class eye hospitals, blood banks, dialysis centers, skill development academies, and disaster relief task forces.",
          "Through digital initiatives like Celfonbook 2026, Lions across District 3242C and beyond remain closely connected in fellowship and service.",
        ],
      },
    ],
  };
}

/**
 * Global search strictly isolated to a specific club
 */
export async function searchClubMembers(clubSlug = "lions", nameQuery = "", keyQuery = "") {
  try {
    const cleanName = (nameQuery || "").trim();
    const cleanKey = (keyQuery || "").trim();

    if (!cleanName && !cleanKey) return [];

    let query = supabase.from("profiles").select("*");

    if (cleanName && cleanKey) {
      query = query.or(
        `person_name.ilike.%${cleanName}%,business_name.ilike.%${cleanName}%,keywords.ilike.%${cleanKey}%,activity.ilike.%${cleanKey}%,member_num.ilike.%${cleanKey}%,mobile_number.ilike.%${cleanKey}%`
      );
    } else if (cleanName) {
      query = query.or(
        `person_name.ilike.%${cleanName}%,business_name.ilike.%${cleanName}%`
      );
    } else if (cleanKey) {
      query = query.or(
        `keywords.ilike.%${cleanKey}%,activity.ilike.%${cleanKey}%,member_num.ilike.%${cleanKey}%,mobile_number.ilike.%${cleanKey}%,post_of_member.ilike.%${cleanKey}%,club.ilike.%${cleanKey}%`
      );
    }

    const { data: resData, error } = await query.limit(200);
    let data = resData || [];

    if (error || data.length === 0) {
      let fbQuery = supabase.from("profiles").select("*");
      if (cleanName) {
        fbQuery = fbQuery.or(`person_name.ilike.%${cleanName}%,business_name.ilike.%${cleanName}%`);
      } else if (cleanKey) {
        fbQuery = fbQuery.or(`keywords.ilike.%${cleanKey}%,activity.ilike.%${cleanKey}%,mobile_number.ilike.%${cleanKey}%`);
      }
      const { data: fbData } = await fbQuery.limit(200);
      if (fbData && fbData.length > 0) {
        data = fbData;
      }
    }

    // Filter out rows from other clubs in case of loose query and verify full match
    const filtered = data.filter((row) => {
      const assn = (row.assn || "").toLowerCase();
      const dist = (row.district || "").toUpperCase();

      if (clubSlug === "vasavi") {
        if (!assn.includes("vasavi") && dist !== "V501A") return false;
      } else if (clubSlug === "lions") {
        if (assn.includes("vasavi")) return false;
      }

      if (cleanName) {
        const nLow = cleanName.toLowerCase();
        const matchName =
          (row.person_name && row.person_name.toLowerCase().includes(nLow)) ||
          (row.business_name && row.business_name.toLowerCase().includes(nLow));
        if (!matchName) return false;
      }

      if (cleanKey) {
        const kLow = cleanKey.toLowerCase();
        const matchKey =
          (row.keywords && row.keywords.toLowerCase().includes(kLow)) ||
          (row.activity && row.activity.toLowerCase().includes(kLow)) ||
          (row.description && row.description.toLowerCase().includes(kLow)) ||
          (row.post_of_member && row.post_of_member.toLowerCase().includes(kLow)) ||
          (row.role && row.role.toLowerCase().includes(kLow)) ||
          (row.member_num && String(row.member_num).toLowerCase().includes(kLow)) ||
          (row.mobile_number && row.mobile_number.includes(cleanKey)) ||
          (row.club && row.club.toLowerCase().includes(kLow)) ||
          (row.city && row.city.toLowerCase().includes(kLow));
        if (!matchKey) return false;
      }

      return true;
    });

    return filtered.map((row) => normalizeMember(row, row.district || "3242C", clubSlug));
  } catch (err) {
    console.error("Error searching club members in Supabase:", err);
    return [];
  }
}

