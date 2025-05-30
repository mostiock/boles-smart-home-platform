"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/contexts/SearchContext";
import type { Product } from "@/types/product";
import { Clock, Search, TrendingUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchComponentProps {
  onSearchResults?: (results: Product[]) => void;
  className?: string;
}

export function SearchComponent({
  onSearchResults,
  className,
}: SearchComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const {
    searchQuery,
    suggestions,
    recentSearches,
    isSearching,
    setSearchQuery,
    performSearch,
    addToRecentSearches,
    clearRecentSearches,
  } = useSearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      performSearch(query);
      addToRecentSearches(query);
      setIsOpen(false);
      onSearchResults?.([]); // Will be updated when search completes
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = [...suggestions, ...recentSearches.slice(0, 3)];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allSuggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : allSuggestions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
          const selectedQuery = allSuggestions[selectedIndex];
          setSearchQuery(selectedQuery);
          handleSearch(selectedQuery);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearInput = () => {
    setSearchQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const showSuggestions =
    isOpen && (suggestions.length > 0 || recentSearches.length > 0);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search smart devices..."
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-20"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearInput}
              className="h-7 w-7 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="h-7 px-3 bg-[#43abc3] hover:bg-[#3a9bb5] text-white"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {/* Current Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                <TrendingUp className="h-3 w-3" />
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${suggestion}`}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors ${
                    selectedIndex === index ? "bg-[#43abc3] text-white" : ""
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              </div>
              {recentSearches.slice(0, 3).map((search, index) => {
                const adjustedIndex = suggestions.length + index;
                return (
                  <button
                    key={`recent-${search}`}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors ${
                      selectedIndex === adjustedIndex
                        ? "bg-[#43abc3] text-white"
                        : ""
                    }`}
                    onClick={() => handleSuggestionClick(search)}
                  >
                    {search}
                  </button>
                );
              })}
            </div>
          )}

          {/* Popular Categories */}
          <div className="p-2 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-2">
              Popular Categories
            </div>
            <div className="flex flex-wrap gap-1">
              {[
                "Smart Lighting",
                "Security Cameras",
                "Smart Speakers",
                "Smart Locks",
              ].map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="cursor-pointer hover:bg-[#43abc3] hover:text-white hover:border-[#43abc3] transition-colors"
                  onClick={() => handleSuggestionClick(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
