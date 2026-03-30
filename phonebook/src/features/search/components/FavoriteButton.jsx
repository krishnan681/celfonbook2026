import { Heart } from "lucide-react";

const FavoriteButton = ({ onClick }) => {
  return (
    <button
      className="heart-btn"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e); // FIXED: forward event
      }}
      aria-label="Add to favorites"
      type="button"
    >
      <Heart size={20} />
    </button>
  );
};

export default FavoriteButton;