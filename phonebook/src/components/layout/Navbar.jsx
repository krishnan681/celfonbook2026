import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../core/config/supabaseClient";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../core/services/profileService";
import { Menu, X, LogOut, ChevronRight, Settings, Heart, Star } from "lucide-react";
import Swal from "sweetalert2";
import "./navbar.css";

import LogoImg from '../../assets/images/celfon5g_logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log out",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setIsLoggingOut(true);
    setIsMenuOpen(false);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      navigate("/", { replace: true });
      Swal.fire({ title: "Logged out", icon: "success", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire("Error", "Failed to log out", "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = () => {
    const name = profile?.full_name || profile?.person_name || "";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LOGO */}
        <div className="nav-logo" onClick={() => { navigate("/"); closeMenu(); }}>
          <img src={LogoImg} alt="Celfone Logo" className="logo-img" />
        </div>

        {/* MOBILE TOGGLE */}
        <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* NAVIGATION LINKS */}
        <div className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}>
          <div className="nav-links-group">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
            <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
            <Link to="/products" className="nav-link" onClick={closeMenu}>Products</Link>
            <Link to="/search" className="nav-link" onClick={closeMenu}>Search</Link>
            
            {user && (
              <>
                <Link to="/partner" className="nav-link partner-link" onClick={closeMenu}>Partner</Link>
                <Link to="/promotions" className="nav-link" onClick={closeMenu}>Promotions</Link>
                <Link to="/favorites" className="nav-link" onClick={closeMenu}>Favorites</Link>
                <Link to="/settings" className="nav-link" onClick={closeMenu}>Settings</Link>
              </>
            )}
          </div>

          <div className="nav-auth-group">
            {!user ? (
              <Link to="/login" className="btn-signin" onClick={closeMenu}>
                Sign in <ChevronRight size={16} />
              </Link>
            ) : (
              <div className="user-control-panel">
                <div className="profile-pill" onClick={() => { navigate("/profile"); closeMenu(); }}>
                  <div className="avatar-small">{getInitials()}</div>
                  <span className="profile-name">
                    {(profile?.full_name || profile?.person_name || "Account").split(" ")[0]}
                  </span>
                </div>
                <button className="btn-icon-logout" onClick={handleLogout} disabled={isLoggingOut}>
                  {isLoggingOut ? "..." : <LogOut size={18} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Overlay for mobile when menu is open */}
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;