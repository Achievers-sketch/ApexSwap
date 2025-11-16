'use client';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';

export function RecentTrades() {
  const { recentTrades } = useAppContext();

  return (
    <>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map((trade, i) => (
                <TableRow key={i} className="font-mono">
                  <TableCell
                    className={cn(
                      trade.side === 'buy' ? 'text-success' : 'text-destructive'
                    )}
                  >
                    {trade.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.amount.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(trade.time).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </>
  );
}
