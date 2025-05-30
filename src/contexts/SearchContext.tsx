"use client";

import { products } from "@/data/products";
import type { Product } from "@/types/product";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface SearchContextType {
  searchQuery: string;
  searchResults: Product[];
  suggestions: string[];
  recentSearches: string[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  addToRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("boles_recent_searches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Generate suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const productSuggestions = products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.features.some((feature) =>
              feature.toLowerCase().includes(query),
            ) ||
            product.brand?.toLowerCase().includes(query),
        )
        .map((product) => product.name)
        .slice(0, 5);

      // Add category suggestions
      const categorySuggestions = [
        "Smart Lighting",
        "Security Cameras",
        "Smart Speakers",
        "Smart Locks",
        "Sensors & Detectors",
        "Control Panels",
      ].filter((category) => category.toLowerCase().includes(query));

      // Add feature suggestions
      const featureSuggestions = [
        "Wi-Fi connectivity",
        "Voice control",
        "Motion detection",
        "Night vision",
        "Smartphone app",
        "Zigbee compatible",
        "Bluetooth",
        "4K resolution",
      ].filter((feature) => feature.toLowerCase().includes(query));

      const allSuggestions = [
        ...productSuggestions,
        ...categorySuggestions,
        ...featureSuggestions,
      ].slice(0, 8);

      setSuggestions(allSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      const searchTerm = query.toLowerCase();
      const results = products.filter((product) => {
        // Search in product name
        if (product.name.toLowerCase().includes(searchTerm)) return true;

        // Search in description
        if (product.description.toLowerCase().includes(searchTerm)) return true;

        // Search in features
        if (
          product.features.some((feature) =>
            feature.toLowerCase().includes(searchTerm),
          )
        )
          return true;

        // Search in brand
        if (product.brand?.toLowerCase().includes(searchTerm)) return true;

        // Search in specifications
        if (
          product.specifications &&
          Object.values(product.specifications).some((spec) =>
            spec.toLowerCase().includes(searchTerm),
          )
        )
          return true;

        // Search in compatibility
        if (
          product.compatibility?.some((compat) =>
            compat.toLowerCase().includes(searchTerm),
          )
        )
          return true;

        return false;
      });

      // Sort results by relevance
      const sortedResults = results.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchTerm);
        const bNameMatch = b.name.toLowerCase().includes(searchTerm);

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;

        // Sort by rating if both match equally
        return b.rating - a.rating;
      });

      setSearchResults(sortedResults);
      setIsSearching(false);
    }, 300);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSuggestions([]);
  };

  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter((q) => q !== query)].slice(
      0,
      10,
    );
    setRecentSearches(updated);
    localStorage.setItem("boles_recent_searches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("boles_recent_searches");
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        suggestions,
        recentSearches,
        isSearching,
        setSearchQuery,
        performSearch,
        clearSearch,
        addToRecentSearches,
        clearRecentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
