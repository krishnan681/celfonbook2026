import "../css/T&C.css";

export default function TermsPage() {
  return (
    <div className="lg3-wrapper">

      <div className="lg3-container">

        <h1 className="lg3-title">Terms & Conditions</h1>

        {/* INTRO */}
        <section className="lg3-section">
  <p>
    These terms and conditions outline the rules and regulations for the use of 
    Signpost Celfon.in Technology's Website, located at{" "}
    <a href="https://signpostphonebook.in/" target="_blank" rel="noopener noreferrer">
      signpostphonebook.in
    </a>.
  </p>
  <p>
    By accessing this website, you agree to comply with these terms. 
    If you do not agree, please discontinue usage immediately.
  </p>
</section>

        {/* DEFINITIONS */}
        <section className="lg3-section">
          <h3>Definitions</h3>
          <p>
            "Client", "You", "Your" refers to the user. "Company", "We", "Our" refers to 
            Signpost Celfon.in Technology. "Parties" refers to both user and company.
          </p>
        </section>

        {/* COOKIES */}
        <section className="lg3-section">
          <h3>Cookies</h3>
          <p>
            We use cookies to improve user experience. By accessing our platform, 
            you agree to our use of cookies as per our Privacy Policy.
          </p>
        </section>

        {/* LICENSE */}
        <section className="lg3-section">
          <h3>License</h3>
          <ul>
            <li>Republish material from the platform</li>
            <li>Sell or rent platform content</li>
            <li>Duplicate or copy content</li>
            <li>Redistribute content without permission</li>
          </ul>
        </section>

        {/* USER CONTENT */}
        <section className="lg3-section">
          <h3>User Comments & Content</h3>
          <p>
            Users may post content where allowed. We do not pre-review content and 
            are not responsible for user opinions.
          </p>
          <ul>
            <li>Content must not violate intellectual property</li>
            <li>No offensive or unlawful content</li>
            <li>No misuse for promotions or illegal activities</li>
          </ul>
        </section>

        {/* HYPERLINKING */}
        <section className="lg3-section">
          <h3>Hyperlinking</h3>
          <p>Organizations allowed to link without approval:</p>
          <ul>
            <li>Government agencies</li>
            <li>Search engines</li>
            <li>News organizations</li>
            <li>Online directories</li>
          </ul>
        </section>

        {/* IFRAME */}
        <section className="lg3-section">
          <h3>iFrames</h3>
          <p>
            You may not create frames around our website without written permission.
          </p>
        </section>

        {/* LIABILITY */}
        <section className="lg3-section">
          <h3>Content Liability</h3>
          <p>
            We are not responsible for content on third-party websites linking to us.
          </p>
        </section>

        {/* RIGHTS */}
        <section className="lg3-section">
          <h3>Reservation of Rights</h3>
          <p>
            We reserve the right to request removal of links and update these terms at any time.
          </p>
        </section>

        {/* REMOVAL */}
        <section className="lg3-section">
          <h3>Removal of Links</h3>
          <p>
            If you find any content offensive, you may contact us. We may review but are not obligated to act.
          </p>
        </section>

        {/* DISCLAIMER */}
        <section className="lg3-section">
          <h3>Disclaimer</h3>
          <p>
            We do not guarantee completeness or accuracy of information. Services are provided 
            "as is" without warranties.
          </p>
          <ul>
            <li>No liability for damages or losses</li>
            <li>No guarantee of availability</li>
            <li>No responsibility for outdated information</li>
          </ul>
        </section>

        {/* FINAL NOTE */}
        <section className="lg3-section lg3-highlight">
          <p>
            Misuse of the directory or false listings may lead to account suspension.
          </p>
        </section>

      </div>
    </div>
  );
}