"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { WalletKitTypes } from "@reown/walletkit";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/wallet-context";
import { getWalletKit } from "@/lib/walletconnect";

export function GoogleSignIn() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { account, setSession } = useWallet();
  const router = useRouter();

  useEffect(() => {
    const setupSessionHandler = async () => {
      const walletKit = getWalletKit();
      if (!walletKit) return;

      // Listen for session proposals
      walletKit.on(
        "session_proposal",
        async (proposal: WalletKitTypes.SessionProposal) => {
          try {
            const { id, params } = proposal;

            // Build approved namespaces
            const approvedNamespaces = buildApprovedNamespaces({
              proposal: params,
              supportedNamespaces: {
                eip155: {
                  chains: ["eip155:1", "eip155:42161"], // Ethereum & Arbitrum
                  methods: [
                    "eth_sendTransaction",
                    "eth_signTransaction",
                    "personal_sign",
                    "eth_sign",
                    "eth_signTypedData",
                    "eth_signTypedData_v4",
                  ],
                  events: ["chainChanged", "accountsChanged"],
                  accounts: [
                    "eip155:1:0x0000000000000000000000000000000000000000",
                    "eip155:42161:0x0000000000000000000000000000000000000000",
                  ],
                },
              },
            });

            // Approve the session
            const session = await walletKit.approveSession({
              id,
              namespaces: approvedNamespaces,
            });

            // Update context with session (type assertion due to pnpm version differences)
            setSession(session as any); // Redirect to dashboard
            setTimeout(() => router.push("/dashboard"), 1000);
          } catch (error) {
            console.error("Failed to approve session:", error);
            await walletKit.rejectSession({
              id: proposal.id,
              reason: getSdkError("USER_REJECTED"),
            });
          }
        }
      );
    };

    setupSessionHandler();
  }, [setSession, router]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Get WC URI from query parameters or show QR code
      const params = new URLSearchParams(window.location.search);
      const wcUri = params.get("uri");

      if (wcUri) {
        // Pair with the provided URI
        const walletKit = getWalletKit();
        if (walletKit) {
          await walletKit.pair({ uri: wcUri });
        }
      } else {
        // In a real app, you would generate a QR code or show a modal for manual entry
        console.log(
          "No WalletConnect URI provided. Show QR scanner or manual entry UI."
        );
      }
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (account) {
    return (
      <div className="text-center p-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-green-600 font-semibold mb-1">
          Successfully connected!
        </p>
        <p className="text-sm text-gray-500">
          {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
