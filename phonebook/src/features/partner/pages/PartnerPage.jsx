import { usePartnerController } from "../controller/usePartnerController";
import PartnerForm from "../components/PartnerForm";
import { User, Briefcase, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../core/config/supabaseClient";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import "../css/partnerPage.css";

const PartnerPage = () => {
  const controller = usePartnerController();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          Swal.fire({
            title: "Login Required",
            text: "You must be logged in to create a Media Partner account.",
            icon: "warning",
            confirmButtonText: "Go to Login",
          }).then(() => {
            navigate("/login");
          });
          return;
        }

        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="partner-wrapper">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect already happened)
  if (!isAuthenticated) {
    return null;
  }

  if (!controller.profileType) {
    return (
      <div className="partner-wrapper">
        <div className="partner-card">

          {/* HEADER */}
          <div className="partner-header">
            <h1 className="partner-title">MEDIA PARTNER</h1>
            <p className="partner-sub">
              By adding Choose account type
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="partner-grid">

            {/* ACCOUNT TYPE CARD */}
            <div className="account-type-card">
              <h3 className="account-title">Account Options</h3>

              <div className="account-options">

                {/* PERSON OPTION */}
                <div className="type-option">
                  <div className="icon-circle blue">
                    <User size={36} />
                  </div>
                  <h3>Person</h3>
                  <p>
                    Looking for services? Create a
                    personal account and explore.
                  </p>
                  <button
                    className="btn-blue"
                    onClick={() => controller.handleTypeSelection("person")}
                  >
                    Create Person Account
                  </button>
                </div>

                {/* DIVIDER */}
                <div className="vertical-divider"></div>

                {/* BUSINESS OPTION */}
                <div className="type-option">
                  <div className="icon-circle yellow">
                    <Briefcase size={36} />
                  </div>
                  <h3>Business</h3>
                  <p>
                    Promote your business and
                    reach your target audience.
                  </p>
                  <button
                    className="btn-yellow"
                    onClick={() => controller.handleTypeSelection("business")}
                  >
                    Create Business Account
                  </button>
                </div>

              </div>
            </div>

            {/* REVENUE CARD */}
            <div className="revenue-card">
              <div className="icon-circle green">
                <TrendingUp size={40} />
              </div>
              <h3>Revenue Tracker</h3>
              <p>
                Monitor your referral earnings and
                track successful registrations
                generated through your media
                partner invitations.
              </p>
              <button
                className="btn-green"
                onClick={() => navigate("/revenue-tracker")}
              >
                View Revenue
              </button>
            </div>

          </div>

          {/* FOOTER */}
          <p className="partner-footer">
            By adding and inviting people,
            you'll be rewarded for every
            successful member.
          </p>

        </div>
      </div>
    );
  }

  return (
    <PartnerForm
      {...controller}
      showOtpPage={controller.showOtpPage}
      enteredOtp={controller.enteredOtp}
      setEnteredOtp={controller.setEnteredOtp}
      verifyOtp={controller.verifyOtp}
      setShowOtpPage={controller.setShowOtpPage}
    />
  );
};

export default PartnerPage;