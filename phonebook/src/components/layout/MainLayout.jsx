import { Outlet, useLocation, matchPath } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SearchFooter from "./SearchFooter";
import OfflineBanner from "../common/OfflineBanner";

export default function MainLayout() {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  // Hide footer on ClubDistrictsPage and ClubDistrictClubsPage
  const isClubPageWithoutFooter = Boolean(
    matchPath({ path: "/lions-club", end: true }, location.pathname) ||
      matchPath({ path: "/clubs/:clubSlug", end: true }, location.pathname) ||
      (matchPath({ path: "/lions-club/:districtId", end: true }, location.pathname) &&
        !matchPath({ path: "/lions-club/member/:memberId", end: true }, location.pathname)) ||
      (matchPath({ path: "/clubs/:clubSlug/:districtId", end: true }, location.pathname) &&
        !matchPath({ path: "/clubs/:clubSlug/member/:memberId", end: true }, location.pathname))
  );

  return (
    <>
      <OfflineBanner />
      <Navbar />

      <main>
        <Outlet />
      </main>

      {/* Footer Switch */}
      {isClubPageWithoutFooter ? null : isSearchPage ? <SearchFooter /> : <Footer />}
    </>
  );
}