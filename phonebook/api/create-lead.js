export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      shop_id,
      shop_name,
      mobile_number,
    } = req.body;

    const smsUrl =
      `http://bhashsms.com/api/sendmsg.php` +
      `?user=Celfon_SMS` +
      `&pass=123456` +
      `&sender=CELFON` +
      `&phone=${mobile_number}` +
      `&text=${encodeURIComponent(
        `Thanks for Regstering with Signpost Celfon5g+. Your login credintials are Username: ${shop_name}, Password: ${mobile_number}. Please login to your profile and edit if needed. Regards, Signpost Celfon Team`
      )}` +
      `&priority=ndnd` +
      `&stype=normal`;

    const response = await fetch(smsUrl, {
      method: "POST",
    });

    const result = await response.text();

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}