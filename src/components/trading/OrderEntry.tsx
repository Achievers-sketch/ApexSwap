'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';

export function OrderEntry() {
  const { connected } = useAppContext();
  return (
    <div className="h-full p-4">
      <Tabs defaultValue="buy" className="h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
        </TabsList>
        <TabsContent value="buy" className="mt-4">
          <TradeForm side="buy" connected={connected} />
        </TabsContent>
        <TabsContent value="sell" className="mt-4">
          <TradeForm side="sell" connected={connected} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TradeForm({ side, connected }: { side: 'buy' | 'sell', connected: boolean }) {
  const { selectedPair, balances, placeOrder } = useAppContext();
  const isBuy = side === 'buy';
  const relevantBalance = isBuy ? balances[selectedPair.quote.symbol] : balances[selectedPair.base.symbol];

  const handlePlaceOrder = () => {
    placeOrder({
      pair: selectedPair,
      side,
      type: 'market',
      amount: 0.1, // Mock amount
      price: selectedPair.price,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Order Type</Label>
        <Select defaultValue="market">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market">Market</SelectItem>
            <SelectItem value="limit">Limit</SelectItem>
            <SelectItem value="stop-loss" disabled>
              Stop-Loss
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${side}-amount`}>Amount</Label>
        <Input id={`${side}-amount`} placeholder="0.00" type="number" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${side}-price`}>Price</Label>
        <Input id={`${side}-price`} value={selectedPair.price.toFixed(2)} readOnly />
      </div>

      <div className="text-sm text-muted-foreground">
        Balance: {relevantBalance.toFixed(4)}{' '}
        {isBuy ? selectedPair.quote.symbol : selectedPair.base.symbol}
      </div>

      <Button
        className="w-full"
        variant={isBuy ? 'default' : 'destructive'}
        onClick={handlePlaceOrder}
        disabled={!connected}
      >
        {connected ? (isBuy ? `Buy ${selectedPair.base.symbol}` : `Sell ${selectedPair.base.symbol}`) : 'Connect Wallet to Trade'}
      </Button>
    </div>
  );
}
