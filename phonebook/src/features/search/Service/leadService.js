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
//         console.error("SHOP ID MISSING");
//         return;
//       }

//       const shopName =
//         item?.business_name?.trim()
//           ? item.business_name
//           : item.person_name;

//       const { data: shopProfile, error: shopError } = await supabase
//         .from("profiles")
//         .select("verified")
//         .eq("id", shopId)
//         .maybeSingle();

//       console.log("SHOP PROFILE:", shopProfile);
//       console.log("SHOP ERROR:", shopError);

//       const verified = shopProfile?.verified ?? false;

//       console.log("VERIFIED:", verified);

//       if (!verified) {
//         console.log("NOT VERIFIED - LEAD SKIPPED");
//         return;
//       }

//       // prevent duplicate leads

//       const { data: existingLead } = await supabase
//         .from("leads")
//         .select("id")
//         .eq("viewer_id", user.id)
//         .eq("shop_id", shopId)
//         .maybeSingle();

//       if (existingLead) {
//         console.log("LEAD ALREADY EXISTS");
//         return;
//       }

//       let apiTriggered = false;

//       try {
//         const response = await fetch(
//           "https://celfonbook.directory/api/create-lead.php",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               shop_id: shopId,
//               shop_name: shopName,
//               mobile_number: item.mobile_number,
//             }),
//           }
//         );

//         const result = await response.text();

//         console.log("API STATUS:", response.status);
//         console.log("API RESPONSE:", result);

//         apiTriggered = response.ok;
//       } catch (err) {
//         console.error("SMS API ERROR:", err);
//       }

//       const { error: insertError } = await supabase
//         .from("leads")
//         .insert({
//           viewer_id: user.id,
//           viewer_name: viewerName,
//           shop_id: shopId,
//           shop_name: shopName,
//           is_verified: true,
//           lead_sent: apiTriggered,
//         });

//       if (insertError) {
//         console.error(insertError);
//       }

//       console.log("LEAD CREATED");
//     } catch (error) {
//       console.error("LEAD ERROR:", error);
//     }
//   },
// };

import { supabase } from "../../../core/config/supabaseClient";

export const LeadService = {
  async createLead(item) {
    try {
      console.log("====================================");
      console.log("LEAD START");
      console.log("ITEM:", item);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("AUTH USER:", user);
      console.log("AUTH ERROR:", userError);

      if (!user) {
        console.log("NO USER FOUND");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("s_profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      console.log("VIEWER PROFILE:", profile);
      console.log("PROFILE ERROR:", profileError);

      const viewerName = profile?.full_name || "";

      const shopId = item?.id?.toString();

      console.log("SHOP ID:", shopId);

      if (!shopId) {
        console.error("SHOP ID MISSING");
        return;
      }

      const shopName = item?.business_name?.trim()
        ? item.business_name
        : item.person_name;

      console.log("SHOP NAME:", shopName);
      console.log("MOBILE NUMBER:", item.mobile_number);

      // EXACTLY SAME AS FLUTTER
      const { data: shopProfile, error: shopError } = await supabase
        .from("profiles")
        .select("verified")
        .eq("id", shopId)
        .maybeSingle();

      console.log("SHOP PROFILE:", shopProfile);
      console.log("SHOP ERROR:", shopError);

      const verified = shopProfile?.verified ?? false;

      console.log("VERIFIED STATUS:", verified);

      let apiTriggered = false;

      if (verified) {
        console.log("PROFILE VERIFIED");
        console.log("CALLING SMS API");

        try {
          const payload = {
            shop_id: shopId,
            shop_name: shopName,
            mobile_number: item.mobile_number,
            viewer_name: viewerName,
            application: "https://celfonbook.directory",
          };

          console.log("REQUEST PAYLOAD:", payload);

          const response = await fetch(
            "https://celfonbook.directory/api/create-lead.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            },
          );

          console.log("HTTP STATUS:", response.status);
          console.log("HTTP OK:", response.ok);

          const result = await response.text();

          console.log("SMS API RESPONSE:");
          console.log(result);

          apiTriggered = response.ok;
        } catch (err) {
          console.error("SMS API ERROR:", err);
        }
      } else {
        console.log("PROFILE NOT VERIFIED");
        console.log("SMS API NOT CALLED");
      }

      console.log("INSERTING LEAD");

      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .insert({
          viewer_id: user.id,
          viewer_name: viewerName,
          shop_id: shopId,
          shop_name: shopName,
          is_verified: true,
          lead_sent: apiTriggered,
        })
        .select();

      console.log("LEAD INSERT DATA:", leadData);
      console.log("LEAD INSERT ERROR:", leadError);

      console.log("LEAD SUCCESS");
      console.log("SHOP:", shopName);
      console.log("SHOP ID:", shopId);
      console.log("SMS SENT:", apiTriggered);

      console.log("====================================");
    } catch (error) {
      console.error("LEAD ERROR:", error);
    }
  },
};
