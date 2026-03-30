import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../../core/config/supabaseClient";
import { useFavorites } from "../../../core/context/FavoritesContext";

export const useProfileDetail = () => {
  const { id } = useParams();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [priorityProducts, setPriorityProducts] = useState([]);
  const [secondaryProducts, setSecondaryProducts] = useState([]);
  const [relatedProfiles, setRelatedProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState("about");
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const autoScrollRef = useRef(null);

  /* ─────────────────────────────
     FETCH PROFILE
  ───────────────────────────── */
  useEffect(() => {
    if (!id) return;

    setProfile(null);
    setImages([]);
    setPriorityProducts([]);
    setSecondaryProducts([]);
    setRelatedProfiles([]);
    setCurrentIndex(0);

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();

    return () => clearInterval(autoScrollRef.current);
  }, [id]);

  /* ─────────────────────────────
     LOAD DEPENDENT DATA
  ───────────────────────────── */
  useEffect(() => {
    if (!profile?.id) return;

    if (profile.is_prime) {
      loadPrimeCover();
    } else {
      loadFreeTierImages();
    }

    loadProducts(profile.id);
    loadRelatedProfiles(profile);
  }, [profile]);

  /* ─────────────────────────────
     PRIME COVER IMAGE (FIXED)
  ───────────────────────────── */
  const loadPrimeCover = () => {
    if (profile?.cover_image) {
      const imgs = profile.cover_image
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      setImages(imgs.length ? imgs : [fallbackImage()]);
    } else {
      setImages([fallbackImage()]);
    }
  };

  const fallbackImage = () =>
    profile?.profile_image ||
    "https://via.placeholder.com/800x450?text=Business+Cover";

  /* ─────────────────────────────
     FREE TIER IMAGES
  ───────────────────────────── */
  const loadFreeTierImages = async () => {
    const { data } = await supabase
      .from("free_tier_shared_header_images")
      .select("image_url")
      .order("sort_order", { ascending: true });

    if (data?.length > 0) {
      const imgs = data.map((i) => i.image_url);
      setImages(imgs);

      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imgs.length);
      }, 4000);
    } else {
      setImages([fallbackImage()]);
    }
  };

  /* ─────────────────────────────
     PRODUCTS
  ───────────────────────────── */
const loadProducts = async (profileId) => {
  setLoadingProducts(true);

  const { data, error } = await supabase
    .from("product_table")
    .select("*")
    .eq("profile_id", profileId);

  if (error) {
    console.error("Product fetch error:", error);
    setLoadingProducts(false);
    return;
  }

  const mapped = data.map((p) => ({
    id: p.id?.toString() || p.product_id?.toString(),
    name: p.product_name || "",
    image: p.product_image || "",
    description: p.product_description || "",
    price: p.price || "",
  }));

  setPriorityProducts(mapped); // show all products
  setSecondaryProducts([]); // not needed
  setLoadingProducts(false);
};

  /* ─────────────────────────────
     RELATED PROFILES
  ───────────────────────────── */
  const loadRelatedProfiles = async (profileData) => {
    if (!profileData?.keywords) return;

    setLoadingRelated(true);

    const keywordArray = profileData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)
      .slice(0, 3);

    if (!keywordArray.length) {
      setLoadingRelated(false);
      return;
    }

    const orFilter = keywordArray
      .map((word) => `keywords.ilike.%${word}%`)
      .join(",");

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .neq("id", profileData.id)
      .or(orFilter)
      .limit(4);

    if (data) setRelatedProfiles(data);

    setLoadingRelated(false);
  };

  /* ─────────────────────────────
     ACTIONS
  ───────────────────────────── */
  const handleShare = () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: profile?.business_name || profile?.person_name,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link Copied!");
    }
  };

  const isFavorite = favorites.some((f) => f.id === profile?.id);

  const handleFavoriteToggle = () => {
    if (!profile) return;

    if (isFavorite) {
      removeFavorite(profile.id);
    } else {
      setShowFavoriteModal(true);
    }
  };

  return {
    profile,
    images,
    currentIndex,
    setCurrentIndex,
    priorityProducts,
    secondaryProducts,
    relatedProfiles,
    activeTab,
    setActiveTab,
    showFavoriteModal,
    setShowFavoriteModal,
    loadingProducts,
    loadingRelated,
    isFavorite,
    handleShare,
    handleFavoriteToggle,
    addFavorite,
  };
};