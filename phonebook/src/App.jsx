import { Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./features/home/pages/HomePage";
import LoginPage from "./features/auth/Pages/LoginPage";
import ForgotPassword from "./features/auth/Pages/ForgotPassword";
import SearchPage from "./features/search/pages/SearchPage";
import SignupPage from "./features/auth/Pages/SignupPage";
import VerifyEmailPage from "./features/auth/Pages/VerifyEmailPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import EditProfilePage from "./features/profile/pages/EditProfilePage";
import ProfileDetailPage from "./features/DetailedProfile/pages/ProfileDetailPage";
import SubscriptionPage from "./features/subscription/pages/SubscriptionPage";
import FavoritesPage from "./features/favorites/pages/FavoritesPage";
import PartnerPage from "./features/partner/pages/PartnerPage";
import RevenueTrackerPage from "./features/partner/pages/RevenueTracker";
import About from "./components/common/about";
import Products from "./components/common/Products";
import { Toaster } from "react-hot-toast";

import SettingsPage from "./features/settings/pages/SettingsPage";
import ReverseNumberFinder from "./features/settings/components/ReverseNumberFinder";
import SearchHistory from "./features/settings/components/SearchHistory";
import PrivacyPolicyPage from "./features/settings/pages/PrivacyPolicyPage";
import TermsPage from "./features/settings/pages/TermsPage";
import ContactUs from "./features/settings/components/ContactUs";

import VerifiedNumbersPage from "./features/verifiedNumbers/pages/VerifiedNumbersPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";

import CombinedTariffPage from "./features/settings/components/CombinedTariffPage";

import PromotionsPage from "./features/promotions/pages/PromotionsPage";

import NearbyPromotionPage from "./features/promotions/nearby/pages/NearbyPromotionPage";
import NearbyResultsPage from "./features/promotions/nearby/pages/NearbyResultsPage";

import CategorywisePromotionPage from "./features/promotions/categorywise/pages/CategorywisePromotionPage";
import CategorywiseResultsPage from "./features/promotions/categorywise/pages/CategorywiseResultsPage";
import { CategorywiseProvider } from "./features/promotions/categorywise/context/CategorywiseContext";

import AdminPage from "./features/admin/pages/AdminPage";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />

      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="profile/:id" element={<ProfileDetailPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="partner" element={<PartnerPage />} />
          <Route path="revenue-tracker" element={<RevenueTrackerPage />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="reverse-number" element={<ReverseNumberFinder />} />
          <Route path="search-history" element={<SearchHistory />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="combined-tariff" element={<CombinedTariffPage />} />

       
          <Route path="promotions" element={<PromotionsPage />} />

   
          <Route path="nearby-promotion" element={<NearbyPromotionPage />} />
          <Route path="nearby-results" element={<NearbyResultsPage />} />

          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="category"
            element={
              <CategorywiseProvider>
                <Outlet />
              </CategorywiseProvider>
            }
          >
            <Route path="/category" element={<CategorywisePromotionPage />} />
            <Route path="/category/results" element={<CategorywiseResultsPage />} />
          </Route>

          {/* Protected Route */}
          <Route
            path="verified-numbers"
            element={
              <ProtectedRoute>
                <VerifiedNumbersPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;