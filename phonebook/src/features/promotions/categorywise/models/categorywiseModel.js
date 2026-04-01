// models/categorywiseModel.js
export class CategorywiseProModel {
  constructor(data) {
    this.id = data.id?.toString() || '';
    this.businessName = data.business_name || '';
    this.keywords = data.keywords || '';
    this.mobileNumber = data.mobile_number || '';
    this.city = data.city || '';
  }
}