// // profileService.js
// import { supabase } from "../config/supabaseClient";

// // Get the main editable profile (public.profiles)
// export const getMyProfile = async () => {
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return null;

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("auth_id", user.id)
//       .maybeSingle();   // ← safer than .limit(1)

//     if (error) {
//       console.error("getMyProfile error:", error);
//       return null;
//     }
//     return data;
//   } catch (err) {
//     console.error("getMyProfile crash:", err);
//     return null;
//   }
// };

// // Get basic signup profile (public.s_profiles)
// export const getSignUpProfile = async () => {
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return null;

//     const { data, error } = await supabase
//       .from("s_profiles")
//       .select("full_name, phone, city, business_name, avatar_url")
//       .eq("user_id", user.id)
//       .maybeSingle();

//     if (error) console.error("getSignUpProfile error:", error);
//     return data || null;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

// export const upsertProfile = async (profileData) => {
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) throw new Error("Not authenticated");

//   const payload = {
//     auth_id: user.id,
//     updated_at: new Date().toISOString(),
//     ...profileData,
//   };

//   const { error } = await supabase
//     .from("profiles")
//     .upsert(payload, { onConflict: "auth_id" });

//   if (error) {
//     console.error("upsertProfile failed:", error);
//     throw error;
//   }

//   return payload;
// };












// // profileService.js
// import { supabase } from "../config/supabaseClient";

// /**
//  * Get profile from public.profiles
//  * Source of truth table
//  */
// export const getMyProfile = async () => {
//   try {
//     const { data: { user }, error: authError } =
//       await supabase.auth.getUser();

//     if (authError || !user) return null;

//     const { data, error } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("auth_id", user.id) // 🔥 IMPORTANT
//       .maybeSingle();

//     if (error) {
//       console.error("getMyProfile error:", error);
//       return null;
//     }

//     return data || null;
//   } catch (err) {
//     console.error("getMyProfile crash:", err);
//     return null;
//   }
// };


// /**
//  * Get signup data from public.s_profiles
//  * Used only as fallback if profile not created yet
//  */
// export const getSignUpProfile = async () => {
//   try {
//     const { data: { user }, error: authError } =
//       await supabase.auth.getUser();

//     if (authError || !user) return null;

//     const { data, error } = await supabase
//       .from("s_profiles")
//       .select("*")
//       .eq("id", user.id) // 🔥 CORRECT COLUMN (NOT user_id)
//       .maybeSingle();

//     if (error) {
//       console.error("getSignUpProfile error:", error);
//       return null;
//     }

//     return data || null;
//   } catch (err) {
//     console.error("getSignUpProfile crash:", err);
//     return null;
//   }
// };


// /**
//  * Convert s_profiles structure → profiles structure
//  * Only used when creating profile first time
//  */
// const mapSignupToProfilePayload = (signupData) => {
//   if (!signupData) return {};

//   return {
//     person_name: signupData.full_name || "",
//     mobile_number: signupData.phone || "",
//     city: signupData.city || "",
//     business_name: signupData.business_name || "",
//     user_type:
//       signupData.user_type === "business"
//         ? "business"
//         : "person",
//     address: signupData.business_address || "",
//     activity: signupData.activity || "",
//     promo_code: signupData.promo_code || "",
//     profile_image: signupData.avatar_url || null,
//   };
// };


// /**
//  * Insert or update public.profiles
//  * Always writes using auth_id as conflict key
//  */
// export const upsertProfile = async (
//   profileData,
//   isFromSignup = false
// ) => {
//   const { data: { user }, error: authError } =
//     await supabase.auth.getUser();

//   if (authError || !user) {
//     throw new Error("Not authenticated");
//   }

//   let finalPayload = { ...profileData };

//   // If first time creation from signup
//   if (isFromSignup) {
//     finalPayload = {
//       ...mapSignupToProfilePayload(profileData),
//       ...profileData, // user edits override defaults
//     };
//   }

//   const payload = {
//     auth_id: user.id,
//     updated_at: new Date().toISOString(),
//     ...finalPayload,
//   };

//   const { error } = await supabase
//     .from("profiles")
//     .upsert(payload, {
//       onConflict: "auth_id",
//     });

//   if (error) {
//     console.error("upsertProfile failed:", error);
//     throw error;
//   }

//   return payload;
// };


import { supabase } from "../config/supabaseClient";

/* Get current user profile */
export async function getCurrentUser() {

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (data) return data;

  if (user.phone) {

    const { data: phoneData } = await supabase
      .from("profiles")
      .select("*")
      .eq("mobile_number", user.phone)
      .maybeSingle();

    if (phoneData) {

      await supabase
        .from("profiles")
        .update({ id: user.id })
        .eq("mobile_number", user.phone);

      return { ...phoneData, id: user.id };
    }
  }

  return {
    id: user.id,
    mobile_number: user.phone
  };
}


/* Update profile */
export async function updateProfileData(data) {

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  data.id = user.id;
  data.updated_at = new Date().toISOString();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) {

    await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id);

  } else {

    await supabase
      .from("profiles")
      .insert([data]);

  }
}


/* Upload profile image */
export async function uploadProfileImage(file) {

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });

  if (error) {
    console.error(error);
    return null;
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  return data.publicUrl;
}