'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ConnectWalletButton } from './ConnectWalletButton';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="hidden text-xl font-bold font-headline md:block">
          ApexSwap
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ConnectWalletButton />
      </div>
    </header>
  );
}
