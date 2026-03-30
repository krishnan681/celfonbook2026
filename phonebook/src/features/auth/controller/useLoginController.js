import { useState } from "react";
import { AuthService } from "../../../core/services/authService";
import { useNavigate } from "react-router-dom";

export default function useLoginController() {

  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async () => {

    if (!identifier || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const { error } = await AuthService.loginWithPassword(
        identifier,
        password
      );

      if (error) throw error;

      navigate("/");

    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    login,
  };
}