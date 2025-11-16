import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StakingPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Staking & Farming</h1>
      <Card>
        <CardHeader>
          <CardTitle>Staking Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Staking pools are coming soon. Check back later to earn rewards!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
