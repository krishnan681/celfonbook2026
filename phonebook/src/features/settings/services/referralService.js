// src/features/settings/services/referralService.js

// import { supabase } from "../../../core/config/supabaseClient";

// export const getReferralData = async () => {
//   const { data, error } = await supabase
//     .from("s_profiles")
//     .select("promo_code, full_name, phone, city, created_at")
//     .not("promo_code", "is", null)
//     .order("created_at", { ascending: false });

//   if (error) throw error;

//   const grouped = {};

//   data.forEach((row) => {
//     const code = row.promo_code?.trim().toUpperCase();

//     if (!code) return;

//     if (!grouped[code]) {
//       grouped[code] = [];
//     }

//     grouped[code].push(row);
//   });

//   return grouped;
// };






// src/features/settings/services/referralService.js

import { supabase } from "../../../core/config/supabaseClient";
import { ReferralModel } from "../models/referralModel";

/* ===========================================================
   Existing Function (Keep as-is)
=========================================================== */

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

/* ===========================================================
   Referral Dashboard Functions
=========================================================== */

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
};

export const addReferral = async ({
  name,
  phone,
  referralCode,
}) => {
  const user = await getCurrentUser();

  const { error } = await supabase.from("referrals").insert({
    referrer_id: user.id,
    referred_name: name,
    referred_phone: phone,
    referral_code: referralCode,
  });

  if (error) throw error;
};

export const getMyReferrals = async () => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((item) => ReferralModel.fromJson(item));
};

export const getCampaign = async () => {
  const { data, error } = await supabase
    .from("winner_campaign")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const getCouponInfo = async () => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("referral_coupons")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const getCouponCount = async () => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("referral_coupons")
    .select("coupons")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data?.coupons ?? 0;
};

export const getSuccessfulReferrals = async () => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("referrals")
    .select("id")
    .eq("referrer_id", user.id)
    .eq("joined", true);

  if (error) throw error;

  return data.length;
};

export const getPendingReferrals = async () => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("referrals")
    .select("id")
    .eq("referrer_id", user.id)
    .eq("joined", false);

  if (error) throw error;

  return data.length;
};

export const alreadyReferred = async (phone) => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("referrals")
    .select("id")
    .eq("referrer_id", user.id)
    .eq("referred_phone", phone);

  if (error) throw error;

  return data.length > 0;
};