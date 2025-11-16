'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

export default function PortfolioPage() {
  const { balances, tokens, tradingPairs } = useAppContext();
  
  const portfolioData = Object.entries(balances)
    .map(([symbol, amount]) => {
      const pair = tradingPairs.find(p => p.base.symbol === symbol && p.quote.symbol === 'USDT');
      const price = pair ? pair.price : symbol === 'USDT' ? 1 : 0;
      const value = amount * price;
      return { symbol, amount, value, price };
    })
    .filter(asset => asset.value > 0.01);

  const portfolioValue = portfolioData.reduce((acc, asset) => acc + asset.value, 0);

  const chartData = portfolioData.map(asset => ({
    name: asset.symbol,
    value: asset.value,
  }));

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    '#f59e0b',
    '#10b981',
  ];

  const chartConfig = Object.fromEntries(
    chartData.map((d, i) => [
      d.name,
      { label: d.name, color: COLORS[i % COLORS.length] },
    ])
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Portfolio</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono">
              ${portfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <div className="text-muted-foreground">Total portfolio value</div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioData.map(({symbol, amount, value, price}) => {
                 const token = tokens.find(t => t.symbol === symbol);
                 if (amount <= 0) return null;

                 return (
                  <TableRow key={symbol}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {token && <Image src={token.logoURI} alt={token.name} width={32} height={32} data-ai-hint={`${token.name} icon`} className="rounded-full" />}
                        <div>
                          <div className="font-medium">{token?.name}</div>
                          <div className="text-muted-foreground">{symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{amount.toFixed(4)}</TableCell>
                     <TableCell className="font-mono">${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    <TableCell className="text-right font-mono">${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  </TableRow>
                 )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
