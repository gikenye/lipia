"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Account } from "thirdweb/wallets";
import { ThirdwebProvider } from "thirdweb/react";
import { client } from "@/lib/thirdweb";

interface WalletContextType {
  account: Account | null;
  setAccount: (account: Account | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);

  return (
    <ThirdwebProvider>
      <WalletContext.Provider value={{ account, setAccount }}>
        {children}
      </WalletContext.Provider>
    </ThirdwebProvider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
