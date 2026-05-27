// export default async function handler(req, res) {
//   try {
//     if (req.method !== "POST") {
//       return res.status(405).json({
//         success: false,
//         message: "Method not allowed",
//       });
//     }

//     let { phone, otp } = req.body;

//     if (!phone || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone number and OTP are required",
//       });
//     }

//     // ✅ Remove non-numbers
//     phone = phone.toString().replace(/\D/g, "");

//     // ✅ Remove country code if exists
//     if (phone.startsWith("91") && phone.length > 10) {
//       phone = phone.slice(-10);
//     }

//     console.log("Final Phone:", phone);
//     console.log("OTP:", otp);

//     const smsText = `Your OTP is ${otp} for verification in Celfon Book account. Do not share OTP with anyone.`;

//     const smsUrl =
//       `http://bhashsms.com/api/sendmsg.php` +
//       `?user=${process.env.BHASHSMS_USER}` +
//       `&pass=${process.env.BHASHSMS_PASS}` +
//       `&sender=${process.env.BHASHSMS_SENDER}` +
//       `&phone=91${phone}` +
//       `&text=${encodeURIComponent(smsText)}` +
//       `&priority=ndnd` +
//       `&stype=normal`;

//     console.log("SMS URL:", smsUrl);

//     const response = await fetch(smsUrl);
//     const data = await response.text();

//     console.log("SMS Provider Response:", data);

//     // ❌ SMS Failed
//     if (!data || !data.includes("S.")) {
//       return res.status(500).json({
//         success: false,
//         message: "SMS provider rejected request",
//         providerResponse: data,
//       });
//     }

//     // ✅ Success
//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//     });
//   } catch (error) {
//     console.error("OTP Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to send OTP",
//       error: error.message,
//     });
//   }
// }

export default async function handler(req, res) {
  try {
    console.log("==================================");
    console.log("OTP API HIT");
    console.log("Method:", req.method);
    console.log("Time:", new Date().toISOString());
    console.log("==================================");

    if (req.method !== "POST") {
      console.log("❌ Invalid Method:", req.method);

      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const { phone, otp } = req.body;

    console.log("📩 Request Body:");
    console.log("Phone Received:", phone);
    console.log("OTP Received:", otp);

    if (!phone || !otp) {
      console.log("❌ Missing phone or otp");

      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    // Add country code only for SMS API
    const formattedPhone = `91${phone}`;

    console.log("📞 Original Phone:", phone);
    console.log("📞 Formatted Phone:", formattedPhone);

  const smsText =
  `Your OTP for Signpost Celfon5G is:${otp}. Use this OTP to verify your account. Do not share OTP with anyone.`;
    console.log("📝 SMS Text:", smsText);

    console.log("🔐 ENV CHECK");
    console.log("BHASHSMS_USER Exists:", !!process.env.BHASHSMS_USER);
    console.log("BHASHSMS_PASS Exists:", !!process.env.BHASHSMS_PASS);
    console.log("BHASHSMS_SENDER Exists:", !!process.env.BHASHSMS_SENDER);

    const smsUrl =
      `http://bhashsms.com/api/sendmsg.php` +
      `?user=${process.env.BHASHSMS_USER}` +
      `&pass=${process.env.BHASHSMS_PASS}` +
      `&sender=${process.env.BHASHSMS_SENDER}` +
      `&phone=${formattedPhone}` +
      `&text=${encodeURIComponent(smsText)}` +
      `&priority=ndnd` +
      `&stype=normal`;

    console.log("🚀 Sending SMS...");
    console.log(
      "SMS URL (Hidden Credentials):",
      `http://bhashsms.com/api/sendmsg.php?...&phone=${formattedPhone}`,
    );

    const response = await fetch(smsUrl);

    console.log("HTTP STATUS:", response.status);
    console.log("HTTP OK:", response.ok);
    console.log("HEADERS:", [...response.headers.entries()]);

    const data = await response.text();

    console.log("RAW SMS RESPONSE:", JSON.stringify(data));
    console.log("✅ SMS Response:");
    console.log(data);

    console.log("==================================");
    console.log("OTP API SUCCESS");
    console.log("==================================");

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      apiResponse: data,
    });
  } catch (error) {
    console.log("==================================");
    console.log("❌ OTP API ERROR");
    console.log("==================================");

    console.error("Error Message:", error.message);
    console.error("Full Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
}
