import { supabase } from "../../../core/config/supabaseClient";

export const checkMobileExists = async (mobile) => {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("mobile_number", mobile)
    .single();

  return !!data;
};

export const insertPartnerProfile = async (payload) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert([payload]);

  if (error) throw error;

  return data;
};