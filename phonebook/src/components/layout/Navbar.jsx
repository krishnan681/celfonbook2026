import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../core/config/supabaseClient";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../core/services/profileService";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import "./navbar.css";

import LogoImg from "../../assets/images/celfon5g_logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  // Auth Listener & Sync
  useEffect(() => {
    let mounted = true;

    const syncAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(user);

        if (user) {
          const profileData = await getCurrentUser().catch(() => null);
          if (mounted) setProfile(profileData);
        }
      } catch (err) {
        console.error("Auth sync error:", err);
      }
    };

    syncAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        getCurrentUser()
          .then(p => mounted && setProfile(p))
          .catch(() => mounted && setProfile(null));
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
    });

    if (!result.isConfirmed) return;

    setIsLoggingOut(true);
    setIsMenuOpen(false);

    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      navigate("/", { replace: true });

      Swal.fire({
        title: "Logged out",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Error", "Logout failed", "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = () => {
    const name = profile?.business_name || profile?.person_name || profile?.full_name || "";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 1) || "U";
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LOGO */}
        <div className="nav-logo" onClick={() => navigate("/")}>
          <img src={LogoImg} alt="Logo" className="logo-img" />
        </div>

        {/* MOBILE TOGGLE BUTTON */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* NAVIGATION MENU */}
        <div className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}>
          <div className="nav-links-group">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/search" className="nav-link">Search</Link>

            {user && (
              <>
                <Link to="/partner" className="nav-link partner-link">Partner</Link>
                <Link to="/promotions" className="nav-link">Promotions</Link>
                <Link to="/favorites" className="nav-link">Favorites</Link>
                <Link to="/settings" className="nav-link">Settings</Link>
              </>
            )}
          </div>

          <div className="nav-auth-group">
            {!user ? (
              <Link to="/login" className="btn-signin">
                Sign in <ChevronRight size={16} />
              </Link>
            ) : (
              <div className="user-control-panel">
                <div className="profile-pill" onClick={() => navigate("/profile")}>
                  <div className="avatar-small">{getInitials()}</div>
                  <span className="profile-name">
                    {(profile?.business_name || profile?.person_name || "Account").split(" ")[0]}
                  </span>
                </div>

                <button
                  className="btn-icon-logout"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "..." : (
                    <>
                      <LogOut size={18} />
                      <span className="logout-text">Logout</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CLICKABLE OVERLAY FOR MOBILE */}
      {isMenuOpen && (
        <div
          className="nav-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;