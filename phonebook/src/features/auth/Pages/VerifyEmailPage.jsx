import "../Pages/css/verify.css";

const VerifyEmailPage = () => {
  return (
    <div className="verify-container">
      <div className="dots">
        {[...Array(5)].map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <p>Processing</p>

      <h2>Email Verification</h2>

      <button onClick={() => (window.location.href = "/home")}>
        Go to Home
      </button>
    </div>
  );
};

export default VerifyEmailPage;
