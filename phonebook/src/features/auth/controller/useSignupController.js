// import { useState } from "react";
// import { supabase } from "../../../core/config/supabaseClient";
// import { useNavigate } from "react-router-dom";

// export default function useSignupController() {

//   const navigate = useNavigate();

//   const [phone, setPhone] = useState("");
//   const [name, setName] = useState("");
//   const [promo, setPromo] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const validateIndianMobile = (value) => {
//     return /^[6-9]\d{9}$/.test(value);
//   };

//   const signup = async () => {

//     if (!phone) {
//       setError("Phone number is required");
//       return;
//     }

//     if (!validateIndianMobile(phone)) {
//       setError("Enter valid mobile number");
//       return;
//     }

//     if (!name) {
//       setError("Full name required");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {

//       let formattedPhone = phone;

//       if (!formattedPhone.startsWith("+")) {
//         formattedPhone = `+${formattedPhone}`;
//       }

//       const defaultPassword = "celfonbook";

//       const { data, error: authError } = await supabase.auth.signUp({
//         phone: formattedPhone,
//         password: defaultPassword,
//       });

//       if (authError) throw authError;

//       const user = data.user;

//       if (!user) throw new Error("User not created");

//       await supabase.from("s_profiles").insert({
//         id: user.id,
//         full_name: name,
//         phone: phone,
//         promo_code: promo,
//       });

//       navigate("/");

//     } catch (err) {
//       setError(err.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     phone,
//     setPhone,
//     name,
//     setName,
//     promo,
//     setPromo,
//     loading,
//     error,
//     signup,
//   };
// }




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

  // 🔥 Generate 4 digit OTP
  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // 🔥 Send OTP API
  const sendOtp = async (phone) => {
    if (!phone) return;

    const cleanPhone = phone.replace(/\D/g, "");
    const otp = generateOtp();

    try {
      // 🔥 CALL YOUR SMS API HERE
      // const response = await fetch("http://bhashsms.com/api/sendmsg.php?user=Celfon_SMS&pass=123456&sender=CELFON&phone=$cleanPhone&text=Your%20OTP%20for%20Signpost%20Celfon5G%20is:$otp.%20Use%20this%20OTP%20to%20verify%20your%20account.%20Do%20not%20share%20OTP%20with%20anyone.&priority=ndnd&stype=normal", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     phone: cleanPhone,
      //     otp: otp,
      //   }),
      // });

      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: cleanPhone,
          otp,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      // 🔥 Delete old OTP
      await supabase.from("otp_verifications").delete().eq("phone", cleanPhone);

      // 🔥 Insert new OTP
      const { error: otpError } = await supabase
        .from("otp_verifications")
        .insert({
          phone: cleanPhone,
          otp: otp,
        });

      if (otpError) throw otpError;

      // ✅ Navigate to OTP page
      navigate("/otp_verification", {
        state: {
          phone: cleanPhone,
        },
      });
    } catch (err) {
      console.error("OTP Error:", err);
      throw new Error("Failed to send OTP");
    }
  };

const signup = async () => {
  if (!phone.trim()) {
    setError("Phone number is required");
    return;
  }

  if (!validateIndianMobile(phone.trim())) {
    setError("Enter valid mobile number");
    return;
  }

  if (!name.trim()) {
    setError("Full name is required");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const mobileNumber = phone.trim();  
    const supabasePhone = `+91${mobileNumber}`;  
    const cleanName = name.trim();

    const defaultPassword = "celfonbook";

    // 🔐 Supabase Signup
    const { data, error: authError } =
      await supabase.auth.signUp({
        phone: supabasePhone,
        password: defaultPassword,
      });

    if (authError) throw authError;

    const user = data.user;

    if (!user) {
      throw new Error("User not created");
    }

    // 🔥 Save Profile
    const { error: profileError } = await supabase
      .from("s_profiles")
      .insert({
        id: user.id,
        full_name: cleanName,
        phone: mobileNumber, // save only 10 digit number
        promo_code: promo.trim(),
      });

    if (profileError) throw profileError;

    // 🔥 Send OTP (10 digit only)
    await sendOtp(mobileNumber);

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








// import { useState } from "react";
// import { supabase } from "../../../core/config/supabaseClient";
// import { useNavigate } from "react-router-dom";

// export default function useSignupController() {
//   const navigate = useNavigate();

//   const [phone, setPhone] = useState("");
//   const [name, setName] = useState("");
//   const [promo, setPromo] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const validateIndianMobile = (value) => {
//     return /^[6-9]\d{9}$/.test(value);
//   };

//   const generateOtp = () => {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   };

//   const sendOtp = async (phone) => {
//     if (!phone) return;

//     const cleanPhone = phone.replace(/\D/g, "").slice(-10);

//     const otp = generateOtp();

//     try {
//       const response = await fetch(
//         "http://localhost:5000/send-otp",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             phone: cleanPhone,
//             otp,
//           }),
//         }
//       );

//       const result = await response.json();

//       console.log("OTP Response:", result);

//       if (!response.ok) {
//         throw new Error("Failed to send OTP");
//       }

//       // Delete old OTP
//       await supabase
//         .from("otp_verifications")
//         .delete()
//         .eq("phone", cleanPhone);

//       // Save OTP
//       const { error: otpError } = await supabase
//         .from("otp_verifications")
//         .insert({
//           phone: cleanPhone,
//           otp,
//         });

//       if (otpError) throw otpError;

//       navigate("/otp_verification", {
//         state: {
//           phone: cleanPhone,
//         },
//       });
//     } catch (err) {
//       console.error("OTP Error:", err);
//       throw new Error("Failed to send OTP");
//     }
//   };

//   const signup = async () => {
//     if (!phone.trim()) {
//       setError("Phone number is required");
//       return;
//     }

//     if (!validateIndianMobile(phone.trim())) {
//       setError("Enter valid mobile number");
//       return;
//     }

//     if (!name.trim()) {
//       setError("Full name is required");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const mobileNumber = phone.trim(); // 9944561464
//       const supabasePhone = `+91${mobileNumber}`; // only for auth
//       const cleanName = name.trim();

//       const defaultPassword = "celfonbook";

//       // Signup
//       const { data, error: authError } =
//         await supabase.auth.signUp({
//           phone: supabasePhone,
//           password: defaultPassword,
//         });

//       if (authError) throw authError;

//       const user = data.user;

//       if (!user) {
//         throw new Error("User not created");
//       }

//       // Save profile
//       const { error: profileError } =
//         await supabase.from("s_profiles").insert({
//           id: user.id,
//           full_name: cleanName,
//           phone: mobileNumber,
//           promo_code: promo.trim(),
//         });

//       if (profileError) throw profileError;

//       // Send OTP
//       await sendOtp(mobileNumber);

//     } catch (err) {
//       setError(err.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     phone,
//     setPhone,
//     name,
//     setName,
//     promo,
//     setPromo,
//     loading,
//     error,
//     signup,
//   };
// }