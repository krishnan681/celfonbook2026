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

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <MarketingSection />
      <HowItWorks />
      {/* <PricingSection /> */}
      <AboutSection />
    </main>
  );
}