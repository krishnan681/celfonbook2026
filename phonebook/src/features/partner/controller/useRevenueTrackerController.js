// import { useState, useEffect } from "react";
// import { revenueModel } from "../models/revenueModel";

// export const useRevenueTrackerController = () => {

//   const [selectedPeriod, setSelectedPeriod] = useState("Weekly");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [customRange, setCustomRange] = useState(null);

//   const [profileId, setProfileId] = useState(null);

//   const [lifetimeStats, setLifetimeStats] = useState({
//     count: 0,
//     earn: 0
//   });

//   const [activities, setActivities] = useState([]);

//   const [loading, setLoading] = useState(true);


//   const getDateRange = () => {

//     let start;
//     let end;

//     if (selectedPeriod === "Weekly") {

//       start = new Date(selectedDate);
//       start.setHours(0,0,0,0);

//       end = new Date(selectedDate);
//       end.setHours(23,59,59,999);

//     }

//     else if (selectedPeriod === "Monthly") {

//       start = new Date(
//         selectedDate.getFullYear(),
//         selectedDate.getMonth(),
//         1
//       );

//       end = new Date(
//         selectedDate.getFullYear(),
//         selectedDate.getMonth()+1,
//         0,
//         23,59,59
//       );

//     }

//     else if (selectedPeriod === "Custom" && customRange) {

//       start = customRange.start;

//       end = new Date(customRange.end);
//       end.setHours(23,59,59,999);

//     }

//     return { start, end };
//   };


//   const formatLocalISO = (date) => {

//     return date.getFullYear() + "-" +
//       String(date.getMonth()+1).padStart(2,"0") + "-" +
//       String(date.getDate()).padStart(2,"0") +
//       "T" +
//       String(date.getHours()).padStart(2,"0") + ":" +
//       String(date.getMinutes()).padStart(2,"0") + ":" +
//       String(date.getSeconds()).padStart(2,"0");
//   };


//   const fetchData = async () => {

//     if (!profileId) return;

//     try {

//       setLoading(true);

//       const stats =
//         await revenueModel.fetchLifetimeStats(profileId);

//       setLifetimeStats(stats);

//       const { start, end } = getDateRange();

//       if (!start || !end) return;

//       const startISO = formatLocalISO(start);
//       const endISO = formatLocalISO(end);

//       const acts =
//         await revenueModel.fetchActivities(
//           profileId,
//           startISO,
//           endISO
//         );

//       setActivities(acts);

//     }

//     catch (err) {

//       console.error("Revenue fetch error:", err);

//     }

//     finally {

//       setLoading(false);

//     }

//   };


//   useEffect(() => {

//     const loadProfile = async () => {

//       const id =
//         await revenueModel.getProfileId();

//       setProfileId(id);

//     };

//     loadProfile();

//   }, []);


//   useEffect(() => {

//     fetchData();

//   }, [profileId, selectedPeriod, selectedDate, customRange]);


//   return {

//     selectedPeriod,
//     setSelectedPeriod,

//     selectedDate,
//     setSelectedDate,

//     customRange,
//     setCustomRange,

//     lifetimeStats,
//     activities,
//     loading

//   };

// };







import { useState, useEffect } from "react";
import { revenueModel } from "../models/revenueModel";

export const useRevenueTrackerController = () => {

  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customRange, setCustomRange] = useState(null);

  const [profileId, setProfileId] = useState(null);

  const [lifetimeStats, setLifetimeStats] = useState({
    count: 0,
    earn: 0
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED DATE LOGIC
  const getDateRange = () => {

    let start;
    let end;

    if (selectedPeriod === "Weekly") {

      const day = new Date(selectedDate);

      // Monday start
      const diff = day.getDate() - day.getDay() + 1;
      start = new Date(day.setDate(diff));
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    }

    else if (selectedPeriod === "Monthly") {

      start = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );

      end = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
        23, 59, 59, 999
      );
    }

    else if (selectedPeriod === "Custom" && customRange) {

      start = new Date(customRange.start);
      start.setHours(0,0,0,0);

      end = new Date(customRange.end);
      end.setHours(23,59,59,999);
    }

    return { start, end };
  };

  const fetchData = async () => {

    if (!profileId) return;

    try {

      setLoading(true);

      // ✅ lifetime from raw table
      const stats =
        await revenueModel.fetchLifetimeStats(profileId);

      setLifetimeStats(stats);

      const { start, end } = getDateRange();

      if (!start || !end) return;

      const acts =
        await revenueModel.fetchActivities(
          profileId,
          start.toISOString(),
          end.toISOString()
        );

      setActivities(acts);

    }
    catch (err) {
      console.error("Revenue fetch error:", err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const loadProfile = async () => {
      const id = await revenueModel.getProfileId();
      setProfileId(id);
    };

    loadProfile();

  }, []);

  useEffect(() => {
    fetchData();
  }, [profileId, selectedPeriod, selectedDate, customRange]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    selectedDate,
    setSelectedDate,
    customRange,
    setCustomRange,
    lifetimeStats,
    activities,
    loading
  };
};