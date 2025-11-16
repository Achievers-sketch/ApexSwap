'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

export function UserActivity() {
  const { openOrders, orderHistory, cancelOrder } = useAppContext();
  return (
    <Card className="h-full">
      <Tabs defaultValue="open-orders" className="flex h-full flex-col">
        <CardHeader className="p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="open-orders">Open Orders ({openOrders.length})</TabsTrigger>
            <TabsTrigger value="order-history">Order History</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <TabsContent value="open-orders" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pair</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.pair.symbol}</TableCell>
                      <TableCell className="capitalize">{order.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={order.side === 'buy' ? 'outline' : 'outline'}
                          className={
                            order.side === 'buy'
                              ? 'border-success text-success'
                              : 'border-destructive text-destructive'
                          }
                        >
                          {order.side}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{order.price.toFixed(2)}</TableCell>
                      <TableCell className="font-mono">{order.amount.toFixed(4)}</TableCell>
                      <TableCell className="font-mono">
                        {(order.amount * order.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => cancelOrder(order.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {openOrders.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No open orders.</p>}
            </TabsContent>
            <TabsContent value="order-history" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pair</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderHistory.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.pair.symbol}</TableCell>
                      <TableCell className="capitalize">{order.side}</TableCell>
                      <TableCell className="font-mono">{order.price.toFixed(2)}</TableCell>
                      <TableCell className="font-mono">{order.amount.toFixed(4)}</TableCell>
                      <TableCell>
                          <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(order.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {orderHistory.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No order history.</p>}
            </TabsContent>
            <TabsContent value="positions" className="m-0">
              <p className="p-4 text-center text-sm text-muted-foreground">Position management is coming soon.</p>
            </TabsContent>
          </ScrollArea>
        </CardContent>
      </Tabs>
    </Card>
  );
}
