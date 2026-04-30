// import { useNavigate } from "react-router-dom";
// import "../pages/css/hero.css";

// export default function HeroSection() {

//   const navigate = useNavigate();

//   const goToSearch = () => {
//     navigate("/search");
//   };

//   const goToPartner = () => {
//     navigate("/partner");
//   };

//   return (
//     <section className="hero-section">
//       <div className="hero-container">

//         <div className="hero-left">

//           <h1 className="hero-title">
//             Discover and Connect with
//             <span className="hero-highlight"> Lakhs of MSME </span>
//             Businesses Across India
//           </h1>

//           <p className="hero-subtitle">
//             Search, connect, and promote your business with India's growing MSME directory.
//           </p>

//           {/* SEARCH INPUTS */}
//           <div className="hero-search">

//             <input
//               className="hero-input"
//               placeholder="Search for Business, persons...."
//               onFocus={goToSearch}
//             />

//             <input
//               className="hero-input-city"
//               placeholder="Search for Doctors, Plumbers, Restaurants..."
//               onFocus={goToSearch}
//             />

//           </div>

//           {/* BUTTONS */}
//           <div className="hero-buttons">

//             <button
//               className="hero-primary-btn"
//               onClick={goToSearch}
//             >
//               Start Exploring
//             </button>

//             <button
//               className="hero-secondary-btn"
//               onClick={goToPartner}
//             >
//               Promote Your Business
//             </button>

//           </div>

//         </div>

//         <div className="hero-right">

//           <img
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuACIJLblip2ufDsnYWoYc07K-L6TCWkat2Ijv9_XRdMEtA3srwIWT56BSERNNr5u81K_ww-srpK8qmhS61YH45ZEFpqwbD714lktrcTwvk9scyLujTqb9IeoIfnnFjBBUzZXJetJhEOM3P1c9AZJ1ebqjVTc_3kVrhTXU4mfQc-YNMka137RAemdFLwILSp8DxqM5z6C7GkEMDPFtnnPXzFkk2DSZllFK5Z_-53n75zQVv4mmXyIW6aO3eCISwREcI6wz9U5aJJ5Gs"
//             alt="dashboard"
//           />

//         </div>

//       </div>
//     </section>
//   );
// }














// import { useNavigate } from "react-router-dom";
// import "../pages/css/hero.css";

// export default function HeroSection() {

//   const navigate = useNavigate();

//   const goToSearch = () => {
//     navigate("/search");
//   };

//   const goToPartner = () => {
//     navigate("/partner");
//   };

//   return (
//     <section className="hero-section">
//       <div className="hero-container">

//         <div className="hero-left">

//           <h1 className="hero-title">
//             Discover and Connect with
//             <span className="hero-highlight"> Lakhs of MSME </span>
//             Businesses Across India
//           </h1>

//           <p className="hero-subtitle">
//             Search, connect, and promote your business with India's growing MSME directory.
//           </p>

//           {/* PROFESSIONAL SEARCH BAR */}
//           <div className="hero-search-bar">

//             <div className="search-field">
//               <span className="search-icon">🔍</span>
//               <input
//                 type="text"
//                 placeholder="Search businesses or persons"
//                 onFocus={goToSearch}
//               />
//             </div>

//             <div className="search-divider"></div>

//             <div className="search-field">
//               <span className="search-icon">📍</span>
//               <input
//                 type="text"
//                 placeholder="City or location"
//                 onFocus={goToSearch}
//               />
//             </div>

//             <button
//               className="hero-search-button"
//               onClick={goToSearch}
//             >
//               Search
//             </button>

//           </div>

//           {/* BUTTONS */}
//           <div className="hero-buttons">

//             <button
//               className="hero-primary-btn"
//               onClick={goToSearch}
//             >
//               Start Exploring
//             </button>

//             <button
//               className="hero-secondary-btn"
//               onClick={goToPartner}
//             >
//               Promote Your Business
//             </button>

//           </div>

//         </div>

//         <div className="hero-right">

//           <img
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuACIJLblip2ufDsnYWoYc07K-L6TCWkat2Ijv9_XRdMEtA3srwIWT56BSERNNr5u81K_ww-srpK8qmhS61YH45ZEFpqwbD714lktrcTwvk9scyLujTqb9IeoIfnnFjBBUzZXJetJhEOM3P1c9AZJ1ebqjVTc_3kVrhTXU4mfQc-YNMka137RAemdFLwILSp8DxqM5z6C7GkEMDPFtnnPXzFkk2DSZllFK5Z_-53n75zQVv4mmXyIW6aO3eCISwREcI6wz9U5aJJ5Gs"
//             alt="dashboard"
//           />

//         </div>

//       </div>
//     </section>
//   );
// }



// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// // import "../pages/css/hero.css";

// const POPULAR_CATEGORIES = [
//   { icon: "🏥", label: "Hospitals" },
//   { icon: "🍽️", label: "Restaurants" },
//   { icon: "🔧", label: "Plumbers" },
//   { icon: "⚡", label: "Electricians" },
//   { icon: "🚗", label: "Car Repair" },
//   { icon: "💇", label: "Salons" },
//   { icon: "🏗️", label: "Contractors" },
//   { icon: "📦", label: "Packers" },
//   { icon: "🎓", label: "Coaching" },
//   { icon: "💊", label: "Pharmacies" },
// ];

// const TRUST_STATS = [
//   { number: "5L+", label: "Businesses Listed" },
//   { number: "28", label: "States Covered" },
//   { number: "10L+", label: "Monthly Searches" },
//   { number: "4.8★", label: "Avg. Rating" },
// ];

// export default function HeroSection() {
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");
//   const [location, setLocation] = useState("");

//   const goToSearch = (q = query, loc = location) => {
//     navigate(`/search?q=${encodeURIComponent(q)}&loc=${encodeURIComponent(loc)}`);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") goToSearch();
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Nunito:wght@400;500;600;700&display=swap');

//         :root {
//           --jd-red: #e8202a;
//           --jd-red-dark: #c0151e;
//           --jd-orange: #ff6a00;
//           --jd-yellow: #fbbf24;
//           --jd-navy: #0f1e3c;
//           --jd-navy-light: #1a2f5a;
//           --jd-white: #ffffff;
//           --jd-gray: #f3f4f6;
//           --jd-gray2: #e5e7eb;
//           --jd-text: #1f2937;
//           --jd-muted: #6b7280;
//         }

//         .hero-wrap {
//           font-family: 'Nunito', sans-serif;
//           background: linear-gradient(160deg, var(--jd-navy) 0%, var(--jd-navy-light) 55%, #1e3a6e 100%);
//           min-height: 88vh;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 40px 16px 0;
//           position: relative;
//           overflow: hidden;
//         }

//         /* Subtle grid overlay */
//         .hero-wrap::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background-image:
//             linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
//           background-size: 48px 48px;
//           pointer-events: none;
//         }

//         /* Decorative blobs */
//         .hero-blob {
//           position: absolute;
//           border-radius: 50%;
//           filter: blur(80px);
//           opacity: 0.18;
//           pointer-events: none;
//         }
//         .blob-1 {
//           width: 520px; height: 520px;
//           background: var(--jd-red);
//           top: -180px; right: -120px;
//         }
//         .blob-2 {
//           width: 360px; height: 360px;
//           background: var(--jd-orange);
//           bottom: 80px; left: -100px;
//         }

//         /* ── TOP BADGE ── */
//         .hero-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           background: rgba(255,255,255,0.08);
//           border: 1px solid rgba(255,255,255,0.15);
//           color: #fde68a;
//           font-size: 12.5px;
//           font-weight: 600;
//           letter-spacing: 0.5px;
//           padding: 6px 16px;
//           border-radius: 999px;
//           margin-bottom: 22px;
//           backdrop-filter: blur(8px);
//         }
//         .hero-badge span { color: #fff; }

//         /* ── HEADLINE ── */
//         .hero-headline {
//           font-family: 'Rajdhani', sans-serif;
//           font-size: clamp(2rem, 5.5vw, 3.4rem);
//           font-weight: 700;
//           color: #fff;
//           text-align: center;
//           line-height: 1.15;
//           margin: 0 0 10px;
//           max-width: 820px;
//           letter-spacing: -0.5px;
//         }
//         .hero-headline em {
//           font-style: normal;
//           background: linear-gradient(90deg, #ff6a00, #e8202a);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .hero-sub {
//           color: rgba(255,255,255,0.62);
//           font-size: 15px;
//           text-align: center;
//           margin-bottom: 32px;
//         }

//         /* ── SEARCH BOX ── */
//         .hero-search-card {
//           background: #fff;
//           border-radius: 14px;
//           box-shadow: 0 24px 64px rgba(0,0,0,0.35);
//           display: flex;
//           align-items: stretch;
//           width: 100%;
//           max-width: 820px;
//           overflow: hidden;
//           margin-bottom: 20px;
//         }

//         .search-field-wrap {
//           display: flex;
//           align-items: center;
//           flex: 1;
//           padding: 0 18px;
//           gap: 10px;
//           min-width: 0;
//         }
//         .search-field-wrap:first-child {
//           border-right: 1.5px solid var(--jd-gray2);
//         }
//         .search-field-icon {
//           font-size: 18px;
//           flex-shrink: 0;
//           opacity: 0.7;
//         }
//         .search-field-inner {
//           display: flex;
//           flex-direction: column;
//           flex: 1;
//           min-width: 0;
//           padding: 14px 0;
//         }
//         .search-field-label {
//           font-size: 10px;
//           font-weight: 700;
//           color: var(--jd-red);
//           letter-spacing: 0.8px;
//           text-transform: uppercase;
//           margin-bottom: 2px;
//         }
//         .search-field-input {
//           border: none;
//           outline: none;
//           font-family: 'Nunito', sans-serif;
//           font-size: 15px;
//           font-weight: 600;
//           color: var(--jd-text);
//           background: transparent;
//           width: 100%;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }
//         .search-field-input::placeholder {
//           color: #9ca3af;
//           font-weight: 500;
//         }

//         .hero-search-btn {
//           background: linear-gradient(135deg, var(--jd-red), var(--jd-red-dark));
//           color: #fff;
//           border: none;
//           padding: 0 36px;
//           font-family: 'Rajdhani', sans-serif;
//           font-size: 18px;
//           font-weight: 700;
//           letter-spacing: 0.5px;
//           cursor: pointer;
//           transition: background 0.2s, transform 0.1s;
//           white-space: nowrap;
//           flex-shrink: 0;
//         }
//         .hero-search-btn:hover {
//           background: linear-gradient(135deg, #c0151e, #a0111a);
//         }
//         .hero-search-btn:active { transform: scale(0.98); }

//         /* ── QUICK LINKS ── */
//         .hero-quick-links {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           flex-wrap: wrap;
//           justify-content: center;
//           margin-bottom: 38px;
//           max-width: 820px;
//         }
//         .quick-label {
//           color: rgba(255,255,255,0.45);
//           font-size: 12px;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           margin-right: 4px;
//         }
//         .quick-chip {
//           background: rgba(255,255,255,0.09);
//           border: 1px solid rgba(255,255,255,0.14);
//           color: rgba(255,255,255,0.82);
//           font-size: 12.5px;
//           font-weight: 600;
//           padding: 5px 13px;
//           border-radius: 999px;
//           cursor: pointer;
//           transition: background 0.2s, color 0.2s;
//           white-space: nowrap;
//         }
//         .quick-chip:hover {
//           background: rgba(255,255,255,0.18);
//           color: #fff;
//         }

//         /* ── CATEGORIES STRIP ── */
//         .categories-strip {
//           width: 100%;
//           background: rgba(255,255,255,0.04);
//           border-top: 1px solid rgba(255,255,255,0.08);
//           border-bottom: 1px solid rgba(255,255,255,0.08);
//           padding: 0;
//           margin-top: auto;
//         }
//         .categories-inner {
//           max-width: 1100px;
//           margin: 0 auto;
//           display: grid;
//           grid-template-columns: repeat(10, 1fr);
//           gap: 0;
//         }
//         .cat-item {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           padding: 18px 10px;
//           cursor: pointer;
//           border-right: 1px solid rgba(255,255,255,0.07);
//           transition: background 0.2s;
//         }
//         .cat-item:last-child { border-right: none; }
//         .cat-item:hover {
//           background: rgba(255,255,255,0.07);
//         }
//         .cat-emoji {
//           font-size: 26px;
//           line-height: 1;
//         }
//         .cat-label {
//           font-size: 11px;
//           font-weight: 700;
//           color: rgba(255,255,255,0.7);
//           letter-spacing: 0.3px;
//           text-align: center;
//           white-space: nowrap;
//         }
//         .cat-item:hover .cat-label { color: #fff; }

//         /* ── TRUST BAR ── */
//         .trust-bar {
//           background: var(--jd-red);
//           width: 100%;
//           padding: 14px 16px;
//         }
//         .trust-bar-inner {
//           max-width: 900px;
//           margin: 0 auto;
//           display: flex;
//           justify-content: space-around;
//           align-items: center;
//           gap: 16px;
//           flex-wrap: wrap;
//         }
//         .trust-stat {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 2px;
//         }
//         .trust-number {
//           font-family: 'Rajdhani', sans-serif;
//           font-size: 22px;
//           font-weight: 700;
//           color: #fff;
//           line-height: 1;
//         }
//         .trust-label {
//           font-size: 11px;
//           font-weight: 600;
//           color: rgba(255,255,255,0.8);
//           letter-spacing: 0.3px;
//           text-transform: uppercase;
//         }
//         .trust-divider {
//           width: 1px;
//           height: 32px;
//           background: rgba(255,255,255,0.3);
//         }

//         /* ── SECONDARY BUTTONS ── */
//         .hero-actions {
//           display: flex;
//           gap: 12px;
//           margin-bottom: 32px;
//           flex-wrap: wrap;
//           justify-content: center;
//         }
//         .action-btn-primary {
//           background: var(--jd-red);
//           color: #fff;
//           border: none;
//           padding: 12px 28px;
//           border-radius: 8px;
//           font-family: 'Nunito', sans-serif;
//           font-size: 14px;
//           font-weight: 700;
//           cursor: pointer;
//           transition: background 0.2s, transform 0.1s;
//           letter-spacing: 0.3px;
//         }
//         .action-btn-primary:hover { background: var(--jd-red-dark); }
//         .action-btn-primary:active { transform: scale(0.97); }

//         .action-btn-secondary {
//           background: transparent;
//           color: #fff;
//           border: 1.5px solid rgba(255,255,255,0.35);
//           padding: 12px 28px;
//           border-radius: 8px;
//           font-family: 'Nunito', sans-serif;
//           font-size: 14px;
//           font-weight: 700;
//           cursor: pointer;
//           transition: border-color 0.2s, background 0.2s;
//           letter-spacing: 0.3px;
//         }
//         .action-btn-secondary:hover {
//           border-color: rgba(255,255,255,0.7);
//           background: rgba(255,255,255,0.07);
//         }

//         /* ── RESPONSIVE ── */
//         @media (max-width: 768px) {
//           .hero-search-card {
//             flex-direction: column;
//             border-radius: 12px;
//           }
//           .search-field-wrap:first-child {
//             border-right: none;
//             border-bottom: 1.5px solid var(--jd-gray2);
//           }
//           .hero-search-btn {
//             padding: 16px;
//             font-size: 16px;
//             border-radius: 0 0 12px 12px;
//           }
//           .categories-inner {
//             grid-template-columns: repeat(5, 1fr);
//           }
//           .cat-item:nth-child(5) { border-right: none; }
//           .trust-divider { display: none; }
//         }

//         @media (max-width: 480px) {
//           .categories-inner {
//             grid-template-columns: repeat(4, 1fr);
//           }
//         }
//       `}</style>

//       <section className="hero-wrap">
//         <div className="hero-blob blob-1" />
//         <div className="hero-blob blob-2" />

//         {/* Badge */}
//         <div className="hero-badge">
//           🇮🇳 <span>India's #1 MSME Directory</span> — Trusted by lakhs of businesses
//         </div>

//         {/* Headline */}
//         <h1 className="hero-headline">
//           Find the Right Business,<br />
//           <em>Right Here, Right Now</em>
//         </h1>
//         <p className="hero-sub">
//           Search from lakhs of verified MSME businesses across every city in India
//         </p>

//         {/* Search Card */}
//         <div className="hero-search-card">
//           <div className="search-field-wrap">
//             <span className="search-field-icon">🔍</span>
//             <div className="search-field-inner">
//               <span className="search-field-label">What</span>
//               <input
//                 className="search-field-input"
//                 type="text"
//                 placeholder="Business name, category, or service"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 autoComplete="off"
//               />
//             </div>
//           </div>

//           <div className="search-field-wrap">
//             <span className="search-field-icon">📍</span>
//             <div className="search-field-inner">
//               <span className="search-field-label">Where</span>
//               <input
//                 className="search-field-input"
//                 type="text"
//                 placeholder="City, area, or pincode"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 autoComplete="off"
//               />
//             </div>
//           </div>

//           <button className="hero-search-btn" onClick={() => goToSearch()}>
//             🔎 Search
//           </button>
//         </div>

//         {/* Quick search chips */}
//         <div className="hero-quick-links">
//           <span className="quick-label">Popular:</span>
//           {["Restaurants", "Hospitals", "Plumbers", "Electricians", "CA Near Me", "Packers & Movers"].map((tag) => (
//             <span key={tag} className="quick-chip" onClick={() => goToSearch(tag, location)}>
//               {tag}
//             </span>
//           ))}
//         </div>

//         {/* CTA Buttons */}
//         <div className="hero-actions">
//           <button className="action-btn-primary" onClick={() => navigate("/search")}>
//             🗺️ Browse All Businesses
//           </button>
//           <button className="action-btn-secondary" onClick={() => navigate("/partner")}>
//             📢 Promote Your Business — Free
//           </button>
//         </div>

//         {/* Popular Categories Strip */}
//         {/* <div className="categories-strip">
//           <div className="categories-inner">
//             {POPULAR_CATEGORIES.map((cat) => (
//               <div
//                 key={cat.label}
//                 className="cat-item"
//                 onClick={() => goToSearch(cat.label, location)}
//               >
//                 <span className="cat-emoji">{cat.icon}</span>
//                 <span className="cat-label">{cat.label}</span>
//               </div>
//             ))}
//           </div>
//         </div> */}

//         {/* Trust Bar */}
//         {/* <div className="trust-bar">
//           <div className="trust-bar-inner">
//             {TRUST_STATS.map((stat, i) => (
//               <>
//                 <div key={stat.label} className="trust-stat">
//                   <span className="trust-number">{stat.number}</span>
//                   <span className="trust-label">{stat.label}</span>
//                 </div>
//                 {i < TRUST_STATS.length - 1 && <div key={`div-${i}`} className="trust-divider" />}
//               </>
//             ))}
//           </div>
//         </div> */}
//       </section>
//     </>
//   );
// }
















import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../pages/css/hero.css";

const CATEGORIES = [
  { icon: "🍽️", label: "Restaurants" },
  { icon: "🏨", label: "Hotels" },
  { icon: "💇", label: "Beauty Spa" },
  { icon: "🛋️", label: "Home Decor" },
  { icon: "💒", label: "Wedding Planning" },
  { icon: "🎓", label: "Education" },
  { icon: "🚗", label: "Rent & Hire" },
  { icon: "🏥", label: "Hospitals" },
  { icon: "🏗️", label: "Contractors" },
  { icon: "🐾", label: "Pet Shops" },
  { icon: "🛏️", label: "PG / Hostels" },
  { icon: "🏢", label: "Estate Agent" },
  { icon: "🦷", label: "Dentists" },
  { icon: "🏋️", label: "Gym" },
  { icon: "💰", label: "Loans" },
  { icon: "🎉", label: "Event Organisers" },
  { icon: "🚘", label: "Driving Schools" },
  { icon: "📦", label: "Packers & Movers" },
  { icon: "⚡", label: "Electricians" },
  { icon: "🔧", label: "Plumbers" },
];

const SERVICE_CARDS = [
  { bg: "#1a3a8f", label: "B2B", sub: "Quick Quotes", emoji: "🤝" },
  { bg: "#7c1fa0", label: "Repairs &\nServices", sub: "Get Nearest Vendor", emoji: "🔧" },
  { bg: "#1244a0", label: "Real Estate", sub: "Finest Agents", emoji: "🏢" },
  { bg: "#0f7a45", label: "Doctors", sub: "Book Now", emoji: "👨‍⚕️" },
];

const BANNERS = [
  {
    bg: "linear-gradient(120deg,#0f2176 55%,#1a3a8f 100%)",
    title: "Discover Lakhs of",
    highlight: "MSME Businesses!",
    sub: "Search across India's largest MSME directory",
    cta: "Explore Now",
  },
  {
    bg: "linear-gradient(120deg,#6b1a9a 55%,#9c3dd4 100%)",
    title: "Grow Your Business",
    highlight: "List for FREE!",
    sub: "Reach crores of buyers in minutes",
    cta: "Get Started",
  },
  {
    bg: "linear-gradient(120deg,#0a5e3a 55%,#0f8c57 100%)",
    title: "Find Verified",
    highlight: "Suppliers & Vendors",
    sub: "India's B2B marketplace for MSMEs",
    cta: "Browse Now",
  },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveBanner((p) => (p + 1) % BANNERS.length), 3800);
    return () => clearInterval(t);
  }, []);

const goToSearch = (q = query, loc = location) => {
  const cleanQ = q.replace(/\n/g, " ").trim();

  navigate(`/search?q=${encodeURIComponent(cleanQ)}&loc=${encodeURIComponent(loc.trim())}`);
};

  const handleKey = (e) => { if (e.key === "Enter") goToSearch(); };
  const banner = BANNERS[activeBanner];

  return (
    <>

      <div className="jd-outer">

        {/* SEARCH */}
        <div className="jd-search-area">
          <p className="jd-search-headline">
            Find Anyone Anywhere
          </p>
          <div className="jd-search-bar">
            <div className="jd-loc-wrap">
              <span className="jd-loc-pin">📍</span>
              <input
                className="jd-loc-inp"
                type="text"
                placeholder="City / Area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
            <div className="jd-query-wrap">
              <input
                className="jd-query-inp"
                type="text"
                placeholder="Search for Businesses, Services..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
            <button className="jd-search-go" onClick={() => goToSearch()}>
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </button>
          </div>
        </div>

        {/* BANNER + CARDS */}
        <div className="jd-content-row">
          {/* Animated banner */}
          <div className="jd-hero-banner" onClick={() => navigate("/search")}>
            <div className="jd-banner-bg" style={{ background: banner.bg }} />
            <div className="jd-banner-body">
              <div className="jd-b-title">{banner.title}</div>
              <div className="jd-b-highlight">{banner.highlight}</div>
              <div className="jd-b-sub">{banner.sub}</div>
              <button className="jd-b-cta" onClick={(e) => { e.stopPropagation(); navigate("/search"); }}>
                {banner.cta}
              </button>
            </div>
            <div className="jd-banner-dots">
              {BANNERS.map((_, i) => (
                <div
                  key={i}
                  className={`jd-bdot${i === activeBanner ? " on" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setActiveBanner(i); }}
                />
              ))}
            </div>
          </div>

          {/* Service cards 2×2 */}
          <div className="jd-scards-grid">
            {SERVICE_CARDS.map((c) => (
              <div
                key={c.label}
                className="jd-scard"
                style={{ background: c.bg }}
                onClick={() => goToSearch(c.label.replace("\n", " "), location)}
              >
                <div>
                  <div className="jd-scard-label">{c.label}</div>
                  <div className="jd-scard-sub">{c.sub}</div>
                </div>
                <div className="jd-scard-arr">›</div>
                <div className="jd-scard-emoji">{c.emoji}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="jd-cats">
          <div className="jd-cats-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="jd-citem"
                onClick={() => goToSearch(cat.label, location)}
              >
                <span className="jd-citem-icon">{cat.icon}</span>
                <span className="jd-citem-label">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LIST YOUR BIZ */}
        <div className="jd-listbiz">
          <div className="jd-listbiz-text">
            <h3>Connect with <span>18 Lakh+ Buyers</span></h3>
            <p>Grow your business in 3 easy steps</p>
          </div>
          <button className="jd-listbiz-btn" onClick={() => navigate("/partner")}>
            List your Business for FREE
          </button>
        </div>

      </div>
    </>
  );
}