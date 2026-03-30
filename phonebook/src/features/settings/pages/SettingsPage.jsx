import SettingsMenu from "../components/SettingsMenu";
import "../css/settings.css";

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        <SettingsMenu />

      </div>
    </div>
  );
}