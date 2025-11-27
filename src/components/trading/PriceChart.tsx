'use client';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { TradingPair } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';

const timeframes = ['1H', '4H', '1D', '1W'];

export function PriceChart({ pair }: { pair: TradingPair }) {
  const { candlestickData } = useAppContext();
  const isMobile = useIsMobile();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Time
              </span>
              <span className="font-bold text-muted-foreground">
                {new Date(data.time).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                Volume
              </span>
              <span className="font-bold text-muted-foreground">
                {data.volume.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              O: <span className="font-mono font-bold text-foreground">{data.open}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              H: <span className="font-mono font-bold text-foreground">{data.high}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              L: <span className="font-mono font-bold text-foreground">{data.low}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              C: <span className="font-mono font-bold text-foreground">{data.close}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
                <Image src={pair.base.logoURI} alt={pair.base.symbol} width={24} height={24} className="rounded-full border-2 border-background" data-ai-hint={`${pair.base.name} icon`} />
                <Image src={pair.quote.logoURI} alt={pair.quote.symbol} width={24} height={24} className="rounded-full border-2 border-background" data-ai-hint={`${pair.quote.name} icon`}/>
             </div>
            <CardTitle className="font-headline text-lg md:text-2xl">{pair.symbol}</CardTitle>
            <div>
              <div className="text-lg md:text-2xl font-bold font-mono">{pair.price.toFixed(2)}</div>
              <div
                className={cn(
                  'text-xs md:text-sm font-mono',
                  pair.change24h >= 0 ? 'text-success' : 'text-destructive'
                )}
              >
                {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
              </div>
            </div>
          </div>
          {!isMobile && (
            <div className="flex items-center gap-1 rounded-md bg-secondary p-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  variant={tf === '1D' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7"
                >
                  {tf}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 h-[250px] md:h-auto">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={candlestickData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              stroke="hsl(var(--border))"
              interval={isMobile ? 15 : 7}
            />
            <YAxis
              orientation="right"
              domain={['dataMin - 10', 'dataMax + 10']}
              tickFormatter={(price) => price.toFixed(isMobile ? 0 : 2)}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              stroke="hsl(var(--border))"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="ohlc" shape={<Candle />} barSize={isMobile ? 3 : 5}>
              {candlestickData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.open <= entry.close ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                />
              ))}
            </Bar>
            <Bar
              dataKey="volume"
              yAxisId="volume"
              barSize={isMobile ? 5: 10}
              fill="hsl(var(--primary), 0.2)"
            />
            <YAxis
              yAxisId="volume"
              orientation="left"
              domain={[0, 'dataMax * 4']}
              hide
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </>
  );
}

const Candle = (props: any) => {
  const { x, y, width, height, open, close, high, low, fill } = props;
  
  const isBullish = close >= open;
  const wickWidth = 1;
  const bodyY = isBullish ? y + height : y;
  const bodyHeight = Math.max(1, Math.abs(height));
  
  // y values are inverted, so for high wick we need to find the top of the body
  const bodyTopY = Math.min(y, y + height);
  const bodyBottomY = Math.max(y, y + height);

  return (
    <g stroke={fill} fill={fill} strokeWidth={wickWidth}>
      {/* Body */}
      <rect x={x} y={bodyY} width={width} height={bodyHeight} />
      {/* High Wick */}
      <line
        x1={x + width / 2}
        y1={bodyTopY}
        x2={x + width / 2}
        y2={bodyTopY - (high - Math.max(open, close))}
      />
      {/* Low Wick */}
       <line
        x1={x + width / 2}
        y1={bodyBottomY}
        x2={x + width / 2}
        y2={bodyBottomY + (Math.min(open, close) - low)}
      />
    </g>
  );
};
