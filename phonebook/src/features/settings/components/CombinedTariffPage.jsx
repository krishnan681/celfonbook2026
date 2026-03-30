import "../../settings/css/CombinedTariffPage.css";

export default function CombinedTariffPage() {
  return (
    <div className="ct-wrapper">
      
      {/* Header */}
      <div className="ct-header">
        <h1>Celfon Combined Tariff</h1>
        <p>Multi-platform advertising across Print, Digital & Mobile App</p>
      </div>

      {/* Intro */}
      <div className="ct-intro">
        <p>
          <strong>Celfon5G+ Directories</strong> are published in 3 formats. Printed Directory
          (23 Editions) has been published since 1981. Digital (eBook) edition
          is available via Play Books since 2015. The latest Online Edition,
          CELFON BOOK, is a mobile app available on Android from 2024.
        </p>
        <p>
          Save more with our combined plans and ensure your business is visible
          across all platforms when customers search for your products.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="ct-grid">
        
        {/* PLATINUM */}
        <div className="ct-card ct-platinum">
          <div className="ct-card-header">
            <h3>PLATINUM</h3>
            <span className="ct-price">₹67,500 <small>/ Year</small></span>
          </div>
          <ul className="ct-features">
            <li>Banner ad in Home Page (App)</li>
            <li>Full Page Ad (Print)</li>
            <li>Full Page Ad (Digital)</li>
          </ul>
          <button className="ct-btn">Get Platinum</button>
        </div>

        {/* DIAMOND (Featured) */}
        <div className="ct-card ct-diamond featured">
          <div className="ct-badge">Most Popular</div>
          <div className="ct-card-header">
            <h3>DIAMOND</h3>
            <span className="ct-price">₹48,000 <small>/ Year</small></span>
          </div>
          <ul className="ct-features">
            <li>Banner ad in Home Page (App)</li>
            <li>Half Page Ad (Print)</li>
            <li>Half Page Ad (Digital)</li>
          </ul>
          <button className="ct-btn">Get Diamond</button>
        </div>

        {/* GOLD */}
        <div className="ct-card ct-gold">
          <div className="ct-card-header">
            <h3>GOLD</h3>
            <span className="ct-price">₹27,500 <small>/ Year</small></span>
          </div>
          <ul className="ct-features">
            <li>Logo listing in App</li>
            <li>1/4 Page Ad (Print)</li>
            <li>1/4 Page Ad (Digital)</li>
          </ul>
          <button className="ct-btn">Get Gold</button>
        </div>

        {/* SILVER */}
        <div className="ct-card ct-silver">
          <div className="ct-card-header">
            <h3>SILVER</h3>
            <span className="ct-price">₹13,500 <small>/ Year</small></span>
          </div>
          <ul className="ct-features">
            <li>1 Premium Listing (App)</li>
            <li>Colour Panel Ad (Print)</li>
            <li>Colour Panel Ad (Digital)</li>
          </ul>
          <button className="ct-btn">Get Silver</button>
        </div>

        {/* CUSTOM */}
        <div className="ct-card ct-custom">
          <div className="ct-card-header">
            <h3>CUSTOM</h3>
            <span className="ct-price">Flexible</span>
          </div>
          <div className="ct-features ct-custom-p">
            <p>Select your own options and get special offers curated for your business needs.</p>
          </div>
          <button className="ct-btn">Contact Us</button>
        </div>

      </div>
    </div>
  );
}