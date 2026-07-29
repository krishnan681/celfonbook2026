// src/features/settings/controller/useReferralController.js

// import { useEffect, useState } from "react";
// import { getReferralData } from "../services/referralService";

// export const useReferralController = () => {
//   const [groupedData, setGroupedData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const data = await getReferralData();

//       setGroupedData(data);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const totalMembers = Object.values(groupedData).reduce(
//     (sum, users) => sum + users.length,
//     0
//   );

//   return {
//     groupedData,
//     loading,
//     error,
//     loadData,
//     totalMembers,
//   };
// };









import { useEffect, useMemo, useState } from "react";

import {
  addReferral,
  alreadyReferred,
  getCouponCount,
  getCurrentUser,
  getMyReferrals,
  getPendingReferrals,
  getSuccessfulReferrals,
} from "../services/referralService";

import { pickContact } from "../services/contactService";
import { sendInvitation } from "../services/smsService";

export default function useReferralController() {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [referrals, setReferrals] = useState([]);

  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
  const [pendingReferrals, setPendingReferrals] = useState(0);
  const [coupons, setCoupons] = useState(0);

  const [currentUserPhone, setCurrentUserPhone] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const progress = useMemo(() => {
    return (successfulReferrals % 3) / 3;
  }, [successfulReferrals]);

  const remaining = useMemo(() => {
    const value = 3 - (successfulReferrals % 3);
    return value === 3 && successfulReferrals !== 0 ? 0 : value;
  }, [successfulReferrals]);

  const generateReferralCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

    let code = "CEL-";

    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    return code;
  };

  const normalizePhone = (value) => {
    return value.replace(/\D/g, "");
  };

  const validate = () => {
    if (!name.trim()) {
      return false;
    }

    if (normalizePhone(phone).length < 10) {
      return false;
    }

    return true;
  };

  const handlePickContact = async () => {
    try {
      const contact = await pickContact();

      if (!contact) return;

      setName(contact.name);
      setPhone(contact.phone);
    } catch (e) {
      console.error(e);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const user = await getCurrentUser();

      setCurrentUserPhone(user?.phone || "");

      const [
        success,
        pending,
        couponCount,
        history,
      ] = await Promise.all([
        getSuccessfulReferrals(),
        getPendingReferrals(),
        getCouponCount(),
        getMyReferrals(),
      ]);

      setSuccessfulReferrals(success);
      setPendingReferrals(pending);
      setCoupons(couponCount);
      setReferrals(history);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!validate()) {
      return "Please enter valid details.";
    }

    try {
      setLoading(true);

      const exists = await alreadyReferred(normalizePhone(phone));

      if (exists) {
        return "You have already referred this person.";
      }

      const code = generateReferralCode();

      await addReferral({
        name: name.trim(),
        phone: normalizePhone(phone),
        referralCode: code,
      });

      await sendInvitation({
        phone: normalizePhone(phone),
        referrerPhone: currentUserPhone,
        friendName: name.trim(),
      });

      await loadDashboard();

      setName("");
      setPhone("");

      return null;
    } catch (e) {
      return e.message || "Something went wrong.";
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    referrals,

    coupons,

    successfulReferrals,

    pendingReferrals,

    progress,

    remaining,

    name,
    phone,

    setName,
    setPhone,

    submit,

    loadDashboard,

    pickContact: handlePickContact,
  };
}