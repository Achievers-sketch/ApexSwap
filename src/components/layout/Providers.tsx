'use client';
import { Web3ModalProvider } from '@/lib/walletconnect';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/walletconnect';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
