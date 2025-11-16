import { PredictionForm } from '@/components/impermanent-loss/PredictionForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImpermanentLossPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Impermanent Loss Predictor</h1>
        <p className="text-muted-foreground">
          Use our AI-powered tool to estimate potential impermanent loss for a liquidity position.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prediction Parameters</CardTitle>
          <CardDescription>
            Enter the details of your potential or existing liquidity position.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PredictionForm />
        </CardContent>
      </Card>
    </div>
  );
}
