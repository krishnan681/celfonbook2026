// src/features/clubs/utils/celebrationMessageHelper.js

/**
 * Clean redundant prefixes from member names so we don't end up with "Dear Lion Ln. Rajesh"
 */
export function cleanMemberNameForSalutation(name = "") {
  if (!name) return "Member";
  return name
    .replace(/^(Ln\.?|Lion|Vasavi|Vasavian|Rtn\.?|Rotarian|Dr\.?|Er\.?|Adv\.?)\s+/i, "")
    .trim() || name.trim() || "Member";
}

/**
 * Determine club salutation:
 * - Lions: "Dear Lion [Name]"
 * - Vasavi: "Dear Vasavi [Name]"
 * - Rotary: "Dear Rotarian [Name]"
 * - Default: "Dear [Name]"
 */
export function getClubSalutation(clubSlug = "lions", personName = "") {
  const cleanName = cleanMemberNameForSalutation(personName);
  const slug = (clubSlug || "").toLowerCase();

  if (slug.includes("lion")) {
    return `Dear Lion ${cleanName}`;
  } else if (slug.includes("vasavi")) {
    return `Dear Vasavi ${cleanName}`;
  } else if (slug.includes("rotary")) {
    return `Dear Rotarian ${cleanName}`;
  }
  return `Dear ${cleanName}`;
}

/**
 * Generate standardized personalized celebration wish message:
 * Format:
 * "Dear Lion [Name], wishing you a very Happy Birthday! 🎂🎉 ... - Warm wishes from [Club]
 * (msg thro CELFON BOOK)"
 */
export function formatCelebrationWishMessage({
  member,
  type = "BIRTHDAY",
  diffDays = 0,
  dateFormatted = "",
  spouse = "",
  clubSlug = "lions",
  clubTitle = "Club",
}) {
  const m = member || {};
  const rawName = m.person_name || m.fullName || m.business_name || "Member";
  const salutation = getClubSalutation(clubSlug, rawName);
  const isBday = type === "BIRTHDAY";

  let body = "";

  if (diffDays === 0) {
    // Today
    if (isBday) {
      body = `${salutation}, wishing you a very Happy Birthday! 🎂🎉 May your day be filled with happiness, health, and great success. - Best wishes from ${clubTitle}`;
    } else {
      const spouseText = spouse ? ` & ${spouse}` : "";
      body = `${salutation}${spouseText}, wishing you both a very Happy Wedding Anniversary! 💍✨ May your bond grow stronger with each passing year. - Best wishes from ${clubTitle}`;
    }
  } else if (diffDays > 0) {
    // Upcoming / In advance
    const dateText = dateFormatted ? ` (${dateFormatted})` : "";
    if (isBday) {
      body = `${salutation}, wishing you a very Happy Birthday in advance${dateText}! 🎂🎉 Wishing you fantastic celebrations and prosperity ahead. - Warm wishes from ${clubTitle}`;
    } else {
      const spouseText = spouse ? ` & ${spouse}` : "";
      body = `${salutation}${spouseText}, wishing you both a very Happy Wedding Anniversary in advance${dateText}! 💍✨ - Warm wishes from ${clubTitle}`;
    }
  } else {
    // Belated
    if (isBday) {
      body = `${salutation}, wishing you a very Happy Belated Birthday! 🎂 Hope you had a wonderful celebration. Wishing you health and prosperity! - Best wishes from ${clubTitle}`;
    } else {
      const spouseText = spouse ? ` & ${spouse}` : "";
      body = `${salutation}${spouseText}, wishing you both a Happy Belated Wedding Anniversary! 💍✨ Wishing you endless togetherness. - Best wishes from ${clubTitle}`;
    }
  }

  return `${body}\n(msg thro CELFON BOOK)`;
}
