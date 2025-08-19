// pages/api/rates.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch from multiple sources
    const [coingecko, binance] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,starknet&vs_currencies=ngn'),
      fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTNGN')
    ]);

    const data = {
      coingecko: await coingecko.json(),
      binance: await binance.json(),
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rates' });
  }
}