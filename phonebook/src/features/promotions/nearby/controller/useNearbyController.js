import { nearbyService } from "../services/nearbyService";
import { NearbyModel } from "../models/nearbyModel";

export const useNearbyController = () => {
  let profiles = [];

  const search = async (pincode, category) => {
    const raw = await nearbyService.searchProfiles({ pincode, category });
    const sentNumbers = nearbyService.getSentNumbers();

    profiles = raw
      .filter((e) => {
        if (e.pincode !== pincode) return false;

        if (category === "Gents") {
          return e.person_prefix === "Mr." && e.person_name;
        }

        if (category === "Ladies") {
          return e.person_prefix === "Ms." && e.person_name;
        }

        if (category === "Firms") {
          return e.business_prefix === "M/s." && e.business_name;
        }

        return false;
      })
      .map((e) => {
        const mobile = e.mobile_number?.toString() || "";

        return new NearbyModel({
          personName: category === "Firms" ? null : e.person_name,
          businessName: category === "Firms" ? e.business_name : null,
          mobileNumber: mobile,
          pincode: e.pincode,
          isSent: sentNumbers.includes(mobile),
        });
      });

    sortProfiles();

    return profiles;
  };

  const sortProfiles = () => {
    profiles.sort((a, b) => {
      if (a.isSent && !b.isSent) return 1;
      if (!a.isSent && b.isSent) return -1;
      return 0;
    });
  };

  const markAsSent = (selected) => {
    const sentNumbers = nearbyService.getSentNumbers();

    selected.forEach((p) => {
      p.isSent = true;
      if (!sentNumbers.includes(p.mobileNumber)) {
        sentNumbers.push(p.mobileNumber);
      }
    });

    nearbyService.saveSentNumbers(sentNumbers);
    sortProfiles();
  };

  const maskMobile = (num) => {
    if (num.length <= 5) return num;
    return num.substring(0, 5) + "XXXXX";
  };

  return { search, markAsSent, maskMobile };
};