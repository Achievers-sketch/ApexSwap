'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { impermanentLossPrediction, ImpermanentLossPredictionOutput } from '@/ai/flows/impermanent-loss-prediction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  token0Amount: z.coerce.number().positive(),
  token1Amount: z.coerce.number().positive(),
  initialPriceRatio: z.coerce.number().positive(),
  currentPriceRatio: z.coerce.number().positive(),
  historicalVolatility: z.coerce.number().min(0).max(1),
});

export function PredictionForm() {
  const [prediction, setPrediction] = useState<ImpermanentLossPredictionOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token0Amount: 10,
      token1Amount: 35000,
      initialPriceRatio: 3500,
      currentPriceRatio: 3600,
      historicalVolatility: 0.1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setPrediction(null);
    try {
      const result = await impermanentLossPrediction(values);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="token0Amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token 0 Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="token1Amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token 1 Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initialPriceRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Price Ratio</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="currentPriceRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Price Ratio</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalVolatility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Volatility (0.0 to 1.0)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Predict Impermanent Loss
          </Button>
        </form>
      </Form>

      {loading && (
         <div className="mt-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">AI is running calculations...</p>
         </div>
      )}

      {prediction && (
        <Card className="mt-8 bg-background/50">
          <CardHeader>
            <CardTitle>Prediction Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <CardDescription>Estimated Impermanent Loss</CardDescription>
              <p className="text-2xl font-bold font-mono text-destructive">
                ${prediction.impermanentLoss.toFixed(2)}
              </p>
            </div>
            <div>
              <CardDescription>Explanation</CardDescription>
              <p className="text-sm text-muted-foreground">
                {prediction.explanation}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
