export class NearbyModel {
  constructor({
    personName,
    businessName,
    mobileNumber,
    pincode,
    isSent = false,
  }) {
    this.personName = personName;
    this.businessName = businessName;
    this.mobileNumber = mobileNumber;
    this.pincode = pincode;
    this.isSent = isSent;
  }
}