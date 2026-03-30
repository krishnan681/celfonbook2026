import useFavoritesController from "../controller/useFavoritesController";
import FavoritesView from "../components/FavoritesView";

export default function FavoritesPage() {
  const controller = useFavoritesController();

  return <FavoritesView {...controller} />;
}