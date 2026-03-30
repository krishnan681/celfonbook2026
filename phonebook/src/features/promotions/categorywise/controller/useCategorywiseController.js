import { useState } from "react";
import { categorywiseService } from "../services/categorywiseService";

export const useCategorywiseController = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [sentBusinessIds, setSentBusinessIds] = useState([]);

  const [message, setMessage] = useState(
    "I Saw Your Listing in SIGNPOST PHONE BOOK. I am Interested in your Products. Please Send Details/Call Me."
  );

  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const getSuggestions = (column, query) =>
    categorywiseService.getSuggestions(column, query);

  const search = async () => {
    setIsSearching(true);

    const data = await categorywiseService.searchBusinesses(category, city);

    setSearchResults(data);
    setSelectedIndices([]);
    setHasSearched(true);

    setIsSearching(false);
  };

  const sendSMS = () => {
    const numbers = selectedIndices.map(
      (i) => searchResults[i].mobile_number
    );

    const success = categorywiseService.sendSMS(numbers, message);

    if (success) {
      const sentIds = selectedIndices.map((i) => searchResults[i].id);

      setSentBusinessIds((prev) => [...prev, ...sentIds]);
      setSelectedIndices([]);

      setSearchResults((prev) =>
        [...prev].sort((a, b) => {
          const aSent = sentIds.includes(a.id);
          const bSent = sentIds.includes(b.id);

          if (aSent && !bSent) return 1;
          if (!aSent && bSent) return -1;
          return 0;
        })
      );
    }
  };

  const toggleSelection = (index) => {
    setSelectedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const selectAll = () => {
    if (selectedIndices.length === searchResults.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(searchResults.map((_, i) => i));
    }
  };

  const clearAll = () => {
    setHasSearched(false);
    setSearchResults([]);
    setSelectedIndices([]);
  };

  return {
    isSearching,
    hasSearched,
    searchResults,
    selectedIndices,
    sentBusinessIds,

    message,
    setMessage,
    category,
    setCategory,
    city,
    setCity,

    getSuggestions,
    search,
    sendSMS,
    toggleSelection,
    selectAll,
    clearAll,
  };
};