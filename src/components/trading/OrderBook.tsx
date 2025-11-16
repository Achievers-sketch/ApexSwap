'use client';

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

export function OrderBook() {
  const { orderBook, selectedPair } = useAppContext();

  const formatNumber = (num: number) =>
    num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 text-xs flex flex-col">
        <div className="flex px-4 py-2 font-medium text-muted-foreground">
          <div className="w-1/3">Price ({selectedPair.quote.symbol})</div>
          <div className="w-1/3 text-right">
            Amount ({selectedPair.base.symbol})
          </div>
          <div className="w-1/3 text-right">Total</div>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col-reverse">
            {orderBook.asks.map((order, i) => (
              <div
                key={i}
                className="relative flex items-center px-4 py-1.5 font-mono"
              >
                <div
                  className="absolute right-0 top-0 h-full bg-destructive/10"
                  style={{ width: `${order.depth}%` }}
                />
                <div className="z-10 w-1/3 text-destructive">
                  {formatNumber(order.price)}
                </div>
                <div className="z-10 w-1/3 text-right">{order.amount.toFixed(4)}</div>
                <div className="z-10 w-1/3 text-right">
                  {formatNumber(order.total)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="px-4 py-2">
          <Separator />
          <div className="py-2 text-center text-lg font-bold text-foreground">
            {selectedPair.price.toFixed(2)}
          </div>
          <Separator />
        </div>
        <ScrollArea className="flex-1">
           {orderBook.bids.map((order, i) => (
            <div
              key={i}
              className="relative flex items-center px-4 py-1.5 font-mono"
            >
              <div
                className="absolute right-0 top-0 h-full bg-success/10"
                style={{ width: `${order.depth}%` }}
              />
              <div className="z-10 w-1/3 text-success">
                {formatNumber(order.price)}
              </div>
              <div className="z-10 w-1/3 text-right">{order.amount.toFixed(4)}</div>
              <div className="z-10 w-1/3 text-right">
                {formatNumber(order.total)}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </>
  );
}
