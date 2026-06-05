// src/features/settings/pages/MyReferralsPage.jsx

import "../css/myReferrals.css";
import ReferralAccordion from "../components/ReferralAccordion";
import { useReferralController } from "../controller/useReferralController";

const MyReferralsPage = () => {
  const { groupedData, loading, error, loadData, totalMembers } =
    useReferralController();

  if (loading) {
    return <div className="referral-loader">Loading...</div>;
  }

  if (error) {
    return (
      <div className="referral-error">
        <p>{error}</p>

        <button onClick={loadData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="my-referrals-page">
      <h2>All Referrals</h2>

      {Object.keys(groupedData).length === 0 ? (
        <div className="empty-state">No referral data found.</div>
      ) : (
        <>
          <div className="summary-card">
            <div className="summary-box codes">
              <h3>{Object.keys(groupedData).length}</h3>
              <p>Total Promo Codes</p>
            </div>

            <div className="summary-box members">
              <h3>{totalMembers}</h3>
              <p>Total Members</p>
            </div>
          </div>

          <button className="refresh-btn" onClick={loadData}>
            Refresh
          </button>

          {Object.entries(groupedData).map(([promoCode, users]) => (
            <ReferralAccordion
              key={promoCode}
              promoCode={promoCode}
              users={users}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default MyReferralsPage;
