"use client";

import type { Product } from "@/types/product";
import { type ReactNode, createContext, useContext, useState } from "react";

interface ComparisonContextType {
  comparedProducts: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  isComparisonOpen: boolean;
  toggleComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined,
);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const addToComparison = (product: Product) => {
    if (comparedProducts.length >= 4) {
      // Remove the first product if we have 4 already
      setComparedProducts((prev) => [...prev.slice(1), product]);
    } else if (!comparedProducts.find((p) => p.id === product.id)) {
      setComparedProducts((prev) => [...prev, product]);
    }
  };

  const removeFromComparison = (productId: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearComparison = () => {
    setComparedProducts([]);
  };

  const isInComparison = (productId: string) => {
    return comparedProducts.some((p) => p.id === productId);
  };

  const toggleComparison = () => {
    setIsComparisonOpen((prev) => !prev);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparedProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        isComparisonOpen,
        toggleComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
