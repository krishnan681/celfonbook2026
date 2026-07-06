import useFavoritesController from "../controller/useFavoritesController";
import FavoritesView from "../components/FavoritesView";
import seoConfig from "../../../core/seo/seoConfig";
import { Helmet } from "react-helmet-async";

export default function FavoritesPage() {
  const seo = seoConfig.favorites;
  const controller = useFavoritesController();

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>

        <meta name="description" content={seo.description} />

        <link rel="canonical" href={seo.canonical} />

        <meta property="og:title" content={seo.title} />

        <meta property="og:description" content={seo.description} />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={seo.canonical} />
      </Helmet>
      <FavoritesView {...controller} />
    </>
  );
}