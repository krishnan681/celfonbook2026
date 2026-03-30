import { supabase } from "../../../core/config/supabaseClient";
import { mapProduct } from "../models/productModel";

export const useProfileDetail = () => {

  const getProducts = async (profileId) => {
    const { data, error } = await supabase
      .from("product_table") // make sure table name matches
      .select("*")
      .eq("profile_id", profileId);

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return data.map(mapProduct);
  };

  return {
    getProducts,
  };
};