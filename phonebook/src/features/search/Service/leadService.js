// // import { supabase } from "../config/supabaseClient";
// import { supabase } from "../../../core/config/supabaseClient";

// export const LeadService = {
//   async createLead(item) {
//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return;

//       const { data: profile } = await supabase
//         .from("s_profiles")
//         .select("full_name")
//         .eq("id", user.id)
//         .maybeSingle();

//       const viewerName = profile?.full_name || "";

//       const shopId = item?.id?.toString();

//       if (!shopId) {
//         console.error("LEAD ERROR: shop_id missing");
//         return;
//       }

//       const shopName = item?.business_name?.trim()
//         ? item.business_name
//         : item.person_name;

//       const { data: shopProfile } = await supabase
//         .from("profiles")
//         .select("verified")
//         .eq("id", shopId)
//         .maybeSingle();

//       const verified = shopProfile?.verified ?? false;

//       let apiTriggered = false;

//       // Same as Flutter
//       if (verified) {
//         try {
//           const response = await fetch(
//             "https://celfonbook.directory/api/create-lead.php",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 shop_id: shopId,
//                 shop_name: shopName,
//                 mobile_number: item.mobile_number,
//               }),
//             },
//           );

//           apiTriggered = response.ok;
//         } catch (err) {
//           console.error("Lead API Error:", err);
//         }
//       }

//       await supabase.from("leads").insert({
//         viewer_id: user.id,
//         viewer_name: viewerName,
//         shop_id: shopId,
//         shop_name: shopName,
//         is_verified: verified,
//         lead_sent: apiTriggered,
//       });

//       console.log(`LEAD SUCCESS: shop=${shopName} id=${shopId}`);
//     } catch (error) {
//       console.error("LEAD ERROR:", error);
//     }
//   },
// };



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
        console.error("SHOP ID MISSING");
        return;
      }

      const shopName =
        item?.business_name?.trim()
          ? item.business_name
          : item.person_name;

      const { data: shopProfile, error: shopError } = await supabase
        .from("profiles")
        .select("verified")
        .eq("id", shopId)
        .maybeSingle();

      console.log("SHOP PROFILE:", shopProfile);
      console.log("SHOP ERROR:", shopError);

      const verified = shopProfile?.verified ?? false;

      console.log("VERIFIED:", verified);

      if (!verified) {
        console.log("NOT VERIFIED - LEAD SKIPPED");
        return;
      }

      // prevent duplicate leads

      const { data: existingLead } = await supabase
        .from("leads")
        .select("id")
        .eq("viewer_id", user.id)
        .eq("shop_id", shopId)
        .maybeSingle();

      if (existingLead) {
        console.log("LEAD ALREADY EXISTS");
        return;
      }

      let apiTriggered = false;

      try {
        const response = await fetch(
          "https://celfonbook.directory/api/create-lead.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shop_id: shopId,
              shop_name: shopName,
              mobile_number: item.mobile_number,
            }),
          }
        );

        const result = await response.text();

        console.log("API STATUS:", response.status);
        console.log("API RESPONSE:", result);

        apiTriggered = response.ok;
      } catch (err) {
        console.error("SMS API ERROR:", err);
      }

      const { error: insertError } = await supabase
        .from("leads")
        .insert({
          viewer_id: user.id,
          viewer_name: viewerName,
          shop_id: shopId,
          shop_name: shopName,
          is_verified: true,
          lead_sent: apiTriggered,
        });

      if (insertError) {
        console.error(insertError);
      }

      console.log("LEAD CREATED");
    } catch (error) {
      console.error("LEAD ERROR:", error);
    }
  },
};