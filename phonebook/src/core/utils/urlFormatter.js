export const formatWebsiteUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};