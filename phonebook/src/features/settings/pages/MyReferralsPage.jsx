// // src/features/settings/pages/MyReferralsPage.jsx

// import "../css/myReferrals.css";
// import ReferralAccordion from "../components/ReferralAccordion";
// import { useReferralController } from "../controller/useReferralController";

// const MyReferralsPage = () => {
//   const { groupedData, loading, error, loadData, totalMembers } =
//     useReferralController();

//   if (loading) {
//     return <div className="referral-loader">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="referral-error">
//         <p>{error}</p>

//         <button onClick={loadData}>Retry</button>
//       </div>
//     );
//   }

//   return (
//     <div className="my-referrals-page">
//       <h2>All Referrals</h2>

//       {Object.keys(groupedData).length === 0 ? (
//         <div className="empty-state">No referral data found.</div>
//       ) : (
//         <>
//           <div className="summary-card">
//             <div className="summary-box codes">
//               <h3>{Object.keys(groupedData).length}</h3>
//               <p>Total Promo Codes</p>
//             </div>

//             <div className="summary-box members">
//               <h3>{totalMembers}</h3>
//               <p>Total Members</p>
//             </div>
//           </div>

//           <button className="refresh-btn" onClick={loadData}>
//             Refresh
//           </button>

//           {Object.entries(groupedData).map(([promoCode, users]) => (
//             <ReferralAccordion
//               key={promoCode}
//               promoCode={promoCode}
//               users={users}
//             />
//           ))}
//         </>
//       )}
//     </div>
//   );
// };

// export default MyReferralsPage;

// import "../css/myReferrals.css";

// const MyReferralsPage = () => {
//   return (
//     <div className="my-referrals-page">
//       <h1>Refer Friends to Use CELFON BOOK</h1>

//       <h2>Win an EV Scooter</h2>

//       <p>
//         Celfon5G+ is a Directory Services Provider for Multi Brand Cell Phone
//         Users in India. Celfon5G+ plans to cover 105 Crore Cell Phone Users in
//         India and enable Mobile Number Finding and Calling easier.
//       </p>

//       <p>
//         To motivate Cell Phone users to introduce their friends to use CELFON
//         BOOK App, Celfon5G+ has launched this referral scheme.
//       </p>

//       <h3>Highlights</h3>

//       <ul>
//         <li>
//           All users of CELFON BOOK App can invite any number of their friends
//           and relatives to download and use the App for free.
//         </li>

//         <li>
//           On proof of the invitees registering and using the CELFON BOOK App,
//           you are given a coupon.
//         </li>

//         <li>
//           For every <strong>3 successful referrals</strong>, you receive
//           <strong> 1 coupon</strong>.
//         </li>

//         <li>
//           Based on a lucky draw, one coupon will be selected and the winner
//           will receive a brand new EV Scooter.
//         </li>

//         <li>
//           The winner can choose from leading brands such as
//           <strong> TVS, Ola, E-Royce, Ampere</strong>, etc.
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default MyReferralsPage;

// import {
//   Gift,
//   Bike,
//   Users,
//   Smartphone,
//   Ticket,
//   CheckCircle2,
//   Sparkles,
// } from "lucide-react";

// import "../css/myReferrals.css";

// const MyReferralsPage = () => {
//   return (
//     <div className="referralSchemePage">
//       {/* Header */}

//       <section className="referralSchemeHero">
//         <div className="referralSchemeHero__icon">
//           <Gift size={42} />
//         </div>

//         <h1>Refer Friends to Use CELFON BOOK</h1>

//         <h2>Win a Brand New EV Scooter 🛵</h2>

//         <p>
//           Invite your friends and family to use CELFON BOOK and get a chance
//           to win exciting rewards through our lucky draw referral program.
//         </p>
//       </section>

//       {/* About */}

//       <section className="referralSchemeCard">
//         <h3>About Celfon5G+</h3>

//         <p>
//           Celfon5G+ is a Directory Services Provider for multi-brand mobile
//           phone users across India.
//         </p>

//         <p>
//           Our vision is to serve more than <strong>105 Crore mobile phone
//           users</strong> in India by making mobile number finding and calling
//           easier and faster for everyone.
//         </p>

//         <p>
//           To motivate mobile phone users to introduce their friends and family
//           to the CELFON BOOK App, Celfon5G+ has launched this exciting
//           referral scheme.
//         </p>
//       </section>

//       {/* Highlights */}

//       <section className="referralSchemeCard">
//         <div className="sectionTitle">
//           <Sparkles size={22} />
//           <h3>Program Highlights</h3>
//         </div>

//         <div className="highlightItem">
//           <CheckCircle2 size={20} />
//           <p>
//             All users of the CELFON BOOK App can invite any number of friends
//             and relatives to download and use the app for free.
//           </p>
//         </div>

//         <div className="highlightItem">
//           <Users size={20} />
//           <p>
//             Once your invitees successfully register and use the app, you
//             become eligible for referral rewards.
//           </p>
//         </div>

//         <div className="highlightItem">
//           <Ticket size={20} />
//           <p>
//             For every <strong>3 successful referrals</strong>, you receive
//             <strong> 1 lucky draw coupon.</strong>
//           </p>
//         </div>

//         <div className="highlightItem">
//           <Gift size={20} />
//           <p>
//             Every coupon is entered into the lucky draw for the grand prize.
//           </p>
//         </div>

//         <div className="highlightItem">
//           <Bike size={20} />
//           <p>
//             One lucky winner will receive a <strong>Brand New EV Scooter.</strong>
//           </p>
//         </div>
//       </section>

//       {/* Prize */}

//       <section className="grandPrizeSection">
//         <div className="grandPrizeSection__emoji">
//           🛵
//         </div>

//         <div className="grandPrizeSection__content">
//           <h3>Winner's Choice</h3>

//           <p>
//             The lucky winner can choose from leading EV brands:
//           </p>

//           <div className="brandList">
//             <span>TVS</span>
//             <span>OLA Electric</span>
//             <span>e-Royce</span>
//             <span>Ampere</span>
//             <span>and more...</span>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default MyReferralsPage;

import { Gift, Users, Ticket, User, Phone } from "lucide-react";

import useReferralController from "../controller/useReferralController";
import "../css/myReferrals.css";

const MyReferralsPage = () => {
  const {
    loading,

    coupons,

    successfulReferrals,

    pendingReferrals,

    referrals,

    progress,

    remaining,

    name,
    phone,

    setName,
    setPhone,

    submit,

    pickContact,
  } = useReferralController();

  return (
    <div className="referralPage">
      {/* ================= HERO ================= */}

      <section className="heroSection">
        <div className="heroContent">
          <div className="heroIcon">
            <Gift size={56} />
          </div>

          <h1 className="heroTitle">
            Refer Friends &
            <br />
            Win an EV Scooter
          </h1>

          <p className="heroSubtitle">
            Invite your friends to join
            <strong> CELFON BOOK</strong>. Every successful referral brings you
            closer to earning coupons and entering the lucky draw.
          </p>
        </div>

        {/* Campaign Card */}

        <div className="campaignCard">
          <div className="campaignTop">
            <div className="campaignIcon">🛵</div>

            <div>
              <span className="campaignBadge">Grand Prize</span>

              <h2>Win Brand New EV Scooter</h2>
            </div>
          </div>

          <p className="campaignText">
            Invite your friends to register using your referral and increase
            your chances of winning.
          </p>

          <div className="campaignInfo">
            <div className="campaignStep">
              <span>1</span>
              <p>Refer 3 Friends</p>
            </div>

            <div className="campaignStep">
              <span>2</span>
              <p>Earn 1 Coupon</p>
            </div>

            <div className="campaignStep">
              <span>3</span>
              <p>Lucky Draw Entry</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="statsRow">
        <div className="statCard">
          <div className="statIcon orange">
            <Ticket size={26} />
          </div>

          <div className="statValue">{coupons}</div>

          <div className="statLabel">Coupons Earned</div>
        </div>

        <div className="statCard">
          <div className="statIcon green">
            <Users size={26} />
          </div>

          <div className="statValue">{successfulReferrals}</div>

          <div className="statLabel">Successful Referrals</div>
        </div>
      </section>

      {/* ================= PROGRESS ================= */}

      <section className="progressCard">
        <h3>Next Coupon Progress</h3>

        <div className="progressBarTrack">
          <div
            className="progressBarFill"
            style={{
              width: `${progress * 100}%`,
            }}
          />
        </div>

        <p className="progressText">
          {remaining} more successful referral
          {remaining !== 1 ? "s" : ""} to earn your next coupon.
        </p>
      </section>

      {/* ================= REFERRAL FORM ================= */}

      <section className="formCard">
        <h3>Refer Your Friend</h3>

        <p className="formHint">Enter your friend's details below.</p>

        <div className="formGroup">
          <label>Friend Name</label>

          <div className="inputWrapper">
            <User size={18} className="inputIcon" />

            <input
              type="text"
              placeholder="Enter full name"
              className="formInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="formGroup">
          <label>Mobile Number</label>

          <div className="inputWrapper">
            <Phone size={18} className="inputIcon" />

            <span className="prefix">+91</span>

            <input
              type="tel"
              placeholder="9876543210"
              maxLength={10}
              className="formInput withPrefix"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                if (value.length <= 10) {
                  setPhone(value);
                }
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            className="pickContactBtn"
            onClick={pickContact}
          >
            Pick Contact
          </button>

          <button
            className="referBtn"
            disabled={loading}
            onClick={async () => {
              const error = await submit();

              if (error) {
                alert(error);
              } else {
                alert("Referral sent successfully.");
              }
            }}
          >
            {loading ? "Please Wait..." : "Refer Now"}
          </button>
        </div>
      </section>
      {/* ================= REFERRAL HISTORY ================= */}

      <section className="historySection">
        <h3>Referral History</h3>

        {referrals.length === 0 ? (
          <div className="emptyHistory">
            <h4>No Referrals Yet</h4>

            <p>
              Start referring your friends to earn coupons and increase your
              chances of winning the lucky draw.
            </p>
          </div>
        ) : (
          <div className="historyList">
            {referrals.map((item) => (
              <div className="historyCard" key={item.id}>
                <div className="avatar">
                  {item.referredName?.charAt(0)?.toUpperCase()}
                </div>

                <div className="historyInfo">
                  <div className="historyName">{item.referredName}</div>

                  <div className="historyPhone">+91 {item.referredPhone}</div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : ""}
                  </div>
                </div>

                <span
                  className={`statusChip ${item.joined ? "joined" : "pending"}`}
                >
                  {item.joined ? "Joined" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyReferralsPage;
