// src/core/utils/maskHelper.js

/**
 * Mask mobile / phone numbers with 'xxxxx' at the end.
 * Examples:
 *   "9842145678" -> "98421xxxxx"
 *   "+91 9842145678" -> "+91 98421xxxxx"
 *   "0422 234567" -> "0422 2xxxxx"
 */
export function maskPhoneNumber(num) {
  if (!num) return "";
  const str = String(num).trim();

  // If already masked
  if (str.includes("x") || str.includes("X") || str.includes("*")) {
    return str;
  }

  // Handle +91 prefix
  if (str.startsWith("+91")) {
    const raw = str.replace(/^\+91[\s-]*/, "");
    if (raw.length >= 5) {
      return `+91 ${raw.slice(0, 5)}xxxxx`;
    }
    return `+91 ${raw.slice(0, 2)}xxxx`;
  }

  // Standard 10-digit or variable length numbers
  if (str.length >= 5) {
    return `${str.slice(0, 5)}xxxxx`;
  }

  return `${str}xxxx`;
}

/**
 * Mask email addresses with 'xxxx' before domain.
 * Examples:
 *   "johndoe@gmail.com" -> "johnxxxx@gmail.com"
 *   "info@company.co.in" -> "infoxxxx@company.co.in"
 *   "ab@xyz.com" -> "abxxxx@xyz.com"
 */
export function maskEmail(email) {
  if (!email) return "";
  const str = String(email).trim();

  if (!str.includes("@")) {
    return str.length > 3 ? `${str.slice(0, 3)}xxxx` : `${str}xxxx`;
  }

  const [username, domain] = str.split("@");
  if (!username) return `xxxx@${domain}`;

  // Keep first 3 to 4 characters of username then add xxxx
  const keepLength = username.length <= 3 ? username.length : Math.min(4, Math.ceil(username.length / 2));
  const visible = username.slice(0, keepLength);

  return `${visible}xxxx@${domain}`;
}
