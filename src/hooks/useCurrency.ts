"use client";

import {
  convertUsdToNgn,
  formatNairaCustom,
  getCurrentExchangeRate,
} from "@/lib/currency";
import { useCallback, useEffect, useState } from "react";

interface CurrencyState {
  exchangeRate: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

interface CurrencyHook extends CurrencyState {
  convertToNaira: (usdAmount: number) => number;
  formatNaira: (amount: number) => string;
  refreshRate: () => Promise<void>;
}

export function useCurrency(): CurrencyHook {
  const [state, setState] = useState<CurrencyState>({
    exchangeRate: 1589.77, // fallback rate
    lastUpdated: null,
    isLoading: true,
    error: null,
  });

  const updateExchangeRate = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const rate = await getCurrentExchangeRate();

      setState({
        exchangeRate: rate,
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch exchange rate",
      }));
    }
  }, []);

  const refreshRate = useCallback(async () => {
    await updateExchangeRate();
  }, [updateExchangeRate]);

  const convertToNaira = useCallback(
    (usdAmount: number): number => {
      return usdAmount * state.exchangeRate;
    },
    [state.exchangeRate],
  );

  // Initial load
  useEffect(() => {
    updateExchangeRate();
  }, [updateExchangeRate]);

  // Set up automatic updates every hour
  useEffect(() => {
    const interval = setInterval(
      () => {
        updateExchangeRate();
      },
      60 * 60 * 1000,
    ); // 1 hour

    return () => clearInterval(interval);
  }, [updateExchangeRate]);

  return {
    ...state,
    convertToNaira,
    formatNaira: formatNairaCustom,
    refreshRate,
  };
}
