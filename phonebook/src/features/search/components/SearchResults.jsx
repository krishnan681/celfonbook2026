// import ProfileGrid from "./ProfileGrid";
// import SkeletonCard from "./SkeletonCard";

// const SearchResults = ({ results, loading }) => {
//   if (loading) {
//     return (
//       <div className="grid">
//         {[...Array(6)].map((_, i) => (
//           <SkeletonCard key={i} />
//         ))}
//       </div>
//     );
//   }

//   if (!results.length) {
//     return <p>No results found.</p>;
//   }

//   return <ProfileGrid profiles={results} />;
// };

// export default SearchResults;

import ProfileGrid from "./ProfileGrid";
import SkeletonCard from "./SkeletonCard";
import '../components/css/SearchResults.css'

const SearchResults = ({ results, loading, isKeywordFocused }) => {

  if (loading) {
    return (
      <div className="results-grid">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="no-results">
        <p>No results found for your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="results-grid">
      <ProfileGrid
        profiles={results}
        isKeywordFocused={isKeywordFocused}
      />
    </div>
  );
};

export default SearchResults;
