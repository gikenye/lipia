"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { SessionTypes } from "@walletconnect/types";
import {
  initializeWalletKit,
  getWalletKit,
  getAccountFromSession,
} from "@/lib/walletconnect";

interface WalletContextType {
  account: string | null;
  session: SessionTypes.Struct | null;
  setSession: (session: SessionTypes.Struct | null) => void;
  isInitializing: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initWallet = async () => {
      try {
        await initializeWalletKit();
        setIsInitializing(false);
      } catch (error) {
        console.error("Failed to initialize WalletKit:", error);
        setIsInitializing(false);
      }
    };

    initWallet();
  }, []);

  const handleSetSession = (newSession: SessionTypes.Struct | null) => {
    setSession(newSession);
    if (newSession) {
      const accountAddress = getAccountFromSession(newSession);
      setAccount(accountAddress);
    } else {
      setAccount(null);
    }
  };

  return (
    <WalletContext.Provider
      value={{ account, session, setSession: handleSetSession, isInitializing }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
