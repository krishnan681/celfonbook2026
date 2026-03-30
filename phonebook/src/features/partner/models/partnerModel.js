export const getInitialState = (type) => {
  if (type === "business") {
    return {
      profile_type: "business",
      mobile_number: "",
      business_name: "",
      owner_name: "",
      owner_prefix: "",
      keywords: [],
      description: "",
      landline_code: "",
      landline_number: "",
      door_no: "",
      street_name: "",
      area: "",
      city: "",
      pincode: "",
      email: "",
      promo_code: "",
      business_prefix: "M/s.",
    };
  }

  return {
    profile_type: "person",
    mobile_number: "",
    person_name: "",
    person_prefix: "",
    profession: "",
    landline_code: "",
    landline_number: "",
    door_no: "",
    street_name: "",
    area: "",
    city: "",
    pincode: "",
    email: "",
    promo_code: "",
  };
};