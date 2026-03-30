// // src/features/subscription/pages/SubscriptionPage.jsx

// import React, { useState } from "react";
// import "../../subscription/css/subscription.css";

// const plans = [
//   {
//     id: "basic",
//     name: "Basic",
//     priceMonthly: 0,
//     priceYearly: 0,
//     description: "Perfect for individuals getting started.",
//     features: [
//       "Profile listing",
//       "Limited search visibility",
//       "Basic support",
//     ],
//     popular: false,
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     priceMonthly: 499,
//     priceYearly: 4999,
//     description: "Best for growing businesses.",
//     features: [
//       "Priority search visibility",
//       "Product showcase",
//       "Unlimited enquiries",
//       "Email support",
//     ],
//     popular: true,
//   },
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     priceMonthly: 1499,
//     priceYearly: 14999,
//     description: "For established brands & large scale reach.",
//     features: [
//       "Top placement in search",
//       "Premium badge",
//       "Dedicated support",
//       "Analytics dashboard",
//     ],
//     popular: false,
//   },
// ];

// const SubscriptionPage = () => {
//   const [billing, setBilling] = useState("monthly");

//   return (
//     <div className="subscription-container">
//       <div className="subscription-header">
//         <h1>Choose Your Plan</h1>
//         <p>Select a plan that fits your growth strategy.</p>

//         <div className="billing-toggle">
//           <span className={billing === "monthly" ? "active" : ""}>
//             Monthly
//           </span>

//           <label className="switch">
//             <input
//               type="checkbox"
//               onChange={() =>
//                 setBilling(billing === "monthly" ? "yearly" : "monthly")
//               }
//             />
//             <span className="slider"></span>
//           </label>

//           <span className={billing === "yearly" ? "active" : ""}>
//             Yearly
//           </span>
//         </div>
//       </div>

//       <div className="plans-grid">
//         {plans.map((plan) => {
//           const price =
//             billing === "monthly"
//               ? plan.priceMonthly
//               : plan.priceYearly;

//           return (
//             <div
//               key={plan.id}
//               className={`plan-card ${plan.popular ? "popular" : ""}`}
//             >
//               {plan.popular && <div className="badge">Most Popular</div>}

//               <h2>{plan.name}</h2>
//               <p className="plan-description">{plan.description}</p>

//               <div className="price">
//                 ₹{price}
//                 <span>
//                   /{billing === "monthly" ? "month" : "year"}
//                 </span>
//               </div>

//               <ul className="features">
//                 {plan.features.map((feature, index) => (
//                   <li key={index}>✓ {feature}</li>
//                 ))}
//               </ul>

//               <button className="subscribe-btn">
//                 Get Started
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SubscriptionPage;


// src/features/subscription/pages/SubscriptionPage.jsx

// import React from "react";
// import "../../subscription/css/subscription.css";

// const SubscriptionPage = () => {
//   return (
//     <div className="tariff-container">
//       <div className="tariff-header">
//         <h1>PHONE BOOK - TARIFF</h1>
//         <p>Branding Ads in Search Results</p>
//         <span>Business Listing Plans</span>
//       </div>

//       <div className="tariff-table-wrapper">
//         <table className="tariff-table">
//           <thead>
//             <tr>
//               <th>Details</th>
//               <th>Free</th>
//               <th>Add On</th>
//               <th>Priority</th>
//               <th>Premium</th>
//             </tr>
//           </thead>

//           <tbody>
//             {/* Pricing */}
//             <tr className="section-title">
//               <td colSpan="5">Tariff (Per Keyword)</td>
//             </tr>

//             <tr>
//               <td>Monthly</td>
//               <td>FREE</td>
//               <td>₹200</td>
//               <td>₹500</td>
//               <td>₹750</td>
//             </tr>

//             <tr>
//               <td>Annual</td>
//               <td>FREE</td>
//               <td>₹2,400</td>
//               <td>₹6,000</td>
//               <td>₹9,000</td>
//             </tr>

//             <tr className="offer-row">
//               <td>Offer (Annual)</td>
//               <td>FREE</td>
//               <td>₹2,000</td>
//               <td>₹5,000</td>
//               <td>₹7,500</td>
//             </tr>

//             {/* Content Section */}
//             <tr className="section-title">
//               <td colSpan="5">Contents</td>
//             </tr>

//             {renderFeatureRow("Address", true, true, true, true)}
//             {renderFeatureRow("Communication", true, true, true, true)}
//             {renderFeatureRow("Enquiry", true, true, true, true)}
//             {renderFeatureRow("Highlight", false, true, true, true)}
//             {renderFeatureRow("Description", false, true, true, true)}
//             {renderFeatureRow("Location Map", false, true, true, true)}
//             {renderFeatureRow("Website Link", false, true, true, true)}
//             {renderFeatureRow("Leads", false, false, true, true)}

//             {/* Product Section */}
//             <tr className="section-title">
//               <td colSpan="5">Product Features</td>
//             </tr>

//             {renderFeatureRow("Product Photos", false, false, false, true)}
//             {renderFeatureRow("Product Description", false, false, false, true)}
//             {renderFeatureRow("Product Pricing", false, false, false, true)}
//             {renderFeatureRow("Product Enquiry", false, false, false, true)}
//           </tbody>
//         </table>
//       </div>

//       <div className="tariff-footer">
//         <p>Be Visible When Browsers Search You / Your Product</p>
//       </div>
//     </div>
//   );
// };

// const renderFeatureRow = (label, free, addOn, priority, premium) => {
//   return (
//     <tr>
//       <td>{label}</td>
//       <td>{free ? <Dot /> : "-"}</td>
//       <td>{addOn ? <Dot /> : "-"}</td>
//       <td>{priority ? <Dot /> : "-"}</td>
//       <td>{premium ? <Dot /> : "-"}</td>
//     </tr>
//   );
// };

// const Dot = () => <div className="dot" />;

// export default SubscriptionPage;


import React from "react";
import "../../subscription/css/subscription.css";

const SubscriptionPage = () => {
  return (
    <div className="tariff-container">
      <div className="tariff-header">
        <h1>PHONE BOOK - TARIFF</h1>
        <p>Branding Ads in Search Results</p>
        <span>Business Listing Plans</span>
      </div>

      <div className="tariff-table-wrapper">
        <table className="tariff-table">
          <thead>
            <tr>
              <th>Details</th>
              <th>Free</th>
              <th>Add On</th>
              <th>Priority</th>
              <th>Premium</th>
            </tr>
          </thead>

          <tbody>
            <tr className="section-title">
              <td colSpan="5">Tariff (Per Keyword)</td>
            </tr>

            <tr>
              <td>Monthly</td>
              <td>FREE</td>
              <td>₹200</td>
              <td>₹500</td>
              <td>₹750</td>
            </tr>

            <tr>
              <td>Annual</td>
              <td>FREE</td>
              <td>₹2,400</td>
              <td>₹6,000</td>
              <td>₹9,000</td>
            </tr>

            <tr className="offer-row">
              <td>Offer (Annual)</td>
              <td>FREE</td>
              <td>₹2,000</td>
              <td>₹5,000</td>
              <td>₹7,500</td>
            </tr>

            <tr className="section-title">
              <td colSpan="5">Contents</td>
            </tr>

            {renderFeatureRow("Address", true, true, true, true)}
            {renderFeatureRow("Communication", true, true, true, true)}
            {renderFeatureRow("Enquiry", true, true, true, true)}
            {renderFeatureRow("Highlight", false, true, true, true)}
            {renderFeatureRow("Description", false, true, true, true)}
            {renderFeatureRow("Location Map", false, true, true, true)}
            {renderFeatureRow("Website Link", false, true, true, true)}
            {renderFeatureRow("Leads", false, false, true, true)}

            <tr className="section-title">
              <td colSpan="5">Product Features</td>
            </tr>

            {renderFeatureRow("Product Photos", false, false, false, true)}
            {renderFeatureRow("Product Description", false, false, false, true)}
            {renderFeatureRow("Product Pricing", false, false, false, true)}
            {renderFeatureRow("Product Enquiry", false, false, false, true)}

            <tr className="subscribe-row">
              <td></td>
              <td><button className="subscribe-btn">Subscribe</button></td>
              <td><button className="subscribe-btn">Subscribe</button></td>
              <td><button className="subscribe-btn">Subscribe</button></td>
              <td><button className="subscribe-btn premium-btn">Subscribe</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ✅ NEW INFO SECTION */}
      <div className="plan-info-section">
        <div className="plan-card free-plan">
          <h3>Free Listing</h3>
          <p>
            In this Celfon book every mobile user is listed free. Full address
            and all communication details including mobile, landline, email and
            website are provided.
          </p>
          <p>
            Business and professionals can be listed free under up to 3
            categories. Free registered firms are displayed in search results
            under respective categories in <strong>black colour</strong>.
          </p>
        </div>

        <div className="plan-card business-plan">
          <h3>Business Listing (Paid)</h3>
          <p>
            Businesses looking for higher visibility can choose branding ads:
          </p>
          <ul>
            <li><strong>Premium Listing</strong> – Top 2 positions</li>
            <li><strong>Priority Listing</strong> – Top 5 positions</li>
            <li><strong>Business Listing</strong> – Top 10 positions</li>
          </ul>
          <p>
            Pricing is based on <strong>per keyword per month or year</strong>.
            Listings appear at the top in
            <strong> yellow / blue / magenta colours</strong>.
          </p>
        </div>
      </div>

      <div className="tariff-footer">
        <p>Be Visible When Browsers Search You / Your Product</p>
      </div>
    </div>
  );
};

const renderFeatureRow = (label, free, addOn, priority, premium) => (
  <tr>
    <td>{label}</td>
    <td>{free ? <Dot /> : "-"}</td>
    <td>{addOn ? <Dot /> : "-"}</td>
    <td>{priority ? <Dot /> : "-"}</td>
    <td>{premium ? <Dot /> : "-"}</td>
  </tr>
);

const Dot = () => <div className="dot" />;

export default SubscriptionPage;