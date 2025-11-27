export interface Token {
  id: string; // CoinGecko ID
  symbol: string;
  name: string;
  logoURI: string;
}

export interface TradingPair {
  symbol: string;
  base: Token;
  quote: Token;
  price: number;
  change24h: number;
  volume24h: number;
}

export interface Order {
  id: string;
  pair: TradingPair;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop-loss';
  amount: number;
  price: number;
  timestamp: number;
  status: 'open' | 'filled' | 'cancelled';
}

export interface LiquidityPool {
  id: string;
  pair: TradingPair;
  tvl: number;
  apy: number;
}

export interface Transaction {
  id: string;
  type: 'swap' | 'add_liquidity' | 'remove_liquidity' | 'stake' | 'unstake';
  details: string;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    ohlc: [number, number, number, number];
    volume: number;
}

export interface AppContextType {
  connected: boolean;
  walletAddress: string;
  balances: { [key: string]: number };
  tokens: Token[];
  tradingPairs: TradingPair[];
  selectedPair: TradingPair;
  liquidityPools: LiquidityPool[];
  openOrders: Order[];
  orderHistory: Order[];
  transactions: Transaction[];
  candlestickData: Candle[];
  orderBook: {bids: any[], asks: any[]};
  recentTrades: any[];
  connectWallet: () => void;
  disconnectWallet: () => void;
  selectPair: (pair: TradingPair) => void;
  placeOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => void;
  cancelOrder: (orderId: string) => void;
}
