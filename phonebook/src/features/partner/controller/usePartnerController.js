// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { supabase } from "../../../core/config/supabaseClient";

// export const usePartnerController = () => {
//   const [profileType, setProfileType] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [mobileExists, setMobileExists] = useState(false);

//   // ============================
//   // INITIAL STATE
//   // ============================

//   const getInitialState = (type) => {
//     if (type === "business") {
//       return {
//         profile_type: "business",
//         mobile_number: "",
//         business_name: "",
//         owner_name: "",
//         owner_prefix: "",
//         keywords: "",
//         description: "",
//         landline_code: "",
//         landline_number: "",
//         door_no: "",
//         street_name: "",
//         area: "",
//         city: "",
//         pincode: "",
//         email: "",
//         promo_code: "",
//         business_prefix: "M/s.",
//       };
//     }

//     return {
//       profile_type: "person",
//       mobile_number: "",
//       person_name: "",
//       person_prefix: "",
//       profession: "",
//       landline_code: "",
//       landline_number: "",
//       door_no: "",
//       street_name: "",
//       area: "",
//       city: "",
//       pincode: "",
//       email: "",
//       promo_code: "",
//     };
//   };

//   // ============================
//   // TYPE SELECTION
//   // ============================

//   const handleTypeSelection = (type) => {
//     setProfileType(type);
//     setFormData(getInitialState(type));
//   };

//   // ============================
//   // CHANGE HANDLER
//   // ============================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     let formatted = value;

//     if (name === "mobile_number") {
//       formatted = value.replace(/\D/g, "").slice(0, 10);
//     }

//     if (name === "pincode") {
//       formatted = value.replace(/\D/g, "").slice(0, 6);
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: formatted,
//     }));
//   };

//   // ============================
//   // MOBILE EXIST CHECK
//   // ============================

//   useEffect(() => {
//     const checkMobile = async () => {
//       if (formData.mobile_number?.length === 10) {
//         const { data } = await supabase
//           .from("profiles")
//           .select("id")
//           .eq("mobile_number", formData.mobile_number)
//           .maybeSingle();

//         setMobileExists(!!data);
//       } else {
//         setMobileExists(false);
//       }
//     };

//     checkMobile();
//   }, [formData.mobile_number]);

//   // ============================
//   // VALIDATION
//   // ============================

//   const validateForm = () => {
//     if (!profileType) {
//       Swal.fire("Error", "Select account type", "error");
//       return false;
//     }

//     if (formData.mobile_number.length !== 10) {
//       Swal.fire("Error", "Mobile must be 10 digits", "error");
//       return false;
//     }

//     if (formData.pincode.length !== 6) {
//       Swal.fire("Error", "Pincode must be 6 digits", "error");
//       return false;
//     }

//     if (profileType === "person") {
//       if (!formData.person_name || !formData.profession) {
//         Swal.fire("Error", "Fill all required person fields", "error");
//         return false;
//       }
//     }

//     if (profileType === "business") {
//       if (!formData.business_name || !formData.owner_name) {
//         Swal.fire("Error", "Fill all required business fields", "error");
//         return false;
//       }
//     }

//     if (mobileExists) {
//       Swal.fire("Error", "Mobile already registered", "error");
//       return false;
//     }

//     return true;
//   };

//   // ============================
//   // SUBMIT
//   // ============================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       const { error } = await supabase
//         .from("profiles")
//         .insert([formData]);

//       if (error) throw error;

//       Swal.fire("Success", "Profile saved successfully", "success");

//       setProfileType(null);
//       setFormData({});
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Failed to save profile", "error");
//     }
//   };

//   return {
//     profileType,
//     formData,
//     mobileExists,
//     handleChange,
//     handleSubmit,
//     handleTypeSelection,
//     setProfileType,
//   };
// };

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../../core/config/supabaseClient";

export const usePartnerController = () => {
  const [profileType, setProfileType] = useState(null);
  const [formData, setFormData] = useState({});
  const [mobileExists, setMobileExists] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // INITIAL STATE
  // =========================
  const getInitialState = (type) => {
    if (type === "business") {
      return {
        user_type: "business",
        is_business: true,

        mobile_number: "",
        business_name: "",
        business_prefix: "M/s.",
        keywords: "",
        description: "",

        landline_code: "",
        landline: "",

        city: "",
        pincode: "",
        email: "",
        promo_code: "",

        address: "",
        bussiness_address: "",
      };
    }

    return {
      user_type: "person",
      is_business: false,

      mobile_number: "",
      person_name: "",
      person_prefix: "",

      landline_code: "",
      landline: "",

      city: "",
      pincode: "",
      email: "",
      promo_code: "",

      address: "",
    };
  };

  const handleTypeSelection = (type) => {
    setProfileType(type);
    setFormData(getInitialState(type));
    setTouched({});
  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "mobile_number") {
      formatted = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "pincode") {
      formatted = value.replace(/\D/g, "").slice(0, 6);
    }

    if (name === "landline" || name === "landline_code") {
      formatted = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formatted,
    }));

    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // =========================
  // CHECK MOBILE EXISTS
  // =========================
  useEffect(() => {
    const checkMobile = async () => {
      if (formData.mobile_number?.length === 10) {
        const { data } = await supabase
          .from("profiles")
          .select("id")
          .eq("mobile_number", formData.mobile_number)
          .maybeSingle();

        setMobileExists(!!data);
      } else {
        setMobileExists(false);
      }
    };

    checkMobile();
  }, [formData.mobile_number]);

  // =========================
  // VALIDATION
  // =========================
  const isValidMobile = /^[6-9]\d{9}$/.test(formData.mobile_number);
  const isValidPincode = formData.pincode?.length === 6;

  const getInputClass = (field) => {
    if (!touched[field]) return "form-control";
    if (!formData[field]) return "form-control is-invalid";
    return "form-control is-valid";
  };

  const validateForm = () => {
    if (!isValidMobile) {
      Swal.fire("Error", "Invalid mobile number", "error");
      return false;
    }

    if (!isValidPincode) {
      Swal.fire("Error", "Pincode must be 6 digits", "error");
      return false;
    }

    if (mobileExists) {
      Swal.fire("Error", "Mobile already exists", "error");
      return false;
    }

    return true;
  };

  // =========================
  // SUBMIT (FULL FLUTTER LOGIC)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (submitting) return;

    setSubmitting(true);

    try {
      // 1. AUTH USER
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      const user = userData?.user;

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // 2. INSERT PROFILE
      const payload = {
        user_type: formData.user_type,
        is_business: formData.is_business,

        mobile_number: formData.mobile_number,

        person_name: formData.person_name || null,
        person_prefix: formData.person_prefix || null,

        business_name: formData.business_name || null,
        business_prefix: formData.business_prefix || "M/s.",

        keywords: formData.keywords
          ? formData.keywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
              .join(", ")
          : null,

        description: formData.description || null,

        city: formData.city || null,
        pincode: formData.pincode || null,
        email: formData.email || null,
        promo_code: formData.promo_code || null,

        landline_code: formData.landline_code || null,
        landline: formData.landline || null,

        address: formData.address || null,
        bussiness_address: formData.bussiness_address || null,

        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([payload]);

      if (profileError) throw profileError;

      // 3. GET s_profile
      const { data: sProfile, error: sProfileError } = await supabase
        .from("s_profiles")
        .select("id, full_name")
        .eq("user_id", user.id)
        .single();

      if (sProfileError || !sProfile) {
        throw new Error("Failed to fetch s_profile");
      }

      const sProfileId = sProfile.id;
      const sProfileName = sProfile.full_name;

      // 4. DATE CALCULATION
      const now = new Date();

      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0, 0, 0
      );

      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23, 59, 59
      );

      const todayDate = startOfDay.toISOString().split("T")[0];

      // 5. INSERT ACTIVITY
      const { error: activityError } = await supabase
        .from("data_entry_name")
        .insert([
          {
            user_id: sProfileId,
            user_name: sProfileName,
            entryname:
              formData.person_name ||
              formData.business_name ||
              "Entry",

            entry_type: formData.is_business
              ? "Business Profile Entry"
              : "Person Profile Entry",

            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          },
        ]);

      if (activityError) throw activityError;

      // 6. GET TODAY COUNT
      const { data: todayEntries, error: countError } =
        await supabase
          .from("data_entry_name")
          .select("id")
          .eq("user_id", sProfileId)
          .gte("created_at", startOfDay.toISOString())
          .lte("created_at", endOfDay.toISOString());

      if (countError) throw countError;

      const todayCount = todayEntries?.length || 0;
      const todayEarnings = todayCount * 2;

      // 7. UPSERT REVENUE
      const { error: upsertError } = await supabase
        .from("data_entry_table")
        .upsert(
          {
            user_id: sProfileId,
            user_name: sProfileName,
            count: todayCount,
            earnings: todayEarnings,
            entry_date: todayDate,
            updated_at: now.toISOString(),
          },
          { onConflict: "user_id,entry_date" }
        );

      if (upsertError) throw upsertError;

      // SUCCESS
      Swal.fire("Success", "Profile saved successfully", "success");

      setProfileType(null);
      setFormData({});
      setTouched({});
    } catch (err) {
      console.error("Submit Error:", err);
      Swal.fire("Error", err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    profileType,
    formData,
    mobileExists,
    handleChange,
    handleSubmit,
    handleTypeSelection,
    setProfileType,
    getInputClass,
  };
};