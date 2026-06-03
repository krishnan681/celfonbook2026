// // src/features/home/components/DirectorySection.jsx

// import React from "react";
// import { useHomeController } from "../controller/useHomeController";
// import "../pages/css/DirectorySection.css";

// const DirectorySection = () => {
//   const { onlineDirectories, expos, popularFirms, loading, error } =
//     useHomeController();

//   if (loading) {
//     return (
//       <section className="directory-section py-5 text-center">
//         <div className="container">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3">
//             Loading directories, expos and popular firms...
//           </p>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="directory-section py-5 text-center">
//         <div className="container">
//           <p className="text-danger">{error}</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="directory-section py-5">
//       <div className="container">
//         {/* ==================== ONLINE DIRECTORY ==================== */}
//         <div className="mb-5">
//           <h2 className="section-title text-center mb-4">Online Directory</h2>

//           <div className="row g-4 justify-content-center">
//             {onlineDirectories.length > 0 ? (
//               onlineDirectories.map((dir) => (
//                 <div className="col-lg-4 col-md-6" key={dir.id}>
//                   <div
//                     className="directory-card"
//                     style={{
//                       backgroundImage: dir.image_url
//                         ? `url(${dir.image_url})`
//                         : "linear-gradient(135deg, #0d6efd, #0056b3)",
//                     }}
//                   >
//                     <div className="card-content">
//                       {/* <h3>{dir.city || "City"}</h3> */}

//                       <h4>{dir.title || "Directory"}</h4>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-12 text-center">
//                 <p>No directories available at the moment.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ==================== EXPO DIARY ==================== */}
//         <div className="mb-5">
//           <h2 className="section-title text-center mb-4">Expo Diary</h2>

//           <div className="row g-4 justify-content-center">
//             {expos.length > 0 ? (
//               expos.map((expo) => (
//                 <div className="col-lg-5 col-md-6" key={expo.id}>
//                   <div className="expo-card">
//                     {expo.expo_image && (
//                       <img
//                         src={expo.expo_image}
//                         alt={expo.expo_name}
//                         className="expo-image"
//                       />
//                     )}

//                     <div className="expo-content">
//                       <h3>{expo.expo_name}</h3>

//                       {expo.expo_edition && (
//                         <p className="expo-edition">{expo.expo_edition}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-12 text-center">
//                 <p>No expos available at the moment.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ==================== POPULAR FIRMS ==================== */}
//         <div>
//           <h2 className="section-title text-center mb-4">Popular Firms</h2>

//           <div className="row g-4 justify-content-center">
//             {popularFirms.length > 0 ? (
//               popularFirms.map((firm) => (
//                 <div className="col-lg-4 col-md-6 col-sm-6" key={firm.id}>
//                   <a
//                     href={firm.redirect_url || "#"}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="firm-card-link"
//                   >
//                     <div className="firm-card">
//                       <div className="firm-logo">
//                         {firm.icon_url ? (
//                           <img
//                             src={firm.icon_url}
//                             alt={firm.name}
//                             className="firm-icon"
//                           />
//                         ) : (
//                           <span className="logo-placeholder">🏢</span>
//                         )}
//                       </div>

//                       <h5>{firm.name}</h5>

//                       {firm.redirect_url && (
//                         <span className="visit-text">
//                           {/* Visit Website → */}
//                         </span>
//                       )}
//                     </div>
//                   </a>
//                 </div>
//               ))
//             ) : (
//               <div className="col-12 text-center">
//                 <p>No popular firms available.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DirectorySection;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useHomeController } from "../controller/useHomeController";
import "../pages/css/DirectorySection.css";

const DirectorySection = () => {
  const navigate = useNavigate();

  const { onlineDirectories, expos, popularFirms, loading, error } =
    useHomeController();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="directory-section py-5">
      <div className="container">
        <h2 className="section-title text-center mb-4">Online Directory</h2>

        <div className="row g-4 justify-content-center">
          {onlineDirectories.map((dir) => (
            <div className="col-lg-4 col-md-6" key={dir.id}>
              <div
                className="directory-card clickable-card"
                onClick={() =>
                  navigate(`/search?city=${encodeURIComponent(dir.city)}`)
                }
                style={{
                  backgroundImage: dir.image_url
                    ? `url(${dir.image_url})`
                    : "linear-gradient(135deg,#0d6efd,#0056b3)",
                }}
              >
                <div className="card-content">
                  <h4>{dir.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        {expos.length > 0 ? (
          expos.map((expo) => (
            <div className="col-lg-5 col-md-6" key={expo.id}>
              <div
                className="expo-card clickable-card"
                onClick={() => navigate(`/search?expo_id=${expo.id}`)}
              >
                {expo.expo_image && (
                  <img
                    src={expo.expo_image}
                    alt={expo.expo_name}
                    className="expo-image"
                  />
                )}

                <div className="expo-content">
                  <h3>{expo.expo_name}</h3>

                  {expo.expo_edition && (
                    <p className="expo-edition">{expo.expo_edition}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No expos available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DirectorySection;
