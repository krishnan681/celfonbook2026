// src/core/seo/seoConfig.js

const BASE_URL = "https://celfonbook.directory";

export const seoConfig = {
  home: {
    title: "Tamil Nadu Business Directory | CelfonBook",
    description:
      "Find verified businesses, government offices, manufacturers, suppliers and services across Tamil Nadu.",
    canonical: `${BASE_URL}/`,
  },

  search: {
    title: "Search Businesses | CelfonBook",
    description:
      "Search verified businesses, phone numbers, industries and government offices across Tamil Nadu.",
    canonical: `${BASE_URL}/search`,
  },

  partner: {
    title: "List Your Business | CelfonBook",
    description:
      "Register your business and get discovered by thousands of customers across Tamil Nadu.",
    canonical: `${BASE_URL}/partner`,
  },

  favorites: {
    title: "Favorite Businesses | CelfonBook",
    description:
      "View and manage your saved businesses on CelfonBook.",
    canonical: `${BASE_URL}/favorites`,
  },

  settings: {
    title: "Settings | CelfonBook",
    description:
      "Manage your account settings and preferences.",
    canonical: `${BASE_URL}/settings`,
  },

  privacy: {
    title: "Privacy Policy | CelfonBook",
    description:
      "Read CelfonBook's privacy policy.",
    canonical: `${BASE_URL}/privacy-policy`,
  },

  terms: {
    title: "Terms & Conditions | CelfonBook",
    description:
      "Read the terms and conditions of CelfonBook.",
    canonical: `${BASE_URL}/terms`,
  },
};

export default seoConfig;