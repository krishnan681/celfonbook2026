import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="celfon-footer">

      <div className="celfon-footer-container">

        {/* Column 1 — Brand */}
        <div className="celfon-footer-col celfon-footer-brand">
          <h3>Celfon Book</h3>
          <p>
            Celfon Book Directory connects businesses and customers across India.
            Discover trusted suppliers, services, and professionals in seconds.
          </p>
        </div>

        {/* Column 2 — Explore */}
        <div className="celfon-footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Find Businesses</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        {/* Column 3 — Account */}
        <div className="celfon-footer-col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Register</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
          </ul>
        </div>

        {/* Column 4 — Business */}
        <div className="celfon-footer-col">
          <h4>For Businesses</h4>
          <ul>
            <li><Link to="/partner">Become a Partner</Link></li>
            <li><Link to="/subscription">Subscription</Link></li>
            <li><Link to="/revenue-tracker">Partner Dashboard</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="celfon-footer-bottom">
        <div className="celfon-footer-bottom-container">

          <div className="celfon-footer-copyright">
            © 2026 Celfon Book Directory Services. All rights reserved.
          </div>

          <div className="celfon-footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

        </div>
      </div>

    </footer>
  );
}