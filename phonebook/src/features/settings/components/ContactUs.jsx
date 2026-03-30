import "../css/ContactUs.css";   

export default function ContactUs() {
  return (
    <div className="cu2-wrapper">

      {/* HERO */}
      <header className="cu2-hero">
        <div className="cu2-float cu2-f1"></div>
        <div className="cu2-float cu2-f2"></div>
        <div className="cu2-float cu2-f3"></div>

        <div className="cu2-hero-content">
          <h1>Contact</h1>
          <p>Let's start something great together. Get in touch with our team today!</p>
        </div>

        <div className="cu2-wave">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#ffffff"
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,202.7C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z"
            />
          </svg>
        </div>
      </header>

      {/* MAIN */}
      <main className="cu2-body">
        <div className="cu2-grid">

          {/* LEFT */}
          <section className="cu2-details">

            <h2>Get in touch</h2>

            <div className="cu2-block">
              <h4>Mobile</h4>
              <p>+91 98436 57564</p>
              <span>Mon - Sat, 9 AM - 6 PM</span>
            </div>

            <div className="cu2-block">
              <h4>Directory Enquiry</h4>
              <p>+91 97868 89092</p>
            </div>

            <div className="cu2-block">
              <h4>Email</h4>
              <a href="mailto:signpostphonebook@gmail.com">
                signpostphonebook@gmail.com
              </a>
            </div>

            <div className="cu2-block">
              <h4>Head Office</h4>
              <p>
                Signpost Towers, First Floor, 46, SIDCO Industrial Estate,
                Pollachi Road, Coimbatore - 641021
              </p>
            </div>

            <div className="cu2-block">
              <h4>Branch Office</h4>
              <p>Kalyan Nagar, HRBR Layout, Bangalore - 560043</p>
            </div>

          </section>

          {/* RIGHT MAP */}
          <section className="cu2-map">
            <div className="cu2-map-frame">
              <iframe
                title="map"
                // src="https://www.google.com/maps?q=Coimbatore&output=embed"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.638254393821!2d76.97320587482055!3d10.943736589215371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85a46400df8c3%3A0xf2a431dc0061707!2sSignpost%20Celfon.In%20Technology!5e1!3m2!1sen!2sin!4v1774247795682!5m2!1sen!2sin"
              ></iframe>
            </div>

            <div className="cu2-map-card">
              <h5>Visit our HQ</h5>
              <p>Coimbatore</p>
              <button>Get Directions</button>
            </div>
          </section>

        </div>
      </main>

     {/* DOWNLOAD APP (UPGRADED) */}
<section className="cu3-app">
  <div className="cu3-container">

    {/* LEFT CONTENT */}
    <div className="cu3-left">
      <p className="cu3-subtitle">
        Manage your business on the go!
      </p>

      <h2 className="cu3-title">
        Download The CELFON Book App
      </h2>

      

      <p className="cu3-free">Get your free App now!</p>

      <div className="cu3-store">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
          alt="Google Play"
        />
        <img
          src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
          alt="App Store"
        />
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="cu3-right">
      <img
        src="https://play-lh.googleusercontent.com/BQw1cQN7vGWhR8ubAIYbptk-8kfYujXeJpmLkRTCQNCjTsaBm8mdkw8ZjGstWc2bS3eaSydGyWdX_QC-ShJHig=w5120-h2880-rw"  
        alt="App Preview"
      />
    </div>

  </div>
</section>

    </div>
  );
}








 