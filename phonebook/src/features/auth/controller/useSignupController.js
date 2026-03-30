import { useState } from "react";
import { supabase } from "../../../core/config/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function useSignupController() {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [promo, setPromo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateIndianMobile = (value) => {
    return /^[6-9]\d{9}$/.test(value);
  };

  const signup = async () => {

    if (!phone) {
      setError("Phone number is required");
      return;
    }

    if (!validateIndianMobile(phone)) {
      setError("Enter valid mobile number");
      return;
    }

    if (!name) {
      setError("Full name required");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      let formattedPhone = phone;

      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+${formattedPhone}`;
      }

      const defaultPassword = "celfonbook";

      const { data, error: authError } = await supabase.auth.signUp({
        phone: formattedPhone,
        password: defaultPassword,
      });

      if (authError) throw authError;

      const user = data.user;

      if (!user) throw new Error("User not created");

      await supabase.from("s_profiles").insert({
        id: user.id,
        full_name: name,
        phone: phone,
        promo_code: promo,
      });

      navigate("/");

    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    phone,
    setPhone,
    name,
    setName,
    promo,
    setPromo,
    loading,
    error,
    signup,
  };
}