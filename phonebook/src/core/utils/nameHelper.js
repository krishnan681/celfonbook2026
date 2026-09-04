// src/core/utils/nameHelper.js

/**
 * Strips generic salutations / titles like Mr., Mrs., Ms., Dr., Shri., etc.
 * Also cleans existing Ln/Lion/Vn prefixes so they can be standardized cleanly.
 */
export function cleanRawPersonName(name = "") {
  if (!name || typeof name !== "string") return "";
  return name
    .replace(
      /^(Mr\.?|Mrs\.?|Ms\.?|Miss\.?|Dr\.?|Er\.?|Adv\.?|Prof\.?|Shri\.?|Smt\.?|Thiru\.?|Lion\.?|Ln\.?|Vn\.?|Vasavi|Vasavian|Rtn\.?|Rotarian)\s+/i,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Determine the appropriate club prefix ("Lion", "Vn", "Rtn", etc.)
 * based on profile association, club name, district, or existing prefix.
 */
export function getClubPrefixForProfile(profile = {}, fallbackPrefix = "") {
  if (!profile) return fallbackPrefix || "Lion";

  const assn = (profile.assn || "").toLowerCase();
  const club = (profile.club || profile.clubName || "").toLowerCase();
  const district = String(profile.district || profile.districtId || "").toUpperCase();
  const rawPrefix = (profile.person_prefix || profile.prefix || "").toLowerCase();
  const slug = (profile.clubSlug || "").toLowerCase();

  // 1. Vasavi Club Detection
  if (
    slug === "vasavi" ||
    assn.includes("vasavi") ||
    club.includes("vasavi") ||
    district.startsWith("V") ||
    rawPrefix.includes("vn") ||
    rawPrefix.includes("vasavi")
  ) {
    return "Vn";
  }

  // 2. Rotary Club Detection
  if (
    slug === "rotary" ||
    assn.includes("rotary") ||
    club.includes("rotary") ||
    rawPrefix.includes("rtn") ||
    rawPrefix.includes("rotarian")
  ) {
    return "Rtn";
  }

  // 3. Lions Club Detection (Default for Lions districts & general directory)
  if (
    slug === "lions" ||
    assn.includes("lion") ||
    club.includes("lion") ||
    district.startsWith("324") ||
    rawPrefix.includes("lion") ||
    rawPrefix.includes("ln") ||
    profile.post_of_member
  ) {
    return "Lion";
  }

  // If prefix was explicitly provided as Lion / Vn / Rtn
  if (rawPrefix.includes("vn")) return "Vn";
  if (rawPrefix.includes("rtn")) return "Rtn";
  if (rawPrefix.includes("lion") || rawPrefix.includes("ln")) return "Lion";

  // If fallback specified or default to Lion for club directory context
  return fallbackPrefix || "Lion";
}

/**
 * Formats a person's full display name with the appropriate club prefix (Lion / Vn)
 * instead of Mr., Mrs., etc.
 * Example:
 * - "Mr. Ramesh Kumar" -> "Lion Ramesh Kumar"
 * - "Mrs. Geetha" (Vasavi) -> "Vn Geetha"
 * - "Ln. K. Balan" -> "Lion K. Balan"
 */
export function formatPersonNameWithPrefix(profile = {}, fallbackPrefix = "") {
  if (!profile) return "";

  const rawName =
    typeof profile === "string"
      ? profile
      : profile.person_name ||
        profile.name ||
        profile.fullName ||
        (!profile.is_business && profile.business_name ? profile.business_name : "");

  const cleaned = cleanRawPersonName(rawName);
  if (!cleaned) return "";

  const prefix = getClubPrefixForProfile(
    typeof profile === "object" ? profile : {},
    fallbackPrefix
  );

  return prefix ? `${prefix} ${cleaned}` : cleaned;
}

/**
 * Returns formatted person name if available, otherwise formatted business name.
 */
export function getDisplayProfileName(profile = {}) {
  if (!profile) return "Unnamed";

  if (profile.business_name && profile.business_name.trim()) {
    return profile.business_name.trim();
  }

  return formatPersonNameWithPrefix(profile) || "Unnamed Member";
}
