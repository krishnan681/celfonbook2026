// import { supabase } from "../config/supabaseClient";
import { supabase } from "../../../core/config/supabaseClient";


export const LeadService = {
  async createLead(item) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("s_profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      const viewerName = profile?.full_name || "";
 

      const shopId = item?.id?.toString();

      if (!shopId) {
        console.error("LEAD ERROR: shop_id missing");
        return;
      }

      const shopName =
        item?.business_name?.trim()
          ? item.business_name
          : item.person_name;

      const { data: shopProfile } = await supabase
        .from("profiles")
        .select("verified")
        .eq("id", shopId)
        .maybeSingle();

      const verified = shopProfile?.verified ?? false;

      let apiTriggered = false;

      // Same as Flutter
  if (verified) {
  try {
    const response = await fetch("https://celfonbook.directory/api/create-lead.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop_id: shopId,
        shop_name: shopName,
        mobile_number: item.mobile_number,
      }),
    });

    apiTriggered = response.ok;
  } catch (err) {
    console.error("Lead API Error:", err);
  }
}

      await supabase
        .from("leads")
        .insert({
          viewer_id: user.id,
          viewer_name: viewerName,
          shop_id: shopId,
          shop_name: shopName,
          is_verified: verified,
          lead_sent: apiTriggered,
        });

      console.log(
        `LEAD SUCCESS: shop=${shopName} id=${shopId}`
      );
    } catch (error) {
      console.error("LEAD ERROR:", error);
    }
  },
};