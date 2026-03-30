import "../pages/css/features.css";

export default function FeaturesSection() {
  const features = [
    {
      title: "MSME Database",
      description: "Access a verified, massive database of manufacturers, traders, and service providers.",
      icon: "database",
      color: "#0052CC" // Blue
    },
    {
      title: "Bulk SMS Marketing",
      description: "Reach customers instantly with high-deliverability SMS campaigns. Personalize messages and track opens.",
      icon: "sms", // Updated icon
      color: "#6C5CE7" // Purple
    },
    {
      title: "10,000+ Categories",
      description: "Deep classification ensuring every business finds its perfect ecosystem spot.",
      icon: "category", // Updated icon
      color: "#00B894" // Teal/Green
    },
    {
      title: "WhatsApp Business",
      description: "Leverage WhatsApp's massive user base with approved templates and rich media support.",
      icon: "chat", // Added icon
      color: "#25D366" // WhatsApp Green
    },
    {
      title: "Daily Updates",
      description: "New businesses are verified and listed daily to keep the directory fresh.",
      icon: "published_with_changes", // Updated icon
      color: "#FF7675" // Soft Red
    },
    {
      title: "B2B & B2C",
      description: "Bridge connecting enterprises with other businesses and consumers.",
      icon: "handshake",
      color: "#F0932B" // Orange
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-title">Core Platform Features</h2>
        <p className="features-subtitle">
          Powerful tools designed to help businesses discover, connect, and grow.
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div 
                className="feature-icon" 
                style={{ backgroundColor: feature.color }}
              >
                <span className="material-symbols-outlined">
                  {feature.icon}
                </span>
              </div>
              <h3 className="features-title-for-card" >{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}