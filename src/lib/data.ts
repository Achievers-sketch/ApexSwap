import { Token, TradingPair, LiquidityPool } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

// CoinGecko IDs are used for API calls
export const initialTokens: Token[] = [
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    logoURI: getImage('eth'),
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether',
    logoURI: getImage('usdt'),
  },
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    logoURI: getImage('btc'),
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    logoURI: getImage('sol'),
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    logoURI: getImage('link'),
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap',
    logoURI: getImage('uni'),
  },
  {
    id: 'apexswap',
    symbol: 'APEX',
    name: 'ApexSwap',
    logoURI: getImage('apex'),
  },
];

const getToken = (symbol: string) =>
  initialTokens.find((t) => t.symbol === symbol)!;

export const initialTradingPairs: TradingPair[] = [
  {
    symbol: 'ETH/USDT',
    base: getToken('ETH'),
    quote: getToken('USDT'),
    price: 3500.0,
    change24h: 2.5,
    volume24h: 1500000000,
  },
  {
    symbol: 'BTC/USDT',
    base: getToken('BTC'),
    quote: getToken('USDT'),
    price: 65000.0,
    change24h: -1.2,
    volume24h: 2500000000,
  },
  {
    symbol: 'SOL/USDT',
    base: getToken('SOL'),
    quote: getToken('USDT'),
    price: 150.0,
    change24h: 5.8,
    volume24h: 800000000,
  },
  {
    symbol: 'ETH/BTC',
    base: getToken('ETH'),
    quote: getToken('BTC'),
    price: 0.053,
    change24h: 3.1,
    volume24h: 500000,
  },
  {
    symbol: 'LINK/ETH',
    base: getToken('LINK'),
    quote: getToken('ETH'),
    price: 0.005,
    change24h: -0.5,
    volume24h: 20000000,
  },
  {
    symbol: 'UNI/ETH',
    base: getToken('UNI'),
    quote: getToken('ETH'),
    price: 0.003,
    change24h: 1.5,
    volume24h: 35000000,
  },
];

export const initialLiquidityPools: LiquidityPool[] = [
  {
    id: '1',
    pair: initialTradingPairs[0],
    tvl: 50000000,
    apy: 12.5,
  },
  {
    id: '2',
    pair: initialTradingPairs[1],
    tvl: 120000000,
    apy: 8.2,
  },
  {
    id: '3',
    pair: initialTradingPairs[2],
    tvl: 35000000,
    apy: 25.1,
  },
  {
    id: '4',
    pair: initialTradingPairs[4],
    tvl: 15000000,
    apy: 18.7,
  },
  {
    id: '5',
    pair: initialTradingPairs[5],
    tvl: 22000000,
    apy: 15.3,
  },
];
