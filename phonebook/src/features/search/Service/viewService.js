import { supabase } from "../../../core/config/supabaseClient";

export const ViewService = {
  async saveView(item) {
    console.log("SAVE VIEW START");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("USER:", user?.id);

      if (!user) return;

      // Get viewer profile
      const { data: profile } = await supabase
        .from("s_profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      const viewerName = profile?.full_name || "";

      const viewerId = user.id;

      const shopName = item?.business_name?.trim()
        ? item.business_name
        : item.person_name;

      const shopId = item.id;

      // Check existing row
      const { data: existing } = await supabase
        .from("views")
        .select("id, views")
        .eq("viewer_id", viewerId)
        .eq("shop_id", shopId)
        .maybeSingle();

      if (existing) {
        const currentViews = existing.views || 0;

        await supabase
          .from("views")
          .update({
            views: currentViews + 1,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("views").insert({
          viewer_name: viewerName,
          viewer_id: viewerId,
          shop_name: shopName,
          shop_id: shopId,
          views: 1,
        });
      }
    } catch (error) {
      console.error("Save View Error:", error);
    }
  },
};
