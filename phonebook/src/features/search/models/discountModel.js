export class DiscountGreetingCard {
  constructor(data) {
    this.id = data.id?.toString();
    this.title = data.title || "";
    this.message = data.message || "";
    this.buttonText = data.button_text || "Claim";
    this.backgroundColor = data.background_color || "#ffffff";
    this.expiryDate = new Date(data.expiry_date);
    this.claimedAt = data.claimed_at ? new Date(data.claimed_at) : null;
  }
}