// import { useEffect, useState } from "react";
// import {
//   getCurrentUser,
//   updateProfileData,
// } from "../../../core/services/profileService";
// // import { emptyProfile } from "../model/userProfileModel";
// import { emptyProfile } from "../models/profileModel";

// export default function useProfileController() {

//   const [form, setForm] = useState(emptyProfile);
//   const [loading, setLoading] = useState(true);
//   const [isBusiness, setIsBusiness] = useState(false);

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   async function loadProfile() {

//     setLoading(true);

//     const data = await getCurrentUser();

//     if (data) {

//       setForm({
//         ...emptyProfile,
//         ...data
//       });

//       if (data.user_type === "business" || data.is_business === true) {
//         setIsBusiness(true);
//       }
//     }

//     setLoading(false);
//   }

//   function handleChange(e) {

//     const { name, value } = e.target;

//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   }

//   async function saveProfile() {

//     const payload = {
//       ...form,
//       user_type: isBusiness ? "business" : "person",
//       is_business: isBusiness
//     };

//     await updateProfileData(payload);

//     alert("Profile saved");

//     loadProfile();
//   }

//   return {
//     form,
//     loading,
//     isBusiness,
//     setIsBusiness,
//     handleChange,
//     saveProfile
//   };
// }






import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { supabase } from "../../../core/config/supabaseClient";

import {
  getCurrentUser,
  updateProfileData,
  uploadProfileImage as uploadImageService,
} from "../../../core/services/profileService";

import { emptyProfile } from "../models/profileModel";

export default function useProfileController() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [isBusiness, setIsBusiness] = useState(false);

  const [viewsCount, setViewsCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const data = await getCurrentUser();

      if (!data) {
        setLoading(false);
        return;
      }

      setProfile({
        ...emptyProfile,
        ...data,
      });

      setIsBusiness(
        data.user_type === "business" ||
        data.is_business === true
      );

      const shopId = data.id;

      // Views
      const { data: viewsData } = await supabase
        .from("views")
        .select("*")
        .eq("shop_id", shopId);

      const totalViews =
        viewsData?.reduce(
          (sum, item) => sum + (item.views || 1),
          0
        ) || 0;

      setViewsCount(totalViews);

      // Leads
      const { data: leadsData } = await supabase
        .from("leads")
        .select("*")
        .eq("shop_id", shopId)
        .order("created_at", {
          ascending: false,
        });

      setLeadsCount(leadsData?.length || 0);

      setRecentLeads(
        (leadsData || []).slice(0, 5)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function saveProfile(formData) {
    try {
      const payload = {
        ...formData,
        user_type: isBusiness ? "business" : "person",
        is_business: isBusiness,
      };

      await updateProfileData(payload);

      await Swal.fire({
        icon: "success",
        title: "Profile Saved",
        text: "Your profile has been updated successfully.",
        confirmButtonText: "OK",
      });

      await loadProfile();

      // Redirect to profile page
      navigate("/profile");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text:
          error?.message ||
          "Failed to save profile",
      });
    }
  }

  async function uploadProfileImage(file) {
    const url = await uploadImageService(file);

    if (!url) return;

    setProfile((prev) => ({
      ...prev,
      profile_image: url,
    }));

    return url;
  }

  return {
    profile,
    loading,
    isBusiness,
    setIsBusiness,
    handleChange,
    saveProfile,
    uploadProfileImage,

    viewsCount,
    leadsCount,
    recentLeads,

    reloadProfile: loadProfile,
  };
}