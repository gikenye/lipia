import { Core } from "@walletconnect/core";
import { WalletKit } from "@reown/walletkit";
import type { WalletKitTypes } from "@reown/walletkit";
import type { SessionTypes } from "@walletconnect/types";

let walletKit: InstanceType<typeof WalletKit> | null = null;

/**
 * Initialize WalletKit globally
 * Must be called once at application startup
 */
export async function initializeWalletKit(): Promise<
  InstanceType<typeof WalletKit>
> {
  if (walletKit) {
    return walletKit;
  }

  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  if (!projectId) {
    throw new Error(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID environment variable is required"
    );
  }

  const core = new Core({
    projectId,
  });

  walletKit = await WalletKit.init({
    core,
    metadata: {
      name: "Lipia",
      description: "Send money to Kenya using PYUSD",
      url:
        typeof window !== "undefined"
          ? window.location.origin
          : "https://lipia.app",
      icons: [],
    },
  });

  return walletKit;
}

/**
 * Get the initialized WalletKit instance
 */
export function getWalletKit(): InstanceType<typeof WalletKit> | null {
  return walletKit;
}

/**
 * Type exports for session data
 */
export type { WalletKitTypes };
export type { SessionTypes };

/**
 * Extract account address from session namespaces
 */
export function getAccountFromSession(
  session: SessionTypes.Struct
): string | null {
  const eip155Namespace = session.namespaces["eip155"];
  if (!eip155Namespace) return null;

  const accounts = eip155Namespace.accounts || [];
  if (accounts.length === 0) return null;

  // Extract address from account string (format: "eip155:chainId:address")
  const account = accounts[0];
  const parts = account.split(":");
  return parts[2] || null;
}

/**
 * Get chain ID from account string
 */
export function getChainIdFromAccount(account: string): number | null {
  const parts = account.split(":");
  if (parts.length >= 2) {
    return parseInt(parts[1], 10);
  }
  return null;
}
