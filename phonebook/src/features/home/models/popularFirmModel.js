export const mapPopularFirm = (row) => ({
  id: row.id,
  name: row.name,
  iconUrl: row.icon_url,
  redirectUrl: row.redirect_url,
  isActive: row.is_active,
});