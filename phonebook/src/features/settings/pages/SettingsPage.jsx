import SettingsMenu from "../components/SettingsMenu";
import "../css/settings.css";
import seoConfig from "../../../core/seo/seoConfig";
import { Helmet } from "react-helmet-async";

export default function SettingsPage() {
  const seo = seoConfig.settings;
  return (
    <div className="settings-page">
      <Helmet>
        <title>{seo.title}</title>

        <meta name="description" content={seo.description} />

        <link rel="canonical" href={seo.canonical} />

        <meta property="og:title" content={seo.title} />

        <meta property="og:description" content={seo.description} />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={seo.canonical} />
      </Helmet>
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        <SettingsMenu />
      </div>
    </div>
  );
}
