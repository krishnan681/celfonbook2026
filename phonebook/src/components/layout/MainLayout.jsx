import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SearchFooter from "./SearchFooter";
import OfflineBanner from "../common/OfflineBanner";

export default function MainLayout() {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  return (
    <>
      <OfflineBanner />
      <Navbar />

      <main>
        <Outlet />
      </main>

      {/* Footer Switch */}
      {isSearchPage ? <SearchFooter /> : <Footer />}
    </>
  );
}