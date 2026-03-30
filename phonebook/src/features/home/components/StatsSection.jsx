import { useEffect, useState } from "react";
import "../pages/css/stats.css";

export default function StatsSection() {

  const statsData = [
    {
      id: 1,
      number: 80000,
      suffix: "+",
      label: "MSME Businesses Listed",
      icon: "🏭"
    },
    {
      id: 2,
      number: 10000,
      suffix: "+",
      label: "Industries & Categories",
      icon: "📂"
    },
    {
      id: 3,
      number: 5000,
      suffix: "+",
      label: "Daily Searches",
      icon: "🔍"
    }
  ];

  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {

    const intervals = statsData.map((stat, index) => {

      const increment = Math.ceil(stat.number / 100);

      return setInterval(() => {

        setCounts(prev => {

          const updated = [...prev];

          if (updated[index] < stat.number) {
            updated[index] += increment;

            if (updated[index] > stat.number) {
              updated[index] = stat.number;
            }
          }

          return updated;

        });

      }, 20);

    });

    return () => intervals.forEach(clearInterval);

  }, []);

  return (
    <section className="stats-section">

      <div className="stats-container">

        {statsData.map((stat, index) => (

          <div key={stat.id} className="stats-card">

            <div className="stats-icon">{stat.icon}</div>

            <h2 className="stats-number">
              {counts[index].toLocaleString()}
              {stat.suffix}
            </h2>

            <p className="stats-label">{stat.label}</p>

          </div>

        ))}

      </div>

    </section>
  );
}