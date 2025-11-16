'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Header } from '@/components/layout/Header';
import {
  CandlestickChart,
  Wallet,
  Coins,
  BarChart,
  Landmark,
  Layers3,
  BrainCircuit,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const navItems = [
  { href: '/', label: 'Trade', icon: CandlestickChart, key: 'trade' },
  { href: '/portfolio', label: 'Portfolio', icon: Wallet, key: 'portfolio' },
  { href: '/liquidity', label: 'Liquidity', icon: Layers3, key: 'liquidity' },
  { href: '/staking', label: 'Staking', icon: Coins, key: 'staking' },
  { href: '/analytics', label: 'Analytics', icon: BarChart, key: 'analytics' },
  {
    href: '/impermanent-loss',
    label: 'IL Predictor',
    icon: BrainCircuit,
    key: 'il-predictor',
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { connected, walletAddress, disconnectWallet } = useAppContext();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Landmark className="size-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold">ApexSwap</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.key}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className: 'font-body' }}
                  >
                    <item.icon className="text-accent" />
                    <span className="font-headline tracking-wide">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          {connected && (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${walletAddress}.png`}
                    alt="User Avatar"
                  />
                  <AvatarFallback>
                    {walletAddress?.substring(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <span className="truncate font-mono text-sm font-medium">
                    {walletAddress}
                  </span>
                  <Badge
                    variant="secondary"
                    className="w-fit bg-green-500/20 text-green-400"
                  >
                    Connected
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnectWallet}>
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 bg-background p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
