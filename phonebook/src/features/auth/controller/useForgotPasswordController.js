import { useState } from "react";
import { AuthService } from "../../../core/services/authService";

export default function useForgotPasswordController() {

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendOtp = async () => {

    setLoading(true);
    setError(null);

    try {

      const { error } = await AuthService.resetPassword(email);

      if (error) throw error;

      setStep(2);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndReset = async () => {

    setLoading(true);
    setError(null);

    try {

      const { error } = await AuthService.verifyOtp(email, otp);

      if (error) throw error;

      await AuthService.updatePassword(password);

      alert("Password updated successfully");

      setStep(1);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    otp,
    setOtp,
    password,
    setPassword,
    step,
    loading,
    error,
    sendOtp,
    verifyOtpAndReset,
  };
}