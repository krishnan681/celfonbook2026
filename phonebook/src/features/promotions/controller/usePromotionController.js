import { useNavigate } from "react-router-dom";
import { PromotionService } from "../services/promotionService";
import toast from "react-hot-toast";

export const usePromotionController = () => {
  const navigate = useNavigate();

  const isUserLoggedIn = async () => {
    return await PromotionService.isLoggedIn();
  };

  const logout = async () => {
    await PromotionService.logout();
    navigate("/");
  };

  const protectedNavigation = async (path) => {
    const loggedIn = await isUserLoggedIn();

    if (loggedIn) {
      navigate(path);
    } else {
      toast.error("Please login to access this feature");
    }
  };

  return {
    isUserLoggedIn,
    logout,
    protectedNavigation,
  };
};