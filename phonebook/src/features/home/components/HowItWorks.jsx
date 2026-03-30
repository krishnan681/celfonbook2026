import "../pages/css/howitworks.css";

export default function HowItWorks() {

  const steps = [
    {
      number: "01",
      title: "Search",
      description:
        "Identify the exact business category, product, or service you are looking for."
    },
    {
      number: "02",
      title: "Find",
      description:
        "Browse through thousands of verified listings using smart filters and location targeting."
    },
    {
      number: "03",
      title: "Connect",
      description:
        "Contact businesses instantly via call, enquiry forms, or marketing tools."
    }
  ];

  return (
    <section className="how-section">

      <div className="how-container">

        <h2 className="how-title">How It Works</h2>

        <p className="how-subtitle">
          Discover businesses and connect with them in just three simple steps.
        </p>

        <div className="how-steps">

          {steps.map((step, index) => (

            <div className="how-card" key={index}>

              <div className="how-number">
                {step.number}
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}