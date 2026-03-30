import "../css/DetailedProfileProducts.css";

export default function DetailedProfileProducts({
  priorityProducts,
  loading,
}) {
  if (loading) {
    return (
      <div className="dpp-wrapper">
        <p className="dpp-status-text">Loading products...</p>
      </div>
    );
  }

  if (!priorityProducts?.length) {
    return (
      <div className="dpp-wrapper">
        <p className="dpp-status-text">No products listed yet.</p>
      </div>
    );
  }

  return (
    <div className="dpp-wrapper">
      <div className="dpp-grid">
        {priorityProducts.map((p) => (
          <div key={p.id} className="dpp-card">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="dpp-image"
              />
            ) : (
              <div className="dpp-no-image">No Image</div>
            )}

            <div className="dpp-content">
              <h5 className="dpp-title">{p.name}</h5>

              <p className="dpp-description">
                {p.description || "No description available"}
              </p>

              {p.price && (
                <span className="dpp-price">₹{p.price}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}