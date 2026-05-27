export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }

    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    const smsText = `Your OTP is ${otp} for verification in Celfon Book account. Do not share OTP with anyone.`;

    const smsUrl =
      `http://bhashsms.com/api/sendmsg.php` +
      `?user=${process.env.BHASHSMS_USER}` +
      `&pass=${process.env.BHASHSMS_PASS}` +
      `&sender=${process.env.BHASHSMS_SENDER}` +
      `&phone=${phone}` +
      `&text=${encodeURIComponent(smsText)}` +
      `&priority=ndnd` +
      `&stype=normal`;

    const response = await fetch(smsUrl);
    const data = await response.text();

    console.log("SMS Response:", data);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
}