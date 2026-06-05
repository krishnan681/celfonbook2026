// src/features/settings/services/referralService.js

import { supabase } from "../../../core/config/supabaseClient";

export const getReferralData = async () => {
  const { data, error } = await supabase
    .from("s_profiles")
    .select("promo_code, full_name, phone, city, created_at")
    .not("promo_code", "is", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const grouped = {};

  data.forEach((row) => {
    const code = row.promo_code?.trim().toUpperCase();

    if (!code) return;

    if (!grouped[code]) {
      grouped[code] = [];
    }

    grouped[code].push(row);
  });

  return grouped;
};