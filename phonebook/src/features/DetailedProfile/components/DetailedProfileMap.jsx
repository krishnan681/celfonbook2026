// features/DetailedProfile/components/DetailedProfileMap.jsx
import '../css/DetailedProfileMap.css'

export default function DetailedProfileMap({ address, city, pincode }) {
  const fullAddress = [address, city, pincode].filter(Boolean).join(", ");

  if (!fullAddress) {
    return <p>No address available for map.</p>;
  }

  const encoded = encodeURIComponent(fullAddress);

  return (
    <div className="pd-map-wrapper">
      <iframe
        title="Business Location"
        width="100%"
        height="450"
        style={{ border: 0 }}
        src={`https://maps.google.com/maps?q=${encoded}&output=embed`}
        allowFullScreen
      ></iframe>
    </div>
  );
}