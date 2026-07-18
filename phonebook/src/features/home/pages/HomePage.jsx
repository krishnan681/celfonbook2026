// import { useNavigate } from "react-router-dom";
// import "../pages/css/home.css";

// const HomePage = () => {
//   const navigate = useNavigate();

//   const goToSearch = () => {
//     navigate("/search");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       navigate("/search");
//     }
//   };

//   return (
//     <div className="hero">
//       <div className="hero-content">
//         <span className="hero-badge">
//           Coimbatore's Largest Local Business Directory
//         </span>

//         <h1 className="hero-title">
//           Connect with over <span>10 Lakh+</span> verified <br />
//           MSMEs across India
//         </h1>

//         <p className="hero-subtitle">
//           Discover reliable services, from local clinics to wholesale suppliers,
//           updated daily for your convenience.
//         </p>

//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search for Business, persons...."
//             onFocus={goToSearch}
//             onKeyDown={handleKeyDown}
//             readOnly
//           />

//           <input
//             type="text"
//             placeholder="Search for Doctors, Plumbers, Restaurants..."
//             className="location-input"
//             onFocus={goToSearch}
//             onKeyDown={handleKeyDown}
//             readOnly
//           />

//           <button onClick={goToSearch}>
//             Search Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import FeaturesSection from "../components/FeaturesSection";
import MarketingSection from "../components/MarketingSection";
import HowItWorks from "../components/HowItWorks";
import PricingSection from "../components/PricingSection";
import AboutSection from "../components/AboutSection";
import DirectorySection from "../components/DirectorySection";
import seoConfig from "../../../core/seo/seoConfig";
import { Helmet } from "react-helmet-async";
import ReferralPopup from "../components/ReferralPopup";

export default function HomePage() {
  const seo = seoConfig.home;

  return (
    <main>

    <ReferralPopup />
      <Helmet>
        <title>{seo.title}</title>

        <meta name="description" content={seo.description} />

        <link rel="canonical" href={seo.canonical} />

        <meta property="og:title" content={seo.title} />

        <meta property="og:description" content={seo.description} />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={seo.canonical} />

      </Helmet>
      <HeroSection />
      <DirectorySection />
      <StatsSection />
      <FeaturesSection />
      <MarketingSection />
      <HowItWorks />
      {/* <PricingSection /> */}
      <AboutSection />
    </main>
  );
}
