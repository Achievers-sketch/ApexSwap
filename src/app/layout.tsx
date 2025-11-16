import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { Web3ModalProvider } from '@/lib/walletconnect';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/walletconnect';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const metadata: Metadata = {
  title: 'ApexSwap | Decentralized Trading Platform',
  description:
    'A fully functional browser-based decentralized exchange (DEX) trading platform.',
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Web3ModalProvider>
              <AppProvider>
                <AppShell>{children}</AppShell>
                <Toaster />
              </AppProvider>
            </Web3ModalProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
