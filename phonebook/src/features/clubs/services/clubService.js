// src/features/clubs/services/clubService.js
import { supabase } from "../../../core/config/supabaseClient";
import { cacheService } from "../../../core/services/cacheService";
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
  clubName = null
) {
  const cacheKey = `celebrations_${clubSlug}_${districtId || "all"}_${clubName || "all"}`;
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

    if (clubName) {
      query = query.ilike("club", `%${clubName}%`);
    }

    let { data, error } = await query;
    if (error) throw error;

    // Fallback to district if club-specific has no records
    if ((!data || data.length === 0) && clubName) {
      const fallbackQuery = supabase
        .from("profiles")
        .select("*")
        .eq("district", districtId || "3242C");
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
      coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      portraitImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
      pdfDownloadUrl: "/docs/vasavi_club_book.pdf",
      pages: [
        {
          pageNumber: 1,
          chapter: "1. The Genesis",
          title: "Origins of Vasavi Clubs International",
          content: [
            "Vasavi Clubs International took its origin to unite like-minded individuals dedicated to societal welfare, mutual support, education, and cultural preservation.",
            "The foundational vision emphasizes ethical leadership, empowering underprivileged communities through healthcare camps, scholarship initiatives, and business networking among members.",
          ],
        },
        {
          pageNumber: 2,
          chapter: "2. Core Principles",
          title: "Service, Fellowship & Empowerment",
          content: [
            "With chapters across the globe, Vasavi Clubs actively coordinate humanitarian activities such as blood donation drives, artificial limb distribution, and women entrepreneurship workshops.",
            "Fellowship meetings strengthen social bonding among families while fostering collaborative opportunities in trade and commerce.",
          ],
        },
        {
          pageNumber: 3,
          chapter: "3. Global Impact",
          title: "A Worldwide Network of Goodness",
          content: [
            "Today, thousands of dedicated club members participate across hundreds of districts and zones.",
            "Each district champions community development, disaster relief, and youth leadership wings (VJC - Vasavi Junior Clubs), creating a lasting generational impact.",
          ],
        },
        {
          pageNumber: 4,
          chapter: "4. The Path Ahead",
          title: "Digital Connectivity & Sustainable Service",
          content: [
            "As we advance into modern times, digital directories like Celfonbook bridge the gap between members, enabling instant contact, celebratory wishes, and cross-border commercial harmony.",
            "May the spirit of service continue to light the lives of countless individuals worldwide.",
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
    coverImage: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?w=600&auto=format&fit=crop&q=80",
    portraitImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    pdfDownloadUrl: "/docs/lions_club_book.pdf",
    pages: [
      {
        pageNumber: 1,
        chapter: "1. Early Life",
        title: "The Birth of an Ideal",
        content: [
          "Melvin Jones was born on January 13, 1879, in Fort Thomas, Arizona, the son of a United States Army captain who commanded a troop of scouts.",
          "As a young man, Melvin Jones made his home in Chicago, Illinois, where he worked with an insurance firm and later founded his own successful agency in 1913.",
        ],
      },
      {
        pageNumber: 2,
        chapter: "2. The Historic 1917 Meeting",
        title: "From Business to Humanitarian Service",
        content: [
          "He joined the Business Circle, a businessmen's luncheon group, and was promptly elected secretary. But Melvin wondered: 'What if these men, who are successful because of their drive and intelligence, were to put their talents to work improving their communities?'",
          "At his invitation, delegates from men's clubs met in Chicago on June 7, 1917, founding Lions Clubs International. In October 1917, the first national convention was held in Dallas, Texas.",
        ],
      },
      {
        pageNumber: 3,
        chapter: "3. 'We Serve' & Global Expansion",
        title: "The World's Largest Service Organization",
        content: [
          "Melvin Jones eventually abandoned his insurance business to devote himself full-time to Lionism at International Headquarters in Chicago.",
          "Under his mentorship, Lions Clubs earned worldwide prestige for civic betterment, blindness prevention (answering Helen Keller's 1925 challenge to become 'Knights of the Blind'), youth programs, and humanitarian relief.",
        ],
      },
      {
        pageNumber: 4,
        chapter: "4. Lasting Legacy",
        title: "A Beacon for Generations",
        content: [
          "Melvin Jones passed away in 1961, leaving behind a movement with over 1.4 million members across 200+ countries.",
          "His philosophy remains the core motto of Lionism: 'We Serve'. The Melvin Jones Fellowship (MJF) award stands today as the highest tribute to humanitarian service.",
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

