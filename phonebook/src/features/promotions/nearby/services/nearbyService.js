import { supabase } from "../../../../core/config/supabaseClient";

const SENT_KEY = "sent_numbers_list";

export const nearbyService = {
  async searchProfiles({ pincode, category }) {
    let prefix = "";
    let column = "";

    if (category === "Gents") {
      prefix = "Mr.";
      column = "person_prefix";
    } else if (category === "Ladies") {
      prefix = "Ms.";
      column = "person_prefix";
    } else {
      prefix = "M/s.";
      column = "business_prefix";
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("pincode", pincode)
      .ilike(column, `${prefix}%`);

    if (error) throw error;

    return data;
  },

  getSentNumbers() {
    return JSON.parse(localStorage.getItem(SENT_KEY)) || [];
  },

  saveSentNumbers(numbers) {
    localStorage.setItem(SENT_KEY, JSON.stringify(numbers));
  },
};