export const emptyProfile = {
  person_name: "",
  mobile_number: "",
  city: "",
  email: "",
  person_prefix: "",
  keywords: "",
  pincode: "",
  landline_code: "",
  landline_number: "",
  whats_app: "",
  address: "",
  bussiness_address: "",
  profile_image: "",
  business_name: "",
  description: "",
  promo_code: "",
  web_site: "",
  product_images: "",
  user_type: "",
  is_business: false
};

export default class UserProfile {
  constructor(data = {}) {
    this.id = data.id || "";
    this.personName = data.person_name || "";
    this.mobileNumber = data.mobile_number || "";
    this.personPrefix = data.person_prefix || "";
    this.profession = data.keywords || "";
    this.city = data.city || "";
    this.pincode = data.pincode || "";
    this.email = data.email || "";
    this.landlineCode = data.landline_code || "";
    this.landlineNumber = data.landline_number || "";
    this.whatsApp = data.whats_app || "";
    this.address = data.address || "";
    this.businessAddress = data.bussiness_address || "";
    this.profileImage = data.profile_image || "";
    this.businessName = data.business_name || "";
    this.description = data.description || "";
    this.promoCode = data.promo_code || "";
    this.webSite = data.web_site || "";
    this.productImages = data.product_images || "";
    this.userType = data.user_type || "";
    this.isBusiness = data.is_business || false;
    this.keywords = data.keywords || "";
  }

  static fromSupabase(data) {
    return new UserProfile(data);
  }
}