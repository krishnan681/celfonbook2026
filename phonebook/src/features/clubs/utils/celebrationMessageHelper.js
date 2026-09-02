// src/features/clubs/utils/celebrationMessageHelper.js

/**
 * Clean redundant prefixes from member names so we don't end up with "Dear Lion Ln. Rajesh"
 */
export function cleanMemberNameForSalutation(name = "") {
  if (!name) return "";
  return (
    name
      .replace(
        /^(Ln\.?|Lion|Vn\.?|Vasavi|Vasavian|Rtn\.?|Rotarian|Dr\.?|Er\.?|Adv\.?|Mr\.?|Mrs\.?|Ms\.?|Shri\.?|Smt\.?)\s+/i,
        "",
      )
      .trim() ||
    name.trim() ||
    ""
  );
}

/**
 * Determine club salutation:
 * - Lions: "Dear Lion [Name]"
 * - Vasavi: "Dear Vn [Name]"
 * - Rotary: "Dear Rotarian [Name]"
 * - Default: "Dear [Name]"
 */
export function getClubSalutation(clubSlug = "lions", personName = "") {
  const cleanName = cleanMemberNameForSalutation(personName) || "Member";
  const slug = (clubSlug || "").toLowerCase();

  if (slug.includes("lion")) {
    return `Dear Lion ${cleanName}`;
  } else if (slug.includes("vasavi")) {
    return `Dear Vn ${cleanName}`;
  } else if (slug.includes("rotary")) {
    return `Dear Rotarian ${cleanName}`;
  }
  return `Dear ${cleanName}`;
}

/**
 * Get club prefix for sender:
 * - Lions: "Lion "
 * - Vasavi: "Vn "
 * - Rotary: "Rotarian "
 * - Default: ""
 */
export function getSenderClubPrefix(clubSlug = "lions") {
  const slug = (clubSlug || "").toLowerCase();
  if (slug.includes("lion")) {
    return "Lion ";
  } else if (slug.includes("vasavi")) {
    return "Vn ";
  } else if (slug.includes("rotary")) {
    return "Rotarian ";
  }
  return "";
}

/**
 * Format sender name with appropriate club prefix
 */
export function formatSenderName(
  clubSlug = "lions",
  senderName = "",
  fallbackTitle = "Club",
) {
  const clean = cleanMemberNameForSalutation(senderName);
  if (!clean) return fallbackTitle;
  const prefix = getSenderClubPrefix(clubSlug);
  return `${prefix}${clean}`.trim();
}

/**
 * Generate standardized personalized celebration wish message:
 * Format:
 * "Dear Lion [Name], wishing you a very Happy Birthday in advance (27 Oct)! 🎂🎉 Wishing you fantastic celebrations and prosperity ahead. - Warm wishes from Lion [Sender]
 * (Msg thro CELFON BOOK)"
 */
export function formatCelebrationWishMessage({
  member,
  type = "BIRTHDAY",
  diffDays = 0,
  dateFormatted = "",
  spouse = "",
  clubSlug = "lions",
  clubTitle = "Club",
  senderName = "",
}) {
  const m = member || {};
  const rawName = m.person_name || m.fullName || m.business_name || "Member";
  const salutation = getClubSalutation(clubSlug, rawName);
  const formattedSender = formatSenderName(clubSlug, senderName, clubTitle);
  const isBday = type === "BIRTHDAY";

  let body = "";

  if (diffDays === 0) {
    // Today
    if (isBday) {
      body = `${salutation}, wishing you a very Happy Birthday! 🎂🎉 May your day be filled with happiness, health, and great success. - Best wishes from ${formattedSender}`;
    } else {
      const spouseText = spouse ? ` & ${spouse}` : "";
      body = `${salutation}${spouseText}, wishing you both a very Happy Wedding Anniversary! 💍✨ May your bond grow stronger with each passing year. - Best wishes from ${formattedSender}`;
    }
  } else if (diffDays > 0) {
    // Upcoming / In advance
    const dateText = dateFormatted ? ` (${dateFormatted})` : "";
    if (isBday) {
      body = `${salutation}, wishing you a very Happy Birthday in advance${dateText}! 🎂🎉 Wishing you fantastic celebrations and prosperity ahead. - Warm wishes from ${formattedSender}`;
    } else {
      const spouseText = spouse ? ` & ${spouse}` : "";
      body = `${salutation}${spouseText}, wishing you both a very Happy Wedding Anniversary in advance${dateText}! 💍✨ Wishing you endless togetherness. - Warm wishes from ${formattedSender}`;
    }
  } else {
    // Belated
    if (isBday) {
      body = `${salutation}, wishing you a very Happy Belated Birthday! 🎂 Hope you had a wonderful celebration. Wishing you health and prosperity! - Best wishes from ${formattedSender}`;
    } else {
      const spouseText = spouse ? ` & ${spouse}` : "";
      body = `${salutation}${spouseText}, wishing you both a Happy Belated Wedding Anniversary! 💍✨ Wishing you endless togetherness. - Best wishes from ${formattedSender}`;
    }
  }

  const senderSuffix = `(Msg thro CELFON BOOK)`;

  return `${body}\n${senderSuffix}`;
}
