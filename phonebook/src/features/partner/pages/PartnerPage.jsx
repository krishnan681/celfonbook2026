import { usePartnerController } from "../controller/usePartnerController";
import PartnerForm from "../components/PartnerForm";
import { User, Briefcase, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/PartnerPage.css";

const PartnerPage = () => {
  const controller = usePartnerController();
  const navigate = useNavigate();

  if (!controller.profileType) {
    return (
      <div className="partner-wrapper">
        <div className="partner-card">

          {/* HEADER */}
          <div className="partner-header">
            <h1 className="partner-title">MEDIA PARTNER</h1>
            <p className="partner-sub">By adding Choose account type</p>
            {/* <h2 className="partner-heading"></h2> */}
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
                    Looking for services? Create a personal account and explore.
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
                    Promote your business and reach your target audience.
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
                Monitor your referral earnings and track successful registrations
                generated through your media partner invitations.
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
            By adding and inviting people, you'll be rewarded for every successful member.
          </p>

        </div>
      </div>
    );
  }

  return <PartnerForm {...controller} />;
};

export default PartnerPage;