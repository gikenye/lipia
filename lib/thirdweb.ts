import { createThirdwebClient } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";

export const client = createThirdwebClient({ 
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id" 
});

export const wallet = inAppWallet();

export async function connectWithGoogle() {
  const account = await wallet.connect({
    client,
    strategy: "google",
  });
  
  console.log("Connected as:", account?.address);
  return account;
}