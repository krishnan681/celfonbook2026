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














import { useNavigate } from "react-router-dom";
import "../pages/css/hero.css";

export default function HeroSection() {

  const navigate = useNavigate();

  const goToSearch = () => {
    navigate("/search");
  };

  const goToPartner = () => {
    navigate("/partner");
  };

  return (
    <section className="hero-section">
      <div className="hero-container">

        <div className="hero-left">

          <h1 className="hero-title">
            Discover and Connect with
            <span className="hero-highlight"> Lakhs of MSME </span>
            Businesses Across India
          </h1>

          <p className="hero-subtitle">
            Search, connect, and promote your business with India's growing MSME directory.
          </p>

          {/* PROFESSIONAL SEARCH BAR */}
          <div className="hero-search-bar">

            <div className="search-field">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search businesses or persons"
                onFocus={goToSearch}
              />
            </div>

            <div className="search-divider"></div>

            <div className="search-field">
              <span className="search-icon">📍</span>
              <input
                type="text"
                placeholder="City or location"
                onFocus={goToSearch}
              />
            </div>

            <button
              className="hero-search-button"
              onClick={goToSearch}
            >
              Search
            </button>

          </div>

          {/* BUTTONS */}
          <div className="hero-buttons">

            <button
              className="hero-primary-btn"
              onClick={goToSearch}
            >
              Start Exploring
            </button>

            <button
              className="hero-secondary-btn"
              onClick={goToPartner}
            >
              Promote Your Business
            </button>

          </div>

        </div>

        <div className="hero-right">

          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuACIJLblip2ufDsnYWoYc07K-L6TCWkat2Ijv9_XRdMEtA3srwIWT56BSERNNr5u81K_ww-srpK8qmhS61YH45ZEFpqwbD714lktrcTwvk9scyLujTqb9IeoIfnnFjBBUzZXJetJhEOM3P1c9AZJ1ebqjVTc_3kVrhTXU4mfQc-YNMka137RAemdFLwILSp8DxqM5z6C7GkEMDPFtnnPXzFkk2DSZllFK5Z_-53n75zQVv4mmXyIW6aO3eCISwREcI6wz9U5aJJ5Gs"
            alt="dashboard"
          />

        </div>

      </div>
    </section>
  );
}