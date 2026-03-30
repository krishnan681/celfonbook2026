import "../css/history.css";

export default function SearchHistory() {

  const history = [
    "Electrician in Chennai",
    "Plumber near me",
    "Steel suppliers",
    "Car repair shops"
  ];

  return (

    <div className="history-page">

      <h2>Search History</h2>

      <ul className="history-list">

        {history.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}

      </ul>

    </div>

  );
}