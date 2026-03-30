import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../../core/config/supabaseClient";
import { SearchService } from "../Service/searchService"; // ✅ import

export const useSearchController = () => {
  const [searchParams] = useSearchParams();

  const [isKeywordFocused, setIsKeywordFocused] = useState(false);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 12;
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    businessName: "",
    keywords: "",
    city: "",
    userType: "",
    primeOnly: false,
    sort: "priority",
    letter: ""
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  // ✅ Prevent duplicate logging
  const lastLoggedRef = useRef("");

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const fetchResults = useCallback(async () => {
    setLoading(true);

    let queryBuilder = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("is_admin", false);

    let searchQuery = "";
    let searchType = "default";

    if (filters.letter) {
      queryBuilder = queryBuilder.ilike(
        "business_name",
        `${filters.letter.toUpperCase()}%`
      );
      searchQuery = filters.letter;
      searchType = "letter";
    }

    else if (filters.businessName?.trim()) {
      const term = filters.businessName.trim();

      queryBuilder = queryBuilder.or(
        `business_name.ilike.%${term}%,person_name.ilike.%${term}%,keywords.ilike.%${term}%`
      );

      searchQuery = term;
      searchType = "business";
    }

    else if (filters.keywords?.trim()) {
      const term = filters.keywords.trim();

      queryBuilder = queryBuilder.ilike(
        "keywords",
        `%${term}%`
      );

      searchQuery = term;
      searchType = "keywords";
    }

    else if (filters.city?.trim()) {
      const term = filters.city.trim();

      queryBuilder = queryBuilder.ilike(
        "city",
        `%${term}%`
      );

      searchQuery = term;
      searchType = "city";
    }

    else {
      queryBuilder = queryBuilder.order("created_at", { ascending: false });
    }

    if (filters.userType) {
      queryBuilder = queryBuilder.eq("user_type", filters.userType);
    }

    if (filters.primeOnly) {
      queryBuilder = queryBuilder.eq("is_prime", true);
    }

    if (filters.sort === "priority") {
      queryBuilder = queryBuilder
        .order("is_prime", { ascending: false })
        .order("priority", { ascending: false })
        .order("normal_list", { ascending: false })
        .order("is_business", { ascending: false });
    }

    if (filters.sort === "views") {
      queryBuilder = queryBuilder.order("views", { ascending: false });
    }

    if (filters.sort === "latest") {
      queryBuilder = queryBuilder.order("created_at", { ascending: false });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    queryBuilder = queryBuilder.range(from, to);

    const { data, count, error } = await queryBuilder;

    if (error) {
      console.error("Search error:", error);
      setResults([]);
      setTotalCount(0);
    } else {
      setResults(data || []);
      setTotalCount(count || 0);

      // ✅ SAFE SEARCH LOGGING (no spam)
      const logKey = `${searchQuery}-${searchType}`;

      if (
        searchQuery &&
        searchQuery.length >= 2 &&
        lastLoggedRef.current !== logKey
      ) {
        lastLoggedRef.current = logKey;

        SearchService.logSearch(searchQuery, searchType);
      }
    }

    setLoading(false);
  }, [filters, page]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delay);
  }, [fetchResults]);

  useEffect(() => {
    const letter = searchParams.get("letter");
    const service = searchParams.get("service");

    if (letter) {
      setFilters(prev => ({ ...prev, letter }));
    }

    if (service) {
      setFilters(prev => ({
        ...prev,
        keywords: service
      }));
    }
  }, [searchParams]);

  return {
    results,
    loading,
    filters,
    setFilters,
    page,
    setPage,
    totalPages,
    totalCount,
    isKeywordFocused,
    setIsKeywordFocused
  };
};