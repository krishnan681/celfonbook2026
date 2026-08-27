// src/features/clubs/services/lionsClubService.js
// Backward-compatible wrapper delegating to clubService.js

import {
  expandPostTitle,
  checkIsLeadership,
  normalizeMember,
  getClubInfo,
  getDistricts as getDistrictsUniversal,
  getDistrictData as getDistrictDataUniversal,
  getClubsByDistrict as getClubsByDistrictUniversal,
  getClubMembers as getClubMembersUniversal,
  getMemberById as getMemberByIdUniversal,
  searchClubMembers as searchClubMembersUniversal,
} from "./clubService";

export { expandPostTitle, checkIsLeadership };

export const normalizeLionsMember = (profile, defaultDistrict = "3242C") => {
  return normalizeMember(profile, defaultDistrict, "lions");
};

export async function getDistricts(clubSlug = "lions") {
  return getDistrictsUniversal(clubSlug);
}

export async function getDistrictData(districtId, clubSlug = "lions") {
  return getDistrictDataUniversal(districtId, clubSlug);
}

export async function getClubsByDistrict(districtId, clubSlug = "lions") {
  const data = await getDistrictDataUniversal(districtId, clubSlug);
  return data.clubs || [];
}

export async function getClubMembers(districtId, clubIdentifier, clubSlug = "lions") {
  return getClubMembersUniversal(districtId, clubIdentifier, clubSlug);
}

export async function getLionsMemberById(memberId) {
  return getMemberByIdUniversal(memberId);
}

export async function searchLionsMembers(nameQuery = "", keyQuery = "", clubSlug = "lions") {
  return searchClubMembersUniversal(clubSlug, nameQuery, keyQuery);
}
