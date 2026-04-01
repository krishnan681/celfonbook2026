// import { supabase } from "../../../../core/config/supabaseClient";

// export const categorywiseService = {
//   async getSuggestions(column, query) {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select(column)
//       .ilike(column, `%${query}%`);

//     if (error) return [];

//     const keywords = new Set();

//     data.forEach((row) => {
//       const raw = row[column] || "";

//       raw.split(",").forEach((k) => {
//         const keyword = k.trim();
//         if (keyword.toLowerCase().includes(query.toLowerCase())) {
//           keywords.add(keyword);
//         }
//       });
//     });

//     return Array.from(keywords).sort();
//   },

//   async searchBusinesses(category, city) {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("id, business_name, keywords, mobile_number, city")
//       .ilike("keywords", `%${category}%`)
//       .ilike("city", `%${city}%`);

//     if (error) return [];

//     return data;
//   },

//   sendSMS(numbers, message) {
//     if (!numbers.length) return false;

//     const link = `sms:${numbers.join(",")}?body=${encodeURIComponent(message)}`;
//     window.location.href = link;

//     return true;
//   },
// };


// services/categorywiseService.js
import { supabase } from "../../../../core/config/supabaseClient";

export class CategorywiseProServices {
  async getSuggestions(column, query) {
    if (!query) return [];

    const { data, error } = await supabase
      .from('profiles')
      .select(column)
      .ilike(column, `%${query}%`);

    if (error) {
      console.error(error);
      return [];
    }

    const keywords = new Set();

    data.forEach((row) => {
      const raw = row[column]?.toString() || '';
      const split = raw.split(',');
      split.forEach((k) => {
        const keyword = k.trim();
        if (keyword.toLowerCase().includes(query.toLowerCase())) {
          keywords.add(keyword);
        }
      });
    });

    return Array.from(keywords).sort();
  }

  async searchBusinesses(category, city) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, business_name, keywords, mobile_number, city')
      .ilike('keywords', `%${category}%`)
      .ilike('city', `%${city}%`);

    if (error) {
      console.error(error);
      throw error;
    }

    return data || [];
  }

  async sendSMS(numbers, message) {
    if (!numbers || numbers.length === 0) return false;

    const recipients = numbers.join(',');
    const smsBody = encodeURIComponent(message);

    // Modern sms: URI (works on most mobile browsers)
    let smsUri = `sms:${recipients}?body=${smsBody}`;

    try {
      window.location.href = smsUri;
      return true;
    } catch (e) {
      console.warn('SMS launch failed, trying fallback');
      // Fallback
      smsUri = `sms:${recipients};body=${smsBody}`;
      window.location.href = smsUri;
      return true; // Assume success if we navigated
    }
  }
}