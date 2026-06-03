export const mapOnlineDirectory = (row) => ({
  id: row.id,
  title: row.title,
  city: row.city,
  imageUrl: row.image_url,
  isActive: row.is_active,
});