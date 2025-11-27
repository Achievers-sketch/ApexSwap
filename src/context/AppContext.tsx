'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Token,
  TradingPair,
  Order,
  LiquidityPool,
  Transaction,
  Candle,
  AppContextType,
} from '@/lib/types';
import {
  initialTokens,
  initialTradingPairs,
  initialLiquidityPools,
} from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';
import { useCoinGecko } from '@/hooks/use-coingecko';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [balances, setBalances] = useState<{ [key: string]: number }>({
    ETH: 10,
    USDT: 10000,
    BTC: 0.5,
    SOL: 100,
    LINK: 500,
    UNI: 200,
    APEX: 1000,
  });
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>(initialTradingPairs);
  const [selectedPair, setSelectedPair] = useState<TradingPair>(tradingPairs[0]);
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>(initialLiquidityPools);
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const { markets, ohlc, orderBook, trades } = useCoinGecko(selectedPair);

  // Update trading pairs and selected pair when market data is fetched
  useEffect(() => {
    if (markets.length > 0) {
      const updatedPairs = initialTradingPairs.map(pair => {
        const marketData = markets.find(m => m.id === pair.base.id);
        if (marketData) {
          const quoteMarket = markets.find(m => m.id === pair.quote.id);
          const price = quoteMarket ? marketData.current_price / quoteMarket.current_price : marketData.current_price;
          
          return {
            ...pair,
            price: price,
            change24h: marketData.price_change_percentage_24h,
            volume24h: marketData.total_volume,
          };
        }
        return pair;
      });
      setTradingPairs(updatedPairs);

      const updatedSelectedPair = updatedPairs.find(p => p.symbol === selectedPair.symbol);
      if (updatedSelectedPair) {
        setSelectedPair(updatedSelectedPair);
      }
    }
  }, [markets, selectedPair.symbol]);

  const candlestickData = ohlc.map(d => ({
    time: d[0],
    open: d[1],
    high: d[2],
    low: d[3],
    close: d[4],
    ohlc: [d[1],d[2],d[3],d[4]] as [number,number,number,number],
    volume: 0, // ohlc data from coingecko doesn't include volume
  }));
  
  const formattedOrderBook = {
    bids: orderBook.bids.map((b: any) => ({price: b[0], amount: b[1], total: b[0] * b[1], depth: Math.random() * 100})),
    asks: orderBook.asks.map((a: any) => ({price: a[0], amount: a[1], total: a[0] * a[1], depth: Math.random() * 100})),
  };

  const recentTrades = trades.map((t: any) => ({
      price: t.price,
      amount: t.volume,
      time: new Date(t.timestamp).getTime(),
      side: t.type.toLowerCase(),
  }));

  const connectWallet = () => {
    open();
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const selectPair = useCallback((pair: TradingPair) => {
    setSelectedPair(pair);
  }, []);

  const placeOrder = (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    if (!isConnected) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please connect your wallet first.' });
      return;
    }
    const newOrder: Order = { ...order, id: Date.now().toString(), timestamp: Date.now(), status: 'open' };

    // For market orders, execute immediately
    if (newOrder.type === 'market') {
      const { base, quote } = newOrder.pair;
      if (newOrder.side === 'buy') {
        const cost = newOrder.amount * newOrder.price;
        if (balances[quote.symbol] < cost) {
          toast({ variant: 'destructive', title: 'Insufficient Funds' });
          return;
        }
        setBalances(b => ({
          ...b,
          [base.symbol]: b[base.symbol] + newOrder.amount,
          [quote.symbol]: b[quote.symbol] - cost,
        }));
      } else { // sell
        if (balances[base.symbol] < newOrder.amount) {
          toast({ variant: 'destructive', title: 'Insufficient Funds' });
          return;
        }
        setBalances(b => ({
          ...b,
          [base.symbol]: b[base.symbol] - newOrder.amount,
          [quote.symbol]: b[quote.symbol] + newOrder.amount * newOrder.price,
        }));
      }
      const executedOrder: Order = { ...newOrder, status: 'filled' };
      setOrderHistory(prev => [executedOrder, ...prev]);
      toast({ title: 'Market Order Filled' });
    } else {
      setOpenOrders(prev => [newOrder, ...prev]);
      toast({ title: 'Limit Order Placed' });
    }
  };

  const cancelOrder = (orderId: string) => {
    setOpenOrders(prev => prev.filter(o => o.id !== orderId));
    toast({ title: 'Order Cancelled' });
  };
  
  const value = {
    connected: isConnected,
    walletAddress: address ?? '',
    balances,
    tokens: initialTokens,
    tradingPairs,
    selectedPair,
    liquidityPools,
    openOrders,
    orderHistory,
    transactions,
    candlestickData,
    orderBook: formattedOrderBook,
    recentTrades,
    connectWallet,
    disconnectWallet,
    selectPair,
    placeOrder,
    cancelOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
