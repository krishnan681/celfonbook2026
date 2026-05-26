// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Test route
// app.get("/", (req, res) => {
//   res.send("OTP Server Running Successfully");
// });

// // Send OTP Route
// app.post("/send-otp", async (req, res) => {
//   try {
//     const { phone, otp } = req.body;

//     // Validation
//     if (!phone || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Phone number and OTP are required",
//       });
//     }

//     // SMS text
//     const smsText = `Your OTP is ${otp} for verification in Celfon Book account. Do not share OTP with anyone.`;

//     // BhashSMS API URL
//     const smsUrl =
//       `http://bhashsms.com/api/sendmsg.php?user=Celfon_SMS&pass=123456&sender=CELFON&phone=${phone}&text=${encodeURIComponent(smsText)}&priority=ndnd&stype=normal`;
//       `&priority=ndnd` +
//       `&stype=normal`;

//     console.log("==================================");
//     console.log("Sending OTP");
//     console.log("Phone:", phone);
//     console.log("OTP:", otp);
//     console.log("==================================");

//     // Send SMS
//     const response = await axios.get(smsUrl);

//     console.log("SMS API Response:");
//     console.log(response.data);

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//       apiResponse: response.data,
//     });
//   } catch (error) {
//     console.error("OTP Sending Error:");
//     console.error(error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to send OTP",
//       error: error.message,
//     });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log("==================================");
//   console.log(`OTP Server Running`);
//   console.log(`URL: http://localhost:${PORT}`);
//   console.log("==================================");
// });


// // 9944561464



const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("OTP Server Running Successfully");
});

// Send OTP Route
app.post("/send-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    // Force only 10 digit number
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    // SMS text
    const smsText = `Your OTP for Signpost Celfon5G is:${otp}. Use this OTP to verify your account. Do not share OTP with anyone.`;

    // BhashSMS API URL
    const smsUrl =
      `http://bhashsms.com/api/sendmsg.php?` +
      `user=Celfon_SMS` +
      `&pass=123456` +
      `&sender=CELFON` +
      `&phone=${cleanPhone}` +
      `&text=${encodeURIComponent(smsText)}` +
      `&priority=ndnd` +
      `&stype=normal`;

    console.log("==================================");
    console.log("Sending OTP");
    console.log("Phone:", cleanPhone);
    console.log("OTP:", otp);
    console.log("SMS URL:", smsUrl);
    console.log("==================================");

    const response = await axios.get(smsUrl);

    console.log("SMS API Response:");
    console.log(response.data);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      response: response.data,
    });
  } catch (error) {
    console.error("OTP Sending Error:");

    if (error.response) {
      console.error(error.response.data);
    }

    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("==================================");
  console.log(`OTP Server Running`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log("==================================");
});