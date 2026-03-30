import { useState } from "react";
import { supabase } from "@/core/config/supabaseClient";

export const useProfileCard = (profile, isKeywordFocused) => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);

  const name = profile.business_name || profile.person_name || "Unnamed";
  const city = profile.city || "Not specified";
  const keywords = profile.keywords?.trim() || "";
  const maskedMobile =
    profile.mobile_number?.length >= 5
      ? profile.mobile_number.slice(0, 5) + "xxxxx"
      : "96857xxxxx";

  const handleCall = () => {
    if (!profile.mobile_number) {
      alert("No phone number available");
      return;
    }
    window.location.href = `tel:${profile.mobile_number}`;
  };

  const checkAndOpenFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login to save favorites");
        return;
      }
      setIsFavoriteOpen(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return {
    name,
    city,
    keywords,
    maskedMobile,
    isEnquiryOpen,
    setIsEnquiryOpen,
    isFavoriteOpen,
    setIsFavoriteOpen,
    handleCall,
    handleFavoriteClick: checkAndOpenFavorite,
    shouldShowKeywords: isKeywordFocused && keywords.length > 0,
    shouldShowMobile: !isKeywordFocused,
  };
};