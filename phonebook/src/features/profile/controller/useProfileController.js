import { useEffect, useState } from "react";
import {
  getCurrentUser,
  updateProfileData,
} from "../../../core/services/profileService";
// import { emptyProfile } from "../model/userProfileModel";
import { emptyProfile } from "../models/profileModel";

export default function useProfileController() {

  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [isBusiness, setIsBusiness] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {

    setLoading(true);

    const data = await getCurrentUser();

    if (data) {

      setForm({
        ...emptyProfile,
        ...data
      });

      if (data.user_type === "business" || data.is_business === true) {
        setIsBusiness(true);
      }
    }

    setLoading(false);
  }

  function handleChange(e) {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function saveProfile() {

    const payload = {
      ...form,
      user_type: isBusiness ? "business" : "person",
      is_business: isBusiness
    };

    await updateProfileData(payload);

    alert("Profile saved");

    loadProfile();
  }

  return {
    form,
    loading,
    isBusiness,
    setIsBusiness,
    handleChange,
    saveProfile
  };
}