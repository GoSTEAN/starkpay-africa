import { useEffect, useState } from 'react';

type Rates = {
  USDT: number | null;
  USDC: number | null;
  STRK: number | null;
};

const API_ENDPOINTS = {
  COINGECKO: 'https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,starknet&vs_currencies=usd'
};

const REFETCH_INTERVAL = 60000; // 1 minute
const MAX_RETRIES = 5;
const BASE_BACKOFF = 1000;

export default function useExchangeRates() {
  const [rates, setRates] = useState<Rates>({
    USDT: 1,    // Fallback rate (USD base)
    USDC: 1,    // Fallback rate (USD base)
    STRK: 0.4   // Fallback rate (USD base)
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    if (retryCount >= MAX_RETRIES) {
      setError('Maximum retry attempts reached');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.COINGECKO, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const newRates = {
        USDT: data.tether?.usd || rates.USDT,
        USDC: data['usd-coin']?.usd || rates.USDC,
        STRK: data.starknet?.usd || rates.STRK
      };

      setRates(newRates);
      setLastUpdated(new Date());
      setRetryCount(0);
      setError(null);
    } catch (err) {
      console.error('Rate fetch error:', err);
      setRetryCount(prev => prev + 1);
      setError('Failed to fetch exchange rates');
      
      // Keep fallback rates if API fails
      if (rates.USDT === null) {
        setRates({
          USDT: 1,
          USDC: 1,
          STRK: 0.4
        });
      }
    }
  };

  useEffect(() => {
    // Immediate first fetch
    fetchRates();

    // Set up interval with exponential backoff
    const interval = setInterval(
      fetchRates,
      retryCount > 0 
        ? Math.min(BASE_BACKOFF * 2 ** retryCount, 300000)
        : REFETCH_INTERVAL
    );

    return () => clearInterval(interval);
  }, [retryCount]);

  return {
    rates,
    lastUpdated,
    isPending: !lastUpdated && retryCount === 0,
    error,
    retryCount
  };
}