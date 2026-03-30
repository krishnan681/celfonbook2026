// import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
// import "./navbar.css";

// const MainLayout = () => {
//   return (
//     <div className="layout">
//       <Navbar />
//       <div className="layout-content">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default MainLayout;
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SearchFooter from "./SearchFooter";

export default function MainLayout() {

  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      {/* Footer Switch */}
      {isSearchPage ? <SearchFooter /> : <Footer />}
    </>
  );
}