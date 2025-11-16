'use client';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';

export function MarketSelector() {
  const { tradingPairs, selectedPair, selectPair } = useAppContext();

  return (
    <>
      <CardHeader>
        <CardTitle>Markets</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-8" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="flex border-b px-4 py-2 text-xs font-medium text-muted-foreground">
          <div className="w-2/5">Pair</div>
          <div className="w-1/5 text-right">Price</div>
          <div className="w-2/5 text-right">24h Change</div>
        </div>
        <ScrollArea className="h-[calc(100%-2.5rem)]">
          {tradingPairs.map((pair) => (
            <button
              key={pair.symbol}
              onClick={() => selectPair(pair)}
              className={cn(
                'flex w-full cursor-pointer items-center px-4 py-3 text-left text-sm transition-colors hover:bg-accent/50',
                selectedPair.symbol === pair.symbol && 'bg-accent'
              )}
            >
              <div className="flex w-2/5 items-center gap-2 font-medium">
                <div className="flex -space-x-2">
                  <Image
                    src={pair.base.logoURI}
                    alt={pair.base.symbol}
                    width={20}
                    height={20}
                    className="rounded-full"
                    data-ai-hint={`${pair.base.name} icon`}
                  />
                  <Image
                    src={pair.quote.logoURI}
                    alt={pair.quote.symbol}
                    width={20}
                    height={20}
                    className="rounded-full"
                    data-ai-hint={`${pair.quote.name} icon`}
                  />
                </div>
                <span>{pair.symbol}</span>
              </div>
              <div className="w-1/5 text-right font-mono">
                {pair.price.toFixed(2)}
              </div>
              <div
                className={cn(
                  'w-2/5 text-right font-mono',
                  pair.change24h >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {pair.change24h.toFixed(2)}%
              </div>
            </button>
          ))}
        </ScrollArea>
      </CardContent>
    </>
  );
}
