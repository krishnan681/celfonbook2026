// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { supabase } from "../../../core/config/supabaseClient";

// export const usePartnerController = () => {
//   const [profileType, setProfileType] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [mobileExists, setMobileExists] = useState(false);

//   // ============================
//   // INITIAL STATE
//   // ============================

//   const getInitialState = (type) => {
//     if (type === "business") {
//       return {
//         profile_type: "business",
//         mobile_number: "",
//         business_name: "",
//         owner_name: "",
//         owner_prefix: "",
//         keywords: "",
//         description: "",
//         landline_code: "",
//         landline_number: "",
//         door_no: "",
//         street_name: "",
//         area: "",
//         city: "",
//         pincode: "",
//         email: "",
//         promo_code: "",
//         business_prefix: "M/s.",
//       };
//     }

//     return {
//       profile_type: "person",
//       mobile_number: "",
//       person_name: "",
//       person_prefix: "",
//       profession: "",
//       landline_code: "",
//       landline_number: "",
//       door_no: "",
//       street_name: "",
//       area: "",
//       city: "",
//       pincode: "",
//       email: "",
//       promo_code: "",
//     };
//   };

//   // ============================
//   // TYPE SELECTION
//   // ============================

//   const handleTypeSelection = (type) => {
//     setProfileType(type);
//     setFormData(getInitialState(type));
//   };

//   // ============================
//   // CHANGE HANDLER
//   // ============================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     let formatted = value;

//     if (name === "mobile_number") {
//       formatted = value.replace(/\D/g, "").slice(0, 10);
//     }

//     if (name === "pincode") {
//       formatted = value.replace(/\D/g, "").slice(0, 6);
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: formatted,
//     }));
//   };

//   // ============================
//   // MOBILE EXIST CHECK
//   // ============================

//   useEffect(() => {
//     const checkMobile = async () => {
//       if (formData.mobile_number?.length === 10) {
//         const { data } = await supabase
//           .from("profiles")
//           .select("id")
//           .eq("mobile_number", formData.mobile_number)
//           .maybeSingle();

//         setMobileExists(!!data);
//       } else {
//         setMobileExists(false);
//       }
//     };

//     checkMobile();
//   }, [formData.mobile_number]);

//   // ============================
//   // VALIDATION
//   // ============================

//   const validateForm = () => {
//     if (!profileType) {
//       Swal.fire("Error", "Select account type", "error");
//       return false;
//     }

//     if (formData.mobile_number.length !== 10) {
//       Swal.fire("Error", "Mobile must be 10 digits", "error");
//       return false;
//     }

//     if (formData.pincode.length !== 6) {
//       Swal.fire("Error", "Pincode must be 6 digits", "error");
//       return false;
//     }

//     if (profileType === "person") {
//       if (!formData.person_name || !formData.profession) {
//         Swal.fire("Error", "Fill all required person fields", "error");
//         return false;
//       }
//     }

//     if (profileType === "business") {
//       if (!formData.business_name || !formData.owner_name) {
//         Swal.fire("Error", "Fill all required business fields", "error");
//         return false;
//       }
//     }

//     if (mobileExists) {
//       Swal.fire("Error", "Mobile already registered", "error");
//       return false;
//     }

//     return true;
//   };

//   // ============================
//   // SUBMIT
//   // ============================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       const { error } = await supabase
//         .from("profiles")
//         .insert([formData]);

//       if (error) throw error;

//       Swal.fire("Success", "Profile saved successfully", "success");

//       setProfileType(null);
//       setFormData({});
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Failed to save profile", "error");
//     }
//   };

//   return {
//     profileType,
//     formData,
//     mobileExists,
//     handleChange,
//     handleSubmit,
//     handleTypeSelection,
//     setProfileType,
//   };
// };

// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { supabase } from "../../../core/config/supabaseClient";

// export const usePartnerController = () => {
//   const [profileType, setProfileType] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [mobileExists, setMobileExists] = useState(false);
//   const [touched, setTouched] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   const [existingName, setExistingName] = useState("");
//   const [landlineExists, setLandlineExists] = useState(false);
//   const [generateOtp, setGenerateOtp] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   // =========================
//   // SMS HELPER
//   // =========================
//   const isMobileDevice = () =>
//     /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//   const sendSMS = (mobile, message) => {
//     if (!mobile) return;

//     const encodedMessage = encodeURIComponent(message);
//     const smsUrl = `sms:${mobile}?body=${encodedMessage}`;

//     window.open(smsUrl, "_self");
//   };

//   // =========================
//   // INITIAL STATE
//   // =========================
//   const getInitialState = (type) => {
//     if (type === "business") {
//       return {
//         user_type: "business",
//         mobile_number: "",
//         business_name: "",
//         person_name: "",
//         person_prefix: "",
//         keywords: "",
//         description: "",
//         landline_code: "",
//         landline: "",
//         city: "",
//         pincode: "",
//         address: "",
//         email: "",
//       };
//     }

//     return {
//       user_type: "person",
//       mobile_number: "",
//       person_name: "",
//       person_prefix: "",
//       keywords: "",
//       landline_code: "",
//       landline: "",
//       city: "",
//       pincode: "",
//       address: "",
//       email: "",
//     };
//   };

//   const handleTypeSelection = (type) => {
//     setProfileType(type);
//     setFormData(getInitialState(type));
//     setTouched({});
//   };

//   // =========================
//   // HANDLE INPUT CHANGE
//   // =========================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let formatted = value;

//     if (name === "mobile_number") {
//       formatted = value.replace(/\D/g, "").slice(0, 10);
//     }

//     if (name === "pincode") {
//       formatted = value.replace(/\D/g, "").slice(0, 6);
//     }

//     if (name === "landline" || name === "landline_code") {
//       formatted = value.replace(/\D/g, "");
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: formatted,
//     }));

//     setTouched((prev) => ({ ...prev, [name]: true }));
//   };

//   // =========================
//   // CHECK MOBILE EXISTS
//   // =========================
//   useEffect(() => {
//     const checkMobile = async () => {
//       if (formData.mobile_number?.length !== 10) {
//         setMobileExists(false);
//         setExistingName("");
//         return;
//       }

//       const { data } = await supabase
//         .from("profiles")
//         .select("business_name, person_name")
//         .eq("mobile_number", formData.mobile_number)
//         .maybeSingle();

//       setMobileExists(!!data);

//       if (data) {
//         setExistingName(data.business_name || data.person_name);
//       } else {
//         setExistingName("");
//       }
//     };

//     checkMobile();
//   }, [formData.mobile_number]);

//   // =========================
//   // CHECK landline EXISTS
//   // =========================

//   useEffect(() => {
//     const checkLandline = async () => {
//       if (!formData.landline || !formData.landline_code) {
//         setLandlineExists(false);
//         return;
//       }

//       const fullLandline = `${formData.landline_code}-${formData.landline}`;

//       const { data } = await supabase
//         .from("profiles")
//         .select("id")
//         .eq("landline", fullLandline)
//         .maybeSingle();

//       setLandlineExists(!!data);
//     };

//     checkLandline();
//   }, [formData.landline, formData.landline_code]);

//   // =========================
//   // OTP GENERATOR
//   // =========================

//   const generateRandomOtp = () => {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   };

//   const sendOtp = async () => {
//   if (!formData.mobile_number) {
//     Swal.fire(
//       "Error",
//       "Enter mobile number",
//       "error"
//     );
//     return;
//   }

//   try {
//     setLoading(true);

//     const otp = generateRandomOtp();

//     await supabase
//       .from("otp_verifications")
//       .delete()
//       .eq("phone", formData.mobile_number);

//     await supabase
//       .from("otp_verifications")
//       .insert({
//         phone: formData.mobile_number,
//         otp,
//       });

//     await fetch(
//       `YOUR_SMS_API_URL_HERE`
//     );

//     Swal.fire(
//       "Success",
//       `OTP sent to ${formData.mobile_number}`,
//       "success"
//     );

//   } catch (err) {
//     Swal.fire(
//       "Error",
//       "Failed to send OTP",
//       "error"
//     );
//   } finally {
//     setLoading(false);
//   }
// };

// const uploadImage = async (userId) => {
//   if (!selectedImage) return null;

//   const ext =
//     selectedImage.name.split(".").pop();

//   const fileName =
//     `${userId}-${Date.now()}.${ext}`;

//   const { error } =
//     await supabase.storage
//       .from("partner")
//       .upload(fileName, selectedImage);

//   if (error) throw error;

//   return supabase.storage
//     .from("partner")
//     .getPublicUrl(fileName)
//     .data.publicUrl;
// };

// const preview = await Swal.fire({
//   title: "Preview Details",
//   html: `
//     <div style="text-align:left">
//       <p><b>Mobile:</b>
//       ${formData.mobile_number}</p>

//       <p><b>City:</b>
//       ${formData.city}</p>

//       <p><b>Pincode:</b>
//       ${formData.pincode}</p>
//     </div>
//   `,
//   showCancelButton: true,
//   confirmButtonText:
//     "Confirm & Save",
// });

// if (!preview.isConfirmed) return;

//   // =========================
//   // VALIDATION
//   // =========================
//   const isValidMobile = /^[6-9]\d{9}$/.test(formData.mobile_number);
//   const isValidPincode = formData.pincode?.length === 6;

//   const getInputClass = (field) => {
//     if (!touched[field]) return "form-control";
//     if (!formData[field]) return "form-control is-invalid";
//     return "form-control is-valid";
//   };

//   const validateForm = () => {
//     if (!isValidMobile) {
//       Swal.fire("Error", "Invalid mobile number", "error");
//       return false;
//     }

//     if (!isValidPincode) {
//       Swal.fire("Error", "Pincode must be 6 digits", "error");
//       return false;
//     }

//     if (mobileExists) {
//       Swal.fire("Error", "Mobile already exists", "error");
//       return false;
//     }

//     return true;
//   };

//   // =========================
//   // SUBMIT
//   // =========================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     if (submitting) return;

//     setSubmitting(true);

//     try {
//       const { data: userData, error: userError } =
//         await supabase.auth.getUser();

//       const user = userData?.user;

//       if (userError || !user) {
//         throw new Error("User not authenticated");
//       }

//       const payload = {
//         user_type: formData.user_type,
//         is_business: formData.is_business,

//         mobile_number: formData.mobile_number,
//         person_name: formData.person_name || null,
//         person_prefix: formData.person_prefix || null,
//         business_name: formData.business_name || null,
//         business_prefix: formData.business_prefix || "M/s.",
//         keywords: formData.keywords
//           ? formData.keywords
//               .split(",")
//               .map((k) => k.trim())
//               .filter(Boolean)
//               .join(", ")
//           : null,
//         description: formData.description || null,
//         city: formData.city || null,
//         pincode: formData.pincode || null,
//         email: formData.email || null,
//         promo_code: formData.promo_code || null,
//         landline_code: formData.landline_code || null,
//         landline: formData.landline || null,
//         address: formData.address || null,
//         bussiness_address: formData.bussiness_address || null,
//         updated_at: new Date().toISOString(),
//       };

//       const { error: profileError } = await supabase
//         .from("profiles")
//         .insert([payload]);

//       if (profileError) throw profileError;

//       const { data: sProfile } = await supabase
//         .from("s_profiles")
//         .select("id, full_name")
//         .eq("user_id", user.id)
//         .single();

//       const now = new Date();

//       await supabase.from("data_entry_name").insert([
//         {
//           user_id: sProfile.id,
//           user_name: sProfile.full_name,
//           entryname: formData.person_name || formData.business_name || "Entry",
//           entry_type: formData.is_business
//             ? "Business Profile Entry"
//             : "Person Profile Entry",
//           created_at: now.toISOString(),
//           updated_at: now.toISOString(),
//         },
//       ]);

//       const { data: todayEntries } = await supabase
//         .from("data_entry_name")
//         .select("id")
//         .eq("user_id", sProfile.id);

//       const todayCount = todayEntries?.length || 0;

//       await supabase.from("data_entry_table").upsert({
//         user_id: sProfile.id,
//         user_name: sProfile.full_name,
//         count: todayCount,
//         earnings: todayCount * 2,
//         entry_date: now.toISOString().split("T")[0],
//         updated_at: now.toISOString(),
//       });

//       // =========================
//       // SUCCESS + SMS
//       // =========================
//       Swal.fire({
//         title: "Success",
//         text: "Profile saved successfully",
//         icon: "success",
//         confirmButtonText: "Send SMS",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           if (!isMobileDevice()) {
//             Swal.fire(
//               "Not Supported",
//               "SMS works only on mobile devices",
//               "info",
//             );
//             return;
//           }

//           const nameText = formData.is_business
//             ? `M/s. ${formData.business_name}`
//             : `${formData.person_prefix || ""} ${formData.person_name}`;

//           const link =
//             "https://play.google.com/store/apps/details?id=com.celfonphonebookapp&pcampaignid=web_share";

//           const message = formData.is_business
//             ? `Dear ${nameText}, CELFON BOOK app. Your firm ${formData.business_name} is listed under ${formData.keywords}. Verify here: ${link}`
//             : `Dear ${nameText}, CELFON BOOK app. You are listed under ${formData.keywords || ""}. Verify here: ${link}`;

//           sendSMS(formData.mobile_number, message);
//         }
//       });

//       setProfileType(null);
//       setFormData({});
//       setTouched({});
//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", err.message || "Something went wrong", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return {
//     profileType,
//     formData,
//     mobileExists,
//     handleChange,
//     handleSubmit,
//     handleTypeSelection,
//     setProfileType,
//     getInputClass,
//   };
// };

// new 30-5-26

// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { supabase } from "../../../core/config/supabaseClient";

// export const usePartnerController = () => {
//   const [profileType, setProfileType] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [mobileExists, setMobileExists] = useState(false);
//   const [landlineExists, setLandlineExists] = useState(false);
//   const [existingName, setExistingName] = useState("");
//   const [touched, setTouched] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   // OTP
//   const [generateOtp, setGenerateOtp] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Image Upload
//   const [selectedImage, setSelectedImage] = useState(null);

//   const [showOtpPage, setShowOtpPage] = useState(false);
//   const [enteredOtp, setEnteredOtp] = useState("");
//   const [otpVerified, setOtpVerified] = useState(false);

//   // =========================
//   // SMS HELPER
//   // =========================
//   const isMobileDevice = () =>
//     /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//   const sendSMS = (mobile, message) => {
//     if (!mobile) return;

//     const encodedMessage = encodeURIComponent(message);
//     const smsUrl = `sms:${mobile}?body=${encodedMessage}`;

//     window.open(smsUrl, "_self");
//   };

//   // =========================
//   // INITIAL STATE
//   // =========================
//   const getInitialState = (type) => {
//     if (type === "business") {
//       return {
//         user_type: "business",
//         is_business: true,

//         mobile_number: "",
//         business_name: "",
//         business_prefix: "M/s.",

//         keywords: "",
//         description: "",

//         bussiness_address: "",

//         landline_code: "",
//         landline: "",

//         city: "",
//         pincode: "",
//         email: "",
//         promo_code: "",
//       };
//     }

//     return {
//       user_type: "person",
//       is_business: false,

//       mobile_number: "",
//       person_name: "",
//       person_prefix: "",

//       address: "",

//       landline_code: "",
//       landline: "",

//       city: "",
//       pincode: "",
//       email: "",
//       promo_code: "",
//     };
//   };

//   const handleTypeSelection = (type) => {
//     setProfileType(type);
//     setFormData(getInitialState(type));
//     setTouched({});
//     setExistingName("");
//     setMobileExists(false);
//     setLandlineExists(false);
//   };

//   // =========================
//   // HANDLE INPUT CHANGE
//   // =========================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let formatted = value;

//     if (name === "mobile_number") {
//       formatted = value.replace(/\D/g, "").slice(0, 10);
//     }

//     if (name === "pincode") {
//       formatted = value.replace(/\D/g, "").slice(0, 6);
//     }

//     if (name === "landline" || name === "landline_code") {
//       formatted = value.replace(/\D/g, "");
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: formatted,
//     }));

//     setTouched((prev) => ({
//       ...prev,
//       [name]: true,
//     }));
//   };

//   // =========================
//   // CHECK MOBILE EXISTS
//   // =========================
//   useEffect(() => {
//     const checkMobile = async () => {
//       if (formData.mobile_number?.length !== 10) {
//         setMobileExists(false);
//         setExistingName("");
//         return;
//       }

//       const { data, error } = await supabase
//         .from("profiles")
//         .select("id, business_name, person_name")
//         .eq("mobile_number", formData.mobile_number)
//         .maybeSingle();

//       if (error) {
//         console.error(error);
//         return;
//       }

//       setMobileExists(!!data);

//       if (data) {
//         setExistingName(data.business_name || data.person_name || "");
//       } else {
//         setExistingName("");
//       }
//     };

//     checkMobile();
//   }, [formData.mobile_number]);

//   // =========================
//   // CHECK LANDLINE EXISTS
//   // =========================
//   useEffect(() => {
//     const checkLandline = async () => {
//       if (!formData.landline) {
//         setLandlineExists(false);
//         return;
//       }

//       const { data } = await supabase
//         .from("profiles")
//         .select("id")
//         .eq("landline", formData.landline)
//         .maybeSingle();

//       setLandlineExists(!!data);
//     };

//     checkLandline();
//   }, [formData.landline]);

//   // =========================
//   // OTP
//   // =========================
//   const generateRandomOtp = () => {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   };

//   const sendOtp = async () => {
//     if (!formData.mobile_number) {
//       Swal.fire("Error", "Enter mobile number", "error");
//       return;
//     }

//     if (formData.mobile_number.length !== 10) {
//       Swal.fire("Error", "Enter valid 10 digit mobile number", "error");
//       return;
//     }

//     if (mobileExists) {
//       Swal.fire("Error", "Mobile already exists", "error");
//       return;
//     }

//     try {
//       setLoading(true);

//       const otp = generateRandomOtp();

//       // =========================
//       // CALL YOUR NODE API
//       // =========================
//       const response = await fetch("/api/send-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           phone: formData.mobile_number,
//           otp,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to send OTP");
//       }

//       // =========================
//       // DELETE OLD OTP
//       // =========================
//       await supabase
//         .from("otp_verifications")
//         .delete()
//         .eq("phone", formData.mobile_number);

//       // =========================
//       // INSERT NEW OTP
//       // =========================
//       const { error } = await supabase.from("otp_verifications").insert({
//         phone: formData.mobile_number,
//         otp,
//       });

//       if (error) throw error;

//    await Swal.fire(
//   "Success",
//   `OTP sent to ${formData.mobile_number}`,
//   "success"
// );

// setShowOtpPage(true);
//     } catch (err) {
//       console.error(err);

//       Swal.fire("Error", err.message || "Failed to send OTP", "error");
//     } finally {
//       setLoading(false);
//     }
//   };



// const verifyOtp = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("otp_verifications")
//       .select("*")
//       .eq("phone", formData.mobile_number)
//       .eq("otp", enteredOtp)
//       .maybeSingle();

//     if (error) throw error;

//     if (!data) {
//       Swal.fire(
//         "Error",
//         "Invalid OTP",
//         "error"
//       );
//       return;
//     }

//     setOtpVerified(true);

//     Swal.fire(
//       "Success",
//       "OTP Verified",
//       "success"
//     );

//     await saveProfile();

//   } catch (err) {
//     Swal.fire(
//       "Error",
//       err.message,
//       "error"
//     );
//   }
// };


// const saveProfile = async () => {
//   if (submitting) return;

//   setSubmitting(true);

//   try {
//     const preview = await Swal.fire({
//       title: "Preview Details",
//       html: `
//         <div style="text-align:left">
//           <p><b>Mobile:</b> ${formData.mobile_number}</p>
//           <p><b>City:</b> ${formData.city}</p>
//           <p><b>Pincode:</b> ${formData.pincode}</p>
//         </div>
//       `,
//       showCancelButton: true,
//       confirmButtonText: "Confirm & Save",
//     });

//     if (!preview.isConfirmed) {
//       setSubmitting(false);
//       return;
//     }

//     const { data: userData, error: userError } =
//       await supabase.auth.getUser();

//     const user = userData?.user;

//     if (userError || !user) {
//       throw new Error("User not authenticated");
//     }

//     const imageUrl = await uploadImage(user.id);

//     const payload = {
//       user_type: formData.user_type,
//       is_business: formData.is_business,

//       mobile_number: formData.mobile_number,

//       person_name: formData.person_name || null,
//       person_prefix: formData.person_prefix || null,

//       business_name: formData.business_name || null,
//       business_prefix: formData.business_prefix || "M/s.",

//       keywords: formData.keywords
//         ? formData.keywords
//             .split(",")
//             .map((k) => k.trim())
//             .filter(Boolean)
//             .join(", ")
//         : null,

//       description: formData.description || null,

//       city: formData.city || null,
//       pincode: formData.pincode || null,

//       email: formData.email || null,
//       promo_code: formData.promo_code || null,

//       landline_code: formData.landline_code || null,
//       landline: formData.landline || null,

//       address: formData.address || null,

//       bussiness_address:
//         formData.bussiness_address || null,

//       image_url: imageUrl,

//       updated_at: new Date().toISOString(),
//     };

//     const { error } = await supabase
//       .from("profiles")
//       .insert([payload]);

//     if (error) throw error;

//     // delete OTP after successful save
//     await supabase
//       .from("otp_verifications")
//       .delete()
//       .eq("phone", formData.mobile_number);

//     Swal.fire(
//       "Success",
//       "Profile saved successfully",
//       "success"
//     );

//     // reset form
//     setProfileType(null);
//     setFormData({});
//     setTouched({});
//     setSelectedImage(null);

//     setShowOtpPage(false);
//     setEnteredOtp("");
//     setOtpVerified(false);

//   } catch (err) {
//     console.error(err);

//     Swal.fire(
//       "Error",
//       err.message || "Something went wrong",
//       "error"
//     );
//   } finally {
//     setSubmitting(false);
//   }
// };


//   // =========================
//   // IMAGE UPLOAD
//   // =========================
//   const uploadImage = async (userId) => {
//     if (!selectedImage) return null;

//     const ext = selectedImage.name.split(".").pop();

//     const fileName = `${userId}-${Date.now()}.${ext}`;

//     const { error } = await supabase.storage
//       .from("partner")
//       .upload(fileName, selectedImage);

//     if (error) throw error;

//     const { data } = supabase.storage.from("partner").getPublicUrl(fileName);

//     return data.publicUrl;
//   };

//   // =========================
//   // VALIDATION
//   // =========================
//   const isValidMobile = /^[6-9]\d{9}$/.test(formData.mobile_number || "");

//   const isValidPincode = formData.pincode?.length === 6;

//   const getInputClass = (field) => {
//     if (!touched[field]) return "form-control";

//     if (!formData[field]) {
//       return "form-control is-invalid";
//     }

//     return "form-control is-valid";
//   };

//   const validateForm = () => {
//     if (!isValidMobile) {
//       Swal.fire("Error", "Invalid mobile number", "error");
//       return false;
//     }

//     if (!isValidPincode) {
//       Swal.fire("Error", "Pincode must be 6 digits", "error");
//       return false;
//     }

//     if (mobileExists) {
//       Swal.fire("Error", "Mobile already exists", "error");
//       return false;
//     }

//     if (landlineExists) {
//       Swal.fire("Error", "Landline already exists", "error");
//       return false;
//     }

//     return true;
//   };

//   // =========================
//   // SUBMIT
//   // =========================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;
//     if (submitting) return;

//     setSubmitting(true);

//     try {
//       const preview = await Swal.fire({
//         title: "Preview Details",
//         html: `
//           <div style="text-align:left">
//             <p><b>Mobile:</b>
//             ${formData.mobile_number}</p>

//             <p><b>City:</b>
//             ${formData.city}</p>

//             <p><b>Pincode:</b>
//             ${formData.pincode}</p>
//           </div>
//         `,
//         showCancelButton: true,
//         confirmButtonText: "Confirm & Save",
//       });

//       if (!preview.isConfirmed) {
//         setSubmitting(false);
//         return;
//       }

//       const { data: userData, error: userError } =
//         await supabase.auth.getUser();

//       const user = userData?.user;

//       if (userError || !user) {
//         throw new Error("User not authenticated");
//       }

//       const imageUrl = await uploadImage(user.id);

//       const payload = {
//         user_type: formData.user_type,
//         is_business: formData.is_business,

//         mobile_number: formData.mobile_number,

//         person_name: formData.person_name || null,

//         person_prefix: formData.person_prefix || null,

//         business_name: formData.business_name || null,

//         business_prefix: formData.business_prefix || "M/s.",

//         keywords: formData.keywords
//           ? formData.keywords
//               .split(",")
//               .map((k) => k.trim())
//               .filter(Boolean)
//               .join(", ")
//           : null,

//         description: formData.description || null,

//         city: formData.city || null,
//         pincode: formData.pincode || null,

//         email: formData.email || null,

//         promo_code: formData.promo_code || null,

//         landline_code: formData.landline_code || null,

//         landline: formData.landline || null,

//         address: formData.address || null,

//         bussiness_address: formData.bussiness_address || null,

//         image_url: imageUrl,

//         updated_at: new Date().toISOString(),
//       };

//       const { error: profileError } = await supabase
//         .from("profiles")
//         .insert([payload]);

//       if (profileError) throw profileError;

//       Swal.fire("Success", "Profile saved successfully", "success");

//       setProfileType(null);
//       setFormData({});
//       setTouched({});
//       setSelectedImage(null);
//     } catch (err) {
//       console.error(err);

//       Swal.fire("Error", err.message || "Something went wrong", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return {
//     profileType,
//     formData,
//     mobileExists,
//     existingName,
//     landlineExists,

//     generateOtp,
//     setGenerateOtp,
//     loading,

//     selectedImage,
//     setSelectedImage,

//     handleChange,
//     handleSubmit,
//     handleTypeSelection,
//     setProfileType,

//     getInputClass,
//     sendOtp,

//     showOtpPage,
//     setShowOtpPage,

//     enteredOtp,
//     setEnteredOtp,

//     otpVerified,
//     setOtpVerified,

//     verifyOtp,
//   };
// };






import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../../core/config/supabaseClient";

export const usePartnerController = () => {
  const [profileType, setProfileType] = useState(null);
  const [formData, setFormData] = useState({});
  const [mobileExists, setMobileExists] = useState(false);
  const [landlineExists, setLandlineExists] = useState(false);
  const [existingName, setExistingName] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // OTP Flow
  const [useOtp, setUseOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // Image
  const [selectedImage, setSelectedImage] = useState(null);

  // =========================
  // INITIAL STATE
  // =========================
  const getInitialState = (type) => ({
    user_type: type,
    is_business: false,                    // ← Default is always FALSE as per your request

    mobile_number: "",
    email: "",
    city: "",
    pincode: "",

    landline_code: "",
    landline: "",

    // Person fields
    ...(type === "person" && {
      person_name: "",
      person_prefix: "",
      address: "",
    }),

    // Business fields
    ...(type === "business" && {
      business_name: "",
      business_prefix: "M/s.",
      bussiness_address: "",
      keywords: "",
      description: "",
    }),

    promo_code: "",
  });

  const handleTypeSelection = (type) => {
    setProfileType(type);
    setFormData(getInitialState(type));
    setTouched({});
    setExistingName("");
    setMobileExists(false);
    setLandlineExists(false);
    setShowOtpPage(false);
    setEnteredOtp("");
    setOtpVerified(false);
    setSelectedImage(null);
  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "mobile_number") formatted = value.replace(/\D/g, "").slice(0, 10);
    if (name === "pincode") formatted = value.replace(/\D/g, "").slice(0, 6);
    if (name === "landline" || name === "landline_code") formatted = value.replace(/\D/g, "");

    setFormData((prev) => ({ ...prev, [name]: formatted }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // =========================
  // CHECK MOBILE & LANDLINE
  // =========================
  useEffect(() => {
    const checkMobile = async () => {
      if (formData.mobile_number?.length !== 10) {
        setMobileExists(false);
        setExistingName("");
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("id, business_name, person_name")
        .eq("mobile_number", formData.mobile_number)
        .maybeSingle();

      if (error) console.error(error);
      setMobileExists(!!data);
      setExistingName(data?.business_name || data?.person_name || "");
    };

    checkMobile();
  }, [formData.mobile_number]);

  useEffect(() => {
    const checkLandline = async () => {
      if (!formData.landline || formData.landline.length < 6) {
        setLandlineExists(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("landline", formData.landline)
        .maybeSingle();

      setLandlineExists(!!data);
    };

    checkLandline();
  }, [formData.landline]);

  // =========================
  // OTP
  // =========================
  const generateRandomOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

  const sendOtp = async () => {
    if (!formData.mobile_number || formData.mobile_number.length !== 10) {
      Swal.fire("Error", "Enter valid 10 digit mobile number", "error");
      return;
    }
    if (mobileExists) {
      Swal.fire("Error", "Mobile number already exists", "error");
      return;
    }

    try {
      setLoading(true);
      const otp = generateRandomOtp();

      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.mobile_number, otp }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to send OTP");

      await supabase.from("otp_verifications").delete().eq("phone", formData.mobile_number);

      const { error } = await supabase.from("otp_verifications").insert({
        phone: formData.mobile_number,
        otp,
      });
      if (error) throw error;

      Swal.fire("Success", `OTP sent to ${formData.mobile_number}`, "success");
      setShowOtpPage(true);
      setEnteredOtp("");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!enteredOtp || enteredOtp.length !== 4) {
      Swal.fire("Error", "Please enter 4 digit OTP", "error");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("otp_verifications")
        .select("*")
        .eq("phone", formData.mobile_number)
        .eq("otp", enteredOtp)
        .maybeSingle();

      if (error) throw error;
      if (!data) return Swal.fire("Error", "Invalid OTP", "error");

      Swal.fire("Success", "OTP Verified Successfully", "success");
      await saveProfile();
    } catch (err) {
      Swal.fire("Error", err.message || "Verification failed", "error");
    }
  };

  // =========================
  // IMAGE UPLOAD
  // =========================
  const uploadImage = async (userId) => {
    if (!selectedImage) return null;

    const ext = selectedImage.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("partner").upload(fileName, selectedImage);
    if (error) throw error;

    const { data } = supabase.storage.from("partner").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const saveProfile = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error("You must be logged in to create a partner profile.");
      }

      const user = userData.user;
      const imageUrl = await uploadImage(user.id);

      const payload = {
        user_type: formData.user_type,
        is_business: formData.is_business,           // Now always false by default
        mobile_number: formData.mobile_number,
        email: formData.email || null,
        city: formData.city,
        pincode: formData.pincode,
        landline_code: formData.landline_code || null,
        landline: formData.landline || null,
        promo_code: formData.promo_code || null,
        profile_image: imageUrl,
        updated_at: new Date().toISOString(),

        person_name: formData.person_name || null,
        person_prefix: formData.person_prefix || null,
        address: formData.address || null,

        business_name: formData.business_name || null,
        business_prefix: formData.business_prefix || "M/s.",
        bussiness_address: formData.bussiness_address || null,
        keywords: formData.keywords
          ? formData.keywords.split(",").map(k => k.trim()).filter(Boolean).join(", ")
          : null,
        description: formData.description || null,
      };

      const { error } = await supabase.from("profiles").insert([payload]);
      if (error) throw error;

      await supabase.from("otp_verifications").delete().eq("phone", formData.mobile_number);

      Swal.fire("Success", "Profile created successfully!", "success");

      // Reset Form
      setProfileType(null);
      setFormData({});
      setTouched({});
      setSelectedImage(null);
      setShowOtpPage(false);
      setEnteredOtp("");
      setOtpVerified(false);

    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to save profile", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (useOtp) {
      await sendOtp();
    } else {
      const confirmed = await Swal.fire({
        title: "Confirm Details",
        html: `
          <div style="text-align:left">
            <p><b>Mobile:</b> ${formData.mobile_number}</p>
            <p><b>City:</b> ${formData.city}</p>
            <p><b>Pincode:</b> ${formData.pincode}</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Confirm & Save",
      });

      if (confirmed.isConfirmed) await saveProfile();
    }
  };

  return {
    profileType,
    formData,
    mobileExists,
    existingName,
    landlineExists,
    useOtp,
    setUseOtp,
    loading,
    selectedImage,
    setSelectedImage,
    handleChange,
    handleSubmit,
    handleTypeSelection,
    setProfileType,
    sendOtp,
    verifyOtp,
    showOtpPage,
    setShowOtpPage,
    enteredOtp,
    setEnteredOtp,
    otpVerified,
  };
};