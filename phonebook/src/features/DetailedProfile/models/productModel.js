export const mapProduct = (map) => ({
  id: String(map.id),
  profileId: String(map.profile_id),
  name: map.product_name ?? "",
  image: map.product_image ?? "",
  description: map.product_description ?? "",
  price: map.price ?? "",
});