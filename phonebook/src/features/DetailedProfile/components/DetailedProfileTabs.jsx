// features/DetailedProfile/components/DetailedProfileTabs.jsx
import '../css/DetailedProfileTabs.css'

export default function DetailedProfileTabs({ activeTab, onChange }) {
  const tabs = ["about", "products", "map"];

  return (
    <div className="pd-tabs-bar">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={activeTab === tab ? "active" : ""}
          onClick={() => onChange(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}