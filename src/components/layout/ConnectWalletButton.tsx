'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Wallet } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const walletOptions = [
  { name: 'MetaMask', id: 'metamask' },
  { name: 'WalletConnect', id: 'walletconnect' },
  { name: 'Coinbase Wallet', id: 'coinbase' },
  { name: 'Trust Wallet', id: 'trustwallet' },
];

const getWalletImage = (id: string) => PlaceHolderImages.find(img => img.id === id);


export function ConnectWalletButton() {
  const { connected, connectWallet, walletAddress } = useAppContext();

  if (connected) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-3 py-2">
        <Wallet className="h-5 w-5 text-primary" />
        <span className="font-mono text-sm font-medium text-primary-foreground">
          {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
        </span>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect a wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {walletOptions.map((wallet) => {
            const walletImage = getWalletImage(wallet.id);
            return (
              <Button
                key={wallet.name}
                variant="outline"
                className="flex items-center justify-start gap-4 text-lg"
                onClick={() => connectWallet()}
              >
                {walletImage && (
                  <Image
                    src={walletImage.imageUrl}
                    alt={wallet.name}
                    width={28}
                    height={28}
                    data-ai-hint={walletImage.imageHint}
                  />
                )}
                {wallet.name}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
