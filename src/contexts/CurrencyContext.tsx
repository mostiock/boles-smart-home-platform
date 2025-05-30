"use client";

import { useCurrency } from "@/hooks/useCurrency";
import React, { createContext, useContext, type ReactNode } from "react";

interface CurrencyContextType {
  exchangeRate: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  convertToNaira: (usdAmount: number) => number;
  formatNaira: (amount: number) => string;
  refreshRate: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const currencyData = useCurrency();

  return (
    <CurrencyContext.Provider value={currencyData}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrencyContext(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error(
      "useCurrencyContext must be used within a CurrencyProvider",
    );
  }
  return context;
}
