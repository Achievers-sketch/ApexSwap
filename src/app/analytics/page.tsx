'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAppContext } from '@/context/AppContext';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function AnalyticsPage() {
  const { tradingPairs, liquidityPools } = useAppContext();

  const totalVolume = tradingPairs.reduce((acc, pair) => acc + pair.volume24h, 0);
  const totalTVL = liquidityPools.reduce((acc, pool) => acc + pool.tvl, 0);

  const volumeData = tradingPairs.map(pair => ({
    name: pair.symbol,
    volume: pair.volume24h / 1_000_000, // in millions
  })).sort((a, b) => b.volume - a.volume);

  const tvlData = liquidityPools.map(pool => ({
    name: pool.pair.symbol,
    tvl: pool.tvl / 1_000_000, // in millions
  })).sort((a,b) => b.tvl - a.tvl);

  const chartConfig = {
    volume: {
      label: 'Volume (Millions)',
      color: 'hsl(var(--primary))',
    },
    tvl: {
        label: 'TVL (Millions)',
        color: 'hsl(var(--accent))',
    }
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Platform Analytics</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Platform Volume (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+5.2% from last day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked (TVL)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${totalTVL.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">+2.1% from last day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">1,234</div>
            <p className="text-xs text-muted-foreground">+10% from last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">54,321</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Volume by Pair</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={volumeData} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis unit="$" tickFormatter={(value) => `${value}M`} />
                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="volume" fill="var(--color-volume)" radius={4} />
                 </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>TVL by Pool</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={tvlData} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis unit="$" tickFormatter={(value) => `${value}M`} />
                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="tvl" fill="var(--color-tvl)" radius={4} />
                 </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
