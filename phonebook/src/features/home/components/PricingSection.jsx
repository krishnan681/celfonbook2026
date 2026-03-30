import "../pages/css/pricing.css";

export default function PricingSection() {
  return (
    <section className="pricing-section">

      <div className="pricing-container">

        <h2 className="pricing-title">
          Affordable Growth Plans
        </h2>

        <div className="pricing-grid">

          <div className="pricing-card">

            <h3>Tiny & Micro</h3>

            <p className="price">₹2,500</p>

            <span>/year</span>

            <ul>
              <li>Basic Directory Listing</li>
              <li>Search Result Visibility</li>
              <li>Mobile Optimization</li>
            </ul>

            <button>Subscribe Now</button>

          </div>

          <div className="pricing-card featured">

            <h3>Small Business</h3>

            <p className="price">₹4,500</p>

            <span>/year</span>

            <ul>
              <li>Featured Listing</li>
              <li>Marketing Tools</li>
              <li>Analytics Dashboard</li>
              <li>Priority Support</li>
            </ul>

            <button>Subscribe Now</button>

          </div>

        </div>

      </div>

    </section>
  );
}