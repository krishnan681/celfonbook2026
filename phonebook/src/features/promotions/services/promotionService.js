import { supabase } from "../../../core/config/supabaseClient";

export const PromotionService = {
  getCurrentSession: () => {
    return supabase.auth.getSession();
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  isLoggedIn: async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }
};