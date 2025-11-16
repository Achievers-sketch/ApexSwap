'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppContext } from '@/context/AppContext';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';

export default function LiquidityPage() {
  const { liquidityPools } = useAppContext();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Liquidity Pools</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Liquidity
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Liquidity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You have no active liquidity positions.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool</TableHead>
                <TableHead>TVL</TableHead>
                <TableHead>APY</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liquidityPools.map((pool) => (
                <TableRow key={pool.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                         <Image src={pool.pair.base.logoURI} alt={pool.pair.base.symbol} width={24} height={24} className="rounded-full border-2 border-background" data-ai-hint={`${pool.pair.base.name} icon`} />
                         <Image src={pool.pair.quote.logoURI} alt={pool.pair.quote.symbol} width={24} height={24} className="rounded-full border-2 border-background" data-ai-hint={`${pool.pair.quote.name} icon`}/>
                      </div>
                      <span className="font-medium">{pool.pair.symbol}</span>
                    </div>
                  </TableCell>
                  <TableCell className='font-mono'>
                    ${pool.tvl.toLocaleString()}
                  </TableCell>
                  <TableCell className='font-mono text-success'>{pool.apy.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Add Liquidity
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
