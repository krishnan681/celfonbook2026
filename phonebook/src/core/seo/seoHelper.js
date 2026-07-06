// src/core/seo/seoHelper.js

const BASE_URL = "https://celfonbook.directory";

const DEFAULT_IMAGE =
  `${BASE_URL}/web-app-manifest-512x512.png`;

export function getProfileSEO(profile) {
  if (!profile) {
    return {
      title: "Loading Business | CelfonBook",
      description: "Loading business details...",
      canonical: BASE_URL,
      image: DEFAULT_IMAGE,
    };
  }

  return {
    title: `${profile.business_name} | CelfonBook`,

    description:
      profile.description ||
      `Find ${profile.business_name} in ${profile.city}, Tamil Nadu.`,

    canonical: `${BASE_URL}/profile/${profile.id}`,

    image:
      profile.cover_image ||
      profile.profile_image ||
      DEFAULT_IMAGE,

    keywords: [
      profile.business_name,
      profile.city,
      profile.category,
      "Tamil Nadu",
      "Business Directory",
      "CelfonBook",
    ]
      .filter(Boolean)
      .join(", "),
  };
}