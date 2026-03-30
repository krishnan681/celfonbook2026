import { supabase } from "../../../core/config/supabaseClient";
import { DiscountGreetingCard } from "../models/discountModel";

export const DiscountService = {
  async fetchGreetingCard(userId) {
    try {
      const { data, error } = await supabase
        .from("discount_greeting_cards")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;

      return new DiscountGreetingCard(data);
    } catch {
      return null;
    }
  },

  async saveDiscountView(discountId) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("business_name, person_name, mobile_number")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) return;

    await supabase.from("discount_views").insert({
      user_id: user.id,
      listing_id: discountId,
      business_name: profile.business_name,
      person_name: profile.person_name,
      mobile_number: profile.mobile_number,
    });
  },

  async claimDiscount(id) {
    await supabase
      .from("discount_greeting_cards")
      .update({ claimed_at: new Date().toISOString() })
      .eq("id", id);
  }
};