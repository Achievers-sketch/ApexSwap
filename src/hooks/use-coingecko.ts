'use client';
import { useState, useEffect } from 'react';
import { TradingPair } from '@/lib/types';
import { initialTradingPairs } from '@/lib/data';

const API_BASE = 'https://api.coingecko.com/api/v3';

async function fetcher(url: string) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch from CoinGecko API');
    }
    return res.json();
}

export function useCoinGecko(selectedPair: TradingPair) {
    const [markets, setMarkets] = useState<any[]>([]);
    const [ohlc, setOhlc] = useState<any[]>([]);
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
    const [trades, setTrades] = useState<any[]>([]);

    // Fetch market data for all relevant coins
    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const allTokenIds = initialTradingPairs.reduce((acc, pair) => {
                    if (!acc.includes(pair.base.id)) acc.push(pair.base.id);
                    if (!acc.includes(pair.quote.id)) acc.push(pair.quote.id);
                    return acc;
                }, [] as string[]);
                
                const ids = allTokenIds.join(',');
                const data = await fetcher(`${API_BASE}/coins/markets?vs_currency=usd&ids=${ids}`);
                setMarkets(data);
            } catch (error) {
                console.error("Failed to fetch market data:", error);
            }
        };

        fetchMarkets();
        const interval = setInterval(fetchMarkets, 30000); // every 30 seconds
        return () => clearInterval(interval);
    }, []);

    // Fetch data specific to the selected pair
    useEffect(() => {
        if (!selectedPair) return;

        const fetchData = async () => {
            try {
                // OHLC (Candlestick) data for the last 7 days
                const ohlcData = await fetcher(`${API_BASE}/coins/${selectedPair.base.id}/ohlc?vs_currency=${selectedPair.quote.id}&days=7`);
                setOhlc(ohlcData);

                // Order book data
                const orderBookData = await fetcher(`${API_BASE}/coins/${selectedPair.base.id}/tickers`);
                 // Find a ticker that matches the quote currency. This is an approximation of an order book.
                 const ticker = orderBookData.tickers.find((t: any) => t.target.toLowerCase() === selectedPair.quote.symbol.toLowerCase());
                 if (ticker) {
                    // We don't get a full order book, so we'll simulate it around the current price
                    const bids = Array.from({length: 20}).map((_, i) => [ticker.last * (1 - 0.001 * (i + 1)), Math.random() * 5]);
                    const asks = Array.from({length: 20}).map((_, i) => [ticker.last * (1 + 0.001 * (i + 1)), Math.random() * 5]);
                    setOrderBook({ bids, asks });
                 }

                // Recent trades
                const tradesData = await fetcher(`${API_BASE}/coins/${selectedPair.base.id}/market_chart?vs_currency=${selectedPair.quote.id}&days=1`);
                const recentTrades = await fetcher(`${API_BASE}/coins/${selectedPair.base.id}/trades`);
                setTrades(recentTrades.tickers?.slice(0, 50) || []);

            } catch (error) {
                console.error(`Failed to fetch data for ${selectedPair.symbol}:`, error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // every 30 seconds
        return () => clearInterval(interval);

    }, [selectedPair]);

    return { markets, ohlc, orderBook, trades };
}
