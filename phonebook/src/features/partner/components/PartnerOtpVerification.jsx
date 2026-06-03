import React from "react";

const PartnerOtpVerification = ({
  enteredOtp,
  setEnteredOtp,
  verifyOtp,
}) => {
  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h3>OTP Verification</h3>

        <input
          type="text"
          className="form-control mt-3"
          placeholder="Enter OTP"
          value={enteredOtp}
          onChange={(e) =>
            setEnteredOtp(e.target.value)
          }
        />

        <button
          className="btn btn-primary mt-3"
          onClick={verifyOtp}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default PartnerOtpVerification;