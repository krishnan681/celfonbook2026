import { Link } from "react-router-dom";
import "./searchfooter.css";

export default function SearchFooter() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Added class footer-left for better control */}
        <div className="footer-left">
          © {new Date().getFullYear()} Celfon Book Directory Services. All rights reserved.
        </div>

        <div className="footer-right">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/cookies">Cookie Policy</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

      </div>
    </footer>
  );
}