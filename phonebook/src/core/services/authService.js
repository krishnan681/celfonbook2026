import { supabase } from "../config/supabaseClient";

export const AuthService = {

  getCurrentSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  isLoggedIn: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session !== null;
  },

  onAuthChange: (callback) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  },

  loginWithPassword: async (identifier, password) => {

    if (identifier.includes("@")) {
      return await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });
    }

    const phone = identifier.startsWith("+") ? identifier : `+${identifier}`;

    return await supabase.auth.signInWithPassword({
      phone,
      password,
    });
  },

  signupWithPhone: async (phone, password) => {
    if (!phone.startsWith("+")) phone = `+${phone}`;

    return await supabase.auth.signUp({
      phone,
      password,
    });
  },

  resetPassword: async (email) => {
    return await supabase.auth.resetPasswordForEmail(email);
  },

  verifyOtp: async (email, token) => {
    return await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });
  },

  updatePassword: async (password) => {
    return await supabase.auth.updateUser({ password });
  },
};