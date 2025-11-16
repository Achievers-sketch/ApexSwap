'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateRandomAddress = () => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
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
  const [candlestickData, setCandlestickData] = useState<Candle[]>([]);
  const [orderBook, setOrderBook] = useState<{bids: any[], asks: any[]}>({bids: [], asks: []});
  const [recentTrades, setRecentTrades] = useState<any[]>([]);

  useEffect(() => {
    // Initial data generation
    const now = Date.now();
    const initialCandles: Candle[] = Array.from({ length: 50 }, (_, i) => {
        const open = selectedPair.price - 10 + Math.random() * 20;
        const close = open + (Math.random() - 0.5) * 5;
        const high = Math.max(open, close) + Math.random() * 3;
        const low = Math.min(open, close) - Math.random() * 3;
        return {
            time: now - (50 - i) * 60000,
            open,
            close,
            high,
            low,
            ohlc: [open, high, low, close],
            volume: 1000 + Math.random() * 2000,
        }
    });
    setCandlestickData(initialCandles);

    const generateOrderBook = () => {
        const bids = Array.from({length: 20}).map((_, i) => {
            const price = selectedPair.price - (i * 0.5) - Math.random();
            const amount = Math.random() * 5;
            return { price, amount, total: price * amount, depth: Math.random() * 100 };
        }).sort((a,b) => b.price - a.price);

        const asks = Array.from({length: 20}).map((_, i) => {
            const price = selectedPair.price + (i * 0.5) + Math.random();
            const amount = Math.random() * 5;
            return { price, amount, total: price * amount, depth: Math.random() * 100 };
        }).sort((a,b) => a.price - b.price);
        setOrderBook({bids, asks});
    }
    generateOrderBook();

    // Simulation interval
    const interval = setInterval(() => {
      setTradingPairs(prevPairs =>
        prevPairs.map(p => {
          const change = (Math.random() - 0.5) * 0.02; // up to 2% change
          const newPrice = p.price * (1 + change);
          return {
            ...p,
            price: newPrice,
            change24h: p.change24h + (change * 100),
          };
        })
      );
      
      setSelectedPair(prevPair => {
          const change = (Math.random() - 0.5) * 0.02;
          const newPrice = prevPair.price * (1 + change);
          
          setCandlestickData(prevData => {
              const lastCandle = prevData[prevData.length - 1];
              const newCandle: Candle = {
                time: Date.now(),
                open: lastCandle.close,
                close: newPrice,
                high: Math.max(lastCandle.close, newPrice) + Math.random(),
                low: Math.min(lastCandle.close, newPrice) - Math.random(),
                ohlc: [lastCandle.close, Math.max(lastCandle.close, newPrice) + Math.random(), Math.min(lastCandle.close, newPrice) - Math.random(), newPrice],
                volume: 1000 + Math.random() * 2000,
              };
              return [...prevData.slice(1), newCandle];
          });
        
          setRecentTrades(prev => [{
            price: newPrice,
            amount: Math.random() * 0.5,
            time: Date.now(),
            side: Math.random() > 0.5 ? 'buy' : 'sell'
          }, ...prev.slice(0, 19)]);
          
          generateOrderBook();

          return {...prevPair, price: newPrice, change24h: prevPair.change24h + (change * 100)}
      });

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const connectWallet = () => {
    setConnected(true);
    setWalletAddress(generateRandomAddress());
    toast({
      title: 'Wallet Connected',
      description: 'You have successfully connected your wallet.',
    });
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress('');
    toast({
      title: 'Wallet Disconnected',
    });
  };

  const selectPair = (pair: TradingPair) => {
    setSelectedPair(pair);
  };

  const placeOrder = (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    if (!connected) {
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
    connected,
    walletAddress,
    balances,
    tokens: initialTokens,
    tradingPairs,
    selectedPair,
    liquidityPools,
    openOrders,
    orderHistory,
    transactions,
    candlestickData,
    orderBook,
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
