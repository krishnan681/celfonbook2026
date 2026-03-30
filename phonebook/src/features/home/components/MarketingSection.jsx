import "../pages/css/marketing.css";

export default function MarketingSection() {

  const tools = [
    {
      title: "Bulk SMS & WhatsApp",
      description:
        "Send personalized messages, offers, and updates directly to customers’ phones instantly.",
      icon: "sms"
    },
    {
      title: "Email Marketing",
      description:
        "Run professional email campaigns to promote offers and stay connected with subscribers.",
      icon: "mail"
    },
    {
      title: "Nearby Marketing",
      description:
        "Reach customers within a specific radius and drive more visits to your store.",
      icon: "location_on"
    }
  ];

  return (
    <section className="marketing-section">

      <div className="marketing-container">

        {/* LEFT CONTENT */}
        <div className="marketing-left">

          <span className="marketing-badge">
            Growth Tools
          </span>

          <h2>
            Powerful Marketing Tools
            <span className="marketing-highlight">
              {" "}to Grow Your Business
            </span>
          </h2>

          <p className="marketing-description">
            Reach new customers, engage your audience, and promote your
            services using our built-in marketing solutions designed
            specifically for MSMEs.
          </p>

          <div className="marketing-tools">

            {tools.map((tool, index) => (

              <div key={index} className="marketing-item">

                <div className="marketing-icon">
                  <span className="material-symbols-outlined">
                    {tool.icon}
                  </span>
                </div>

                <div className="marketing-text">

                  <h4>{tool.title}</h4>

                  <p>{tool.description}</p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="marketing-right">

          <div className="marketing-image-card">

            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0GHx_2yAv8uGRGYZMKKh14aQ3x637m5OC3O6SLhCty8ATBS2ndKMHL8H84pplX-t9eF44vkExRcv9EWLa1RsbZ9AzpEZDitQYod_4rsIk-5FYtERcEmOdEu1Hoco0OWI3hM0xYnLjo1TaQWaANB6F8VIw67uQO7oymTKRK1lWZREQOilP49Oxz8m1tDjsgGpZSu-yD4Gebc7-Uyzua537g91HhJiyFDFp9_aQxYuEloRvs7MGgxb_JuKO4etZSESlE2KfKpsrCb8"
              alt="marketing dashboard"
            />

          </div>

        </div>

      </div>

    </section>
  );
}