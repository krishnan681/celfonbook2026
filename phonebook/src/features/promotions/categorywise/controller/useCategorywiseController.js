// import { useState } from "react";
// import { categorywiseService } from "../services/categorywiseService";

// export const useCategorywiseController = () => {
//   const [isSearching, setIsSearching] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);

//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedIndices, setSelectedIndices] = useState([]);
//   const [sentBusinessIds, setSentBusinessIds] = useState([]);

//   const [message, setMessage] = useState(
//     "I Saw Your Listing in SIGNPOST PHONE BOOK. I am Interested in your Products. Please Send Details/Call Me."
//   );

//   const [category, setCategory] = useState("");
//   const [city, setCity] = useState("");

//   const getSuggestions = (column, query) =>
//     categorywiseService.getSuggestions(column, query);

//   const search = async () => {
//     setIsSearching(true);

//     const data = await categorywiseService.searchBusinesses(category, city);

//     setSearchResults(data);
//     setSelectedIndices([]);
//     setHasSearched(true);

//     setIsSearching(false);
//   };

//   const sendSMS = () => {
//     const numbers = selectedIndices.map(
//       (i) => searchResults[i].mobile_number
//     );

//     const success = categorywiseService.sendSMS(numbers, message);

//     if (success) {
//       const sentIds = selectedIndices.map((i) => searchResults[i].id);

//       setSentBusinessIds((prev) => [...prev, ...sentIds]);
//       setSelectedIndices([]);

//       setSearchResults((prev) =>
//         [...prev].sort((a, b) => {
//           const aSent = sentIds.includes(a.id);
//           const bSent = sentIds.includes(b.id);

//           if (aSent && !bSent) return 1;
//           if (!aSent && bSent) return -1;
//           return 0;
//         })
//       );
//     }
//   };

//   const toggleSelection = (index) => {
//     setSelectedIndices((prev) =>
//       prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index]
//     );
//   };

//   const selectAll = () => {
//     if (selectedIndices.length === searchResults.length) {
//       setSelectedIndices([]);
//     } else {
//       setSelectedIndices(searchResults.map((_, i) => i));
//     }
//   };

//   const clearAll = () => {
//     setHasSearched(false);
//     setSearchResults([]);
//     setSelectedIndices([]);
//   };

//   return {
//     isSearching,
//     hasSearched,
//     searchResults,
//     selectedIndices,
//     sentBusinessIds,

//     message,
//     setMessage,
//     category,
//     setCategory,
//     city,
//     setCity,

//     getSuggestions,
//     search,
//     sendSMS,
//     toggleSelection,
//     selectAll,
//     clearAll,
//   };
// };

// controller/useCategorywiseController.js
import { useState, useRef, useCallback } from 'react';
import { CategorywiseProServices } from '../services/categorywiseService';
import { CategorywiseProModel } from '../models/categorywiseModel';

export const useCategorywiseController = () => {
  const service = new CategorywiseProServices();

  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());
  const [sentBusinessIds, setSentBusinessIds] = useState(new Set());

  const messageRef = useRef(
    "I Saw Your Listing in SIGNPOST PHONE BOOK. I am Interested in your Products. Please Send Details/Call Me."
  );
  const categoryRef = useRef('');
  const cityRef = useRef('');

  const getSuggestions = useCallback(async (column, query) => {
    return await service.getSuggestions(column, query);
  }, []);

  const getKeywordSuggestions = useCallback(async (query) => {
    if (!query?.trim()) return [];
    const result = await service.getSuggestions('keywords', query.trim());
    const unique = [...new Set(result)];
    unique.sort();
    return unique;
  }, []);

  const search = useCallback(async () => {
    setIsSearching(true);
    try {
      const data = await service.searchBusinesses(
        categoryRef.current,
        cityRef.current
      );

      const models = data.map((item) => new CategorywiseProModel(item));

      setSearchResults(models);
      setSelectedIndices(new Set());
      setHasSearched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const sendSMS = useCallback(async () => {
    const numbers = Array.from(selectedIndices).map(
      (i) => searchResults[i]?.mobileNumber
    );

    const success = await service.sendSMS(numbers, messageRef.current);

    if (success) {
      const newSent = new Set(sentBusinessIds);
      Array.from(selectedIndices).forEach((i) => {
        if (searchResults[i]) newSent.add(searchResults[i].id);
      });

      setSentBusinessIds(newSent);
      setSelectedIndices(new Set());

      // Sort: sent items move to bottom
      const sorted = [...searchResults].sort((a, b) => {
        const aSent = newSent.has(a.id);
        const bSent = newSent.has(b.id);
        if (aSent && !bSent) return 1;
        if (!aSent && bSent) return -1;
        return 0;
      });

      setSearchResults(sorted);
    }

    return success;
  }, [selectedIndices, searchResults, sentBusinessIds]);

  const toggleSelection = useCallback((index) => {
    setSelectedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIndices((prev) => {
      if (prev.size === searchResults.length) {
        return new Set();
      }
      return new Set(searchResults.map((_, i) => i));
    });
  }, [searchResults]);

  const clearAll = useCallback(() => {
    setHasSearched(false);
    setSearchResults([]);
    setSelectedIndices(new Set());
    setSentBusinessIds(new Set());
  }, []);

  return {
    isSearching,
    hasSearched,
    searchResults,
    selectedIndices,
    sentBusinessIds,
    messageRef,
    categoryRef,
    cityRef,
    getSuggestions,
    getKeywordSuggestions,
    search,
    sendSMS,
    toggleSelection,
    selectAll,
    clearAll,
  };
};