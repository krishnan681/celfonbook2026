import { useEffect, useState } from "react";
import "../common/css/product.css";



/* ---------------- MARKETING APP DATA ---------------- */

const marketingApp = {
  title: "Marketing To App",
  description:
    "The Celfon Book App is a dual-purpose tool designed to function as both a comprehensive mobile directory for India and a Digital Marketing Assistant for MSMEs. It features a vast Data Bank of mobile users across major service providers (BSNL, Airtel, Jio, etc.), providing 5G communication details including addresses, phone numbers, emails, and websites. Business owners can execute targeted promotions by filtering prospects by gender, business type, or specific keywords/categories for B2B outreach. The app also supports hyper-local marketing within a 1–3 km radius and allows users to organize contacts into custom groups like Buyers or Sellers for multilingual messaging.",
  playstoreLink: "https://play.google.com/store/apps/details?id=com.celfonphonebookapp&pcampaignid=web_share",
  screenshots: [
    "https://play-lh.googleusercontent.com/BQw1cQN7vGWhR8ubAIYbptk-8kfYujXeJpmLkRTCQNCjTsaBm8mdkw8ZjGstWc2bS3eaSydGyWdX_QC-ShJHig=w5120-h2880-rw",
    "https://play-lh.googleusercontent.com/I4m0zHsYpPOHl66bGos_mTA017Waa7AbjuObG0_-JVPzRv-mojOQXBFADe8_UqiuxQjNyfkR1NnSHkiaVKY_KNs=w5120-h2880-rw",
    "https://play-lh.googleusercontent.com/oWjj_nFySgmAjPRedlqqWzhki4JfsIui8DhH_fK8aOXqVXjcfkHgjppKZD34qH9eZ29XcOt-scK1XqHpTbzvCA=w5120-h2880-rw"
  ]
};

/* ---------------- PLAYBOOK DATA ---------------- */

const playbooks = [
  {
    id: 1,
    title: "COIMBATORE 2025-26 Industrial Directory: Digital Edition",
    description:
      "Coimbatore is one of the large Industrial Cities in India. Signpost Celfon.in Technology, is publishing Industrial Directories for Coimbatore, from 1981. Since then, along with Technology. we have grown. In addition to Printed Directory, Now it is available as Digital (EBook) Edition, Web Portal, Mobile App Editions etc.22nd Edition of the Printed Directory is released for 2025-26, Containing only Premium Listings of Advertisers, Business Listings etc . This Digital Edition is a replicate of the Print Edition for 2025-26. Our Web Portal and Mobile App Editions contain numerous FREE Listings of MSME Industries and Suppliers, in addition to Premium Listings.",
    image: "https://play.google.com/books/publisher/content/images/frontcover/sCE6EQAAQBAJ?fife=w480-h690",
    link: "https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_COIMBATORE_2025_26_Indust?id=sCE6EQAAQBAJ"
  },
  {
    id: 2,
    title: "COIMBATORE - 2024 Industrial Directory (21st Edition): by SIGNPOST CELFON",
    description:
      "The COIMBATORE - 2024 Industrial Directory was officially released in June 2024 at the INTEC Trade Fair, featuring over 10,000 MSMEs organized into 1,800 specialized categories. The data is structured into Alphabetical White Pages and Classified Pink Pages, available across print, digital, and searchable engine formats.This digital edition mirrors the printed version, providing full access to business listings and advertisements via the celfon5g.in and hellomobiles.directory portals. Furthermore, the information integrates with the PA DMA mobile app, enabling users to conduct targeted digital marketing campaigns directly to the listed addresses.",
    image: "https://play.google.com/books/publisher/content/images/frontcover/kwgSEQAAQBAJ?fife=w480-h690",
     link: "https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_COIMBATORE_2024_Industria?id=kwgSEQAAQBAJ"
  },
  {
    id: 3,
    title: "COIMBATORE NORTH Industrial Directory: Mobile - Phone Directory",
    description:
      "The Coimbatore North Industrial Directory (part of the CELFON5G+ series) serves as a comprehensive resource for the long-standing industrial hub of Ganapathy and its surrounding northern neighborhoods. Originally launched digitally in 2018, the directory now includes a printed edition and a searchable mobile app covering MSMEs and professionals across areas like Saravanampatti and Avarampalayam.Each listing provides five key contact points: fixed and mobile numbers, postal addresses, emails, and websites.While the digital edition is updated monthly to ensure accuracy, a revised printed version is also slated for periodic release.",
    image: "https://play.google.com/books/publisher/content/images/frontcover/nCpLDwAAQBAJ?fife=w480-h690",
     link: "https://play.google.com/store/books/details/Lion_Dr_Er_J_Shivakumaar_Chief_Editor_COIMBATORE_N?id=nCpLDwAAQBAJ"
  },

];

const Products = () => {
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  /* -------- Screenshot animation -------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreenshot((prev) =>
        prev === marketingApp.screenshots.length - 1 ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="products-section">

      <h2 className="products-title">Our Products</h2>

      {/* ---------------- APP SECTION ---------------- */}

      <div className="app-section">

        <div className="app-image">

          <div className="phone-mockup">

            <img
              src={marketingApp.screenshots[activeScreenshot]}
              alt="App screenshot"
              className="phone-screen"
            />

          </div>

        </div>

        <div className="app-text">

          <span className="app-badge">Mobile App</span>

          <h3>{marketingApp.title}</h3>

          <p>{marketingApp.description}</p>

          <a
            href={marketingApp.playstoreLink}
            target="_blank"
            rel="noreferrer"
            className="playstore-btn"
          >
            View on Play Store
          </a>

        </div>

      </div>

      {/* ---------------- PLAYBOOK SECTIONS ---------------- */}

      {playbooks.map((item) => (

        <div key={item.id} className="product-row">

          <div className="product-image">
            <img src={item.image} alt={item.title} />
          </div>

          <div className="product-text">

            <h3>{item.title}</h3>

            <p>{item.description}</p>

            <button
              className="product-btn"
              onClick={() => window.open(item.link, "_blank")}
            >
              Learn More
            </button>

          </div>

        </div>

      ))}

    </section>
  );
};

export default Products;