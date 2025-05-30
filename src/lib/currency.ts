interface ExchangeRate {
  usdToNgn: number;
  lastUpdated: number; // timestamp
}

interface CurrencyCache {
  rate: ExchangeRate | null;
  lastFetch: number;
}

// Cache for exchange rate to avoid too many API calls
let currencyCache: CurrencyCache = {
  rate: null,
  lastFetch: 0,
};

// Fallback rate (current rate from XE.com as of May 30, 2025)
const FALLBACK_RATE = 1589.77;

// Cache duration: 1 hour (3600000 ms)
const CACHE_DURATION = 60 * 60 * 1000;

/**
 * Fetches the current USD to NGN exchange rate from multiple sources
 */
async function fetchExchangeRate(): Promise<number> {
  try {
    // Try multiple APIs for redundancy
    const apis = [
      // Free API with CORS support
      "https://api.exchangerate-api.com/v4/latest/USD",
      // Backup API
      "https://open.er-api.com/v6/latest/USD",
    ];

    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) continue;

        const data = await response.json();
        const ngnRate = data.rates?.NGN;

        if (ngnRate && typeof ngnRate === "number" && ngnRate > 0) {
          return ngnRate;
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${apiUrl}:`, error);
      }
    }

    // If all APIs fail, use fallback
    console.warn("All exchange rate APIs failed, using fallback rate");
    return FALLBACK_RATE;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return FALLBACK_RATE;
  }
}

/**
 * Gets the current exchange rate with caching
 */
export async function getCurrentExchangeRate(): Promise<number> {
  const now = Date.now();

  // Check if we have a cached rate that's still valid
  if (currencyCache.rate && now - currencyCache.lastFetch < CACHE_DURATION) {
    return currencyCache.rate.usdToNgn;
  }

  // Fetch new rate
  const rate = await fetchExchangeRate();

  // Update cache
  currencyCache = {
    rate: {
      usdToNgn: rate,
      lastUpdated: now,
    },
    lastFetch: now,
  };

  return rate;
}

/**
 * Converts USD to NGN
 */
export async function convertUsdToNgn(usdAmount: number): Promise<number> {
  const rate = await getCurrentExchangeRate();
  return usdAmount * rate;
}

/**
 * Converts NGN to USD
 */
export async function convertNgnToUsd(ngnAmount: number): Promise<number> {
  const rate = await getCurrentExchangeRate();
  return ngnAmount / rate;
}

/**
 * Formats currency in Naira
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats currency in Naira with custom formatting
 */
export function formatNairaCustom(amount: number): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `₦${formatted}`;
}

/**
 * Gets the last update time for the exchange rate
 */
export function getLastUpdateTime(): Date | null {
  return currencyCache.rate ? new Date(currencyCache.rate.lastUpdated) : null;
}

/**
 * Forces a refresh of the exchange rate
 */
export async function refreshExchangeRate(): Promise<number> {
  currencyCache.lastFetch = 0; // Force refresh
  return await getCurrentExchangeRate();
}

/**
 * Hook for React components to get live exchange rate
 */
export function useCurrencyConverter() {
  return {
    convertUsdToNgn,
    convertNgnToUsd,
    formatNaira: formatNairaCustom,
    getCurrentRate: getCurrentExchangeRate,
    getLastUpdate: getLastUpdateTime,
    refreshRate: refreshExchangeRate,
  };
}
