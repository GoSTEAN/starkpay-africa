// hooks/useExchangeRate.ts
import { useEffect, useState } from 'react';

type Rates = {
  USDT: number | null;
  USDC: number | null;
  STRK: number | null;
  NGN?: number; 
};

export default function useExchangeRates() {
  const [rates, setRates] = useState<Rates>({
    USDT: null,
    USDC: null,
    STRK: null,
    NGN: 1
  });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Example using Binance API for USDT-NGN
        const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTNGN');
        const binanceData = await binanceResponse.json();
        
        // Example using CoinGecko for other rates
        const coingeckoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,starknet&vs_currencies=ngn');
        const coingeckoData = await coingeckoResponse.json();

        setRates({
          USDT: parseFloat(binanceData.price) || coingeckoData.tether?.ngn || null,
          USDC: coingeckoData['usd-coin']?.ngn || null,
          STRK: coingeckoData.starknet?.ngn || null,
          NGN: 1
        });
      } catch (error) {
        console.error('Failed to fetch rates:', error);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 300000);

    return () => clearInterval(interval);
  }, []);

  return rates;
}