export const sendInvitation = ({
  phone,
  referrerPhone,
  friendName,
}) => {
  const message = `Dear ${friendName},

I'm using CELFON BOOK, the Mobile Number Finder and Dialer.

It helps to discover businesses, professionals and services around you.

It will be useful to you too.

Download the app and register using my Referral Code.

Referral Code:
${referrerPhone}

https://play.google.com/store/apps/details?id=com.celfonphonebookapp`;

  const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;

  window.location.href = smsUrl;
};