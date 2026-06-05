// src/features/settings/controller/useReferralController.js

import { useEffect, useState } from "react";
import { getReferralData } from "../services/referralService";

export const useReferralController = () => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReferralData();

      setGroupedData(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalMembers = Object.values(groupedData).reduce(
    (sum, users) => sum + users.length,
    0
  );

  return {
    groupedData,
    loading,
    error,
    loadData,
    totalMembers,
  };
};