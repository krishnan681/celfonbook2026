import { supabase } from "../../../../core/config/supabaseClient";

export const categorywiseService = {
  async getSuggestions(column, query) {
    const { data, error } = await supabase
      .from("profiles")
      .select(column)
      .ilike(column, `%${query}%`);

    if (error) return [];

    const keywords = new Set();

    data.forEach((row) => {
      const raw = row[column] || "";

      raw.split(",").forEach((k) => {
        const keyword = k.trim();
        if (keyword.toLowerCase().includes(query.toLowerCase())) {
          keywords.add(keyword);
        }
      });
    });

    return Array.from(keywords).sort();
  },

  async searchBusinesses(category, city) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, business_name, keywords, mobile_number, city")
      .ilike("keywords", `%${category}%`)
      .ilike("city", `%${city}%`);

    if (error) return [];

    return data;
  },

  sendSMS(numbers, message) {
    if (!numbers.length) return false;

    const link = `sms:${numbers.join(",")}?body=${encodeURIComponent(message)}`;
    window.location.href = link;

    return true;
  },
};