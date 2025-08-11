// hooks/useExchangeRate.ts
import { useEffect, useState } from 'react';

type Rates = {
  USDT: number | null;
  USDC: number | null;
  STRK: number | null;
};

const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,usd-token,starknet&vs_currencies=ngn'
};

const REFETCH_INTERVAL = 60000; // 1 minute

export default function useExchangeRates() {
  const [rates, setRates] = useState<Rates>({
    USDT: 1650, // Fallback rate
    USDC: 1650, // Fallback rate
    STRK: 800   // Fallback rate
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRates = async () => {
    try {
      const coingeckoRes = await fetch(API_ENDPOINTS.COINGECKO);

      if (!coingeckoRes.ok) {
        throw new Error('API request failed');
      }

      const coingeckoData = await coingeckoRes.json();

      setRates({
        USDT: coingeckoData.tether?.ngn || 1650,
        USDC: coingeckoData['usd-coin']?.ngn || 1650,
        STRK: coingeckoData.starknet?.ngn || 800
      });
      setLastUpdated(new Date());
      setRetryCount(0);
    } catch (error) {
      console.error('Rate fetch error:', error);
      setRetryCount(prev => prev + 1);
      
      // Keep fallback rates if API fails
      if (rates.USDT === null) {
        setRates({
          USDT: 1650,
          USDC: 1650,
          STRK: 800
        });
      }
    }
  };

  useEffect(() => {
    // Immediate first fetch
    fetchRates();

    // Set up interval with exponential backoff for retries
    const interval = setInterval(
      fetchRates,
      retryCount > 0 ? Math.min(1000 * 2 ** retryCount, 300000) : REFETCH_INTERVAL
    );

    return () => clearInterval(interval);
  }, [retryCount]);

  return {
    rates,
    lastUpdated,
    isPending: rates.USDT === null && retryCount === 0,
    error: retryCount > 3 ? 'Failed to load rates after multiple attempts' : null,
    retryCount
  };
}
