export class ReferralModel {
  constructor(data = {}) {
    this.id = data.id || "";
    this.referrerId = data.referrer_id || "";
    this.referredName = data.referred_name || "";
    this.referredPhone = data.referred_phone || "";
    this.referralCode = data.referral_code || "";
    this.smsSent = data.sms_sent ?? false;
    this.joined = data.joined ?? false;
    this.couponGenerated = data.coupon_generated ?? false;
    this.createdAt = data.created_at
      ? new Date(data.created_at)
      : null;
  }

  static fromJson(json) {
    return new ReferralModel(json);
  }

  toJson() {
    return {
      referrer_id: this.referrerId,
      referred_name: this.referredName,
      referred_phone: this.referredPhone,
      referral_code: this.referralCode,
      sms_sent: this.smsSent,
      joined: this.joined,
      coupon_generated: this.couponGenerated,
    };
  }
}