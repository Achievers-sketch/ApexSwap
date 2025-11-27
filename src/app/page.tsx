'use client';

import { MarketSelector } from '@/components/trading/MarketSelector';
import { OrderBook } from '@/components/trading/OrderBook';
import { OrderEntry } from '@/components/trading/OrderEntry';
import { PriceChart } from '@/components/trading/PriceChart';
import { RecentTrades } from '@/components/trading/RecentTrades';
import { UserActivity } from '@/components/trading/UserActivity';
import { Card } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

export default function TradingPage() {
  const { selectedPair } = useAppContext();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <Card className="flex-1">
          <PriceChart pair={selectedPair} />
        </Card>
        <Tabs defaultValue="order-entry" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="order-entry">Trade</TabsTrigger>
            <TabsTrigger value="order-book">Book</TabsTrigger>
            <TabsTrigger value="recent-trades">Trades</TabsTrigger>
          </TabsList>
          <TabsContent value="order-entry">
            <Card>
              <OrderEntry />
            </Card>
          </TabsContent>
          <TabsContent value="order-book">
            <Card className="h-[300px]">
              <OrderBook />
            </Card>
          </TabsContent>
          <TabsContent value="recent-trades">
            <Card className="h-[300px]">
              <RecentTrades />
            </Card>
          </TabsContent>
        </Tabs>
        <div className="h-[320px]">
          <UserActivity />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[850px] flex flex-col gap-4">
      <div className="flex-1 grid grid-cols-12 gap-4">
        {/* Left Panel */}
        <div className="col-span-12 lg:col-span-2 h-full">
          <Card className="h-full flex flex-col">
            <MarketSelector />
          </Card>
        </div>
        
        {/* Center Panel */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 h-full">
          <Card className="flex-[3_3_0%] flex flex-col">
            <PriceChart pair={selectedPair} />
          </Card>
          <Card className="flex-[2_2_0%]">
            <OrderEntry />
          </Card>
        </div>
        
        {/* Right Panel */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 h-full">
          <Card className="flex-[3_3_0%] flex flex-col">
            <OrderBook />
          </Card>
          <Card className="flex-[2_2_0%] flex flex-col">
            <RecentTrades />
          </Card>
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className="h-[320px]">
        <UserActivity />
      </div>
    </div>
  );
}
