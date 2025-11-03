"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Send,
  ShoppingCart,
  FileText,
  Plus,
  User,
  Settings,
  ArrowDown,
  ArrowUp,
  DollarSign,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleSignIn } from "@/components/google-signin";
import { useWallet } from "@/lib/wallet-context";

// Force dynamic rendering to avoid SSG issues
export const dynamic = "force-dynamic";

const PYUSD_ADDRESS = "0x46850aD61C2B7d64d08c9C754F45254596696984";
const ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc";

// Simple balance fetching without external libraries
async function fetchPYUSDBalance(address: string): Promise<string> {
  try {
    const response = await fetch(ARBITRUM_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_call",
        params: [
          {
            to: PYUSD_ADDRESS,
            data: `0x70a08231000000000000000000000000${address.slice(2).padStart(40, "0")}`,
          },
          "latest",
        ],
        id: 1,
      }),
    });

    const result = await response.json();
    if (result.result) {
      // Convert hex to decimal and adjust for 6 decimals (PYUSD has 6 decimals)
      const balance = BigInt(result.result);
      const balanceInUSD = Number(balance) / 1e6;
      return balanceInUSD.toFixed(2);
    }
    return "0";
  } catch (error) {
    console.error("Failed to fetch PYUSD balance:", error);
    return "0";
  }
}

export default function Dashboard() {
  const { account } = useWallet();
  const [pyusdAmount, setPyusdAmount] = useState(0);
  const [pyusdLoading, setPyusdLoading] = useState(false);

  // Fetch PYUSD balance when account changes
  useEffect(() => {
    if (account) {
      setPyusdLoading(true);
      fetchPYUSDBalance(account)
        .then((balance) => {
          setPyusdAmount(parseFloat(balance));
        })
        .finally(() => {
          setPyusdLoading(false);
        });
    } else {
      setPyusdAmount(0);
    }
  }, [account]);

  const [exchangeRate, setExchangeRate] = useState(129.2); // Default KES rate
  const kesAmount = exchangeRate > 0 ? pyusdAmount * exchangeRate : 0;

  // Fetch exchange rate on component mount
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("/api/v1/exchange-rate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currency_code: "KES" }),
        });
        const result = await response.json();
        if (result.success && result.data?.data?.quoted_rate) {
          setExchangeRate(result.data.data.quoted_rate);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const [currencyMode, setCurrencyMode] = useState<"KES" | "USD">("KES");
  const [showSignIn, setShowSignIn] = useState(false);

  // Close sign-in modal when user successfully connects
  useEffect(() => {
    if (account && showSignIn) {
      setShowSignIn(false);
    }
  }, [account, showSignIn]);

  // Only show PYUSD balance
  const tokenBalances = [
    {
      symbol: "PYUSD",
      amount: pyusdAmount,
      amountKes: kesAmount,
      icon: "https://www.paypalobjects.com/devdoc/coin-PYUSD.svg",
      color: "bg-green-100",
      loading: pyusdLoading,
    },
  ];

  const services = [
    {
      id: "send-money",
      title: "Send Money",
      icon: Send,
      href: "/send-money",
      primary: true,
    },
    {
      id: "top-up",
      title: "Add Money",
      icon: Plus,
      href: "/top-up",
    },
    {
      id: "offramp",
      title: "Cash Out",
      icon: ArrowDown,
      href: "/offramp",
    },
    {
      id: "buy-goods",
      title: "Pay Merchant",
      icon: ShoppingCart,
      href: "/buy-goods",
    },
    {
      id: "paybill",
      title: "Pay Bills",
      icon: FileText,
      href: "/paybill",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              {account ? (
                <>
                  <p className="text-sm text-gray-600">Welcome back</p>
                  <p className="font-semibold">Your Account</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600">Not signed in</p>
                  <button
                    onClick={() => setShowSignIn(true)}
                    className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
          <Link href="/settings">
            <Settings className="w-6 h-6 text-gray-400" />
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Main Balance Card */}
        <div className="relative">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-lg">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm font-medium">Total</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold">
                    {!account
                      ? "0"
                      : pyusdLoading
                        ? "Loading..."
                        : currencyMode === "KES"
                          ? `Ksh${kesAmount.toFixed(0)}`
                          : `$${pyusdAmount.toFixed(2)}`}
                  </span>
                </div>
                {/* Show secondary amount */}
                {account && !pyusdLoading && (
                  <div className="text-white/70 text-sm mt-1">
                    {currencyMode === "KES"
                      ? `≈ $${pyusdAmount.toFixed(2)} PYUSD`
                      : `≈ Ksh${kesAmount.toFixed(0)}`}
                  </div>
                )}
              </div>

              {/* Currency Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">USD</span>
                <div
                  className="relative w-12 h-6 bg-white/20 rounded-full cursor-pointer transition-all"
                  onClick={() =>
                    setCurrencyMode(currencyMode === "KES" ? "USD" : "KES")
                  }
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      currencyMode === "KES"
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm text-white font-medium">KES</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Link href="/top-up" className="flex-1">
                <Button className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium py-3 rounded-full">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
              </Link>
              <Link href="/send-money" className="flex-1">
                <Button className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium py-3 rounded-full">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </Link>
            </div>

            {/* Token Balance Cards - Only show when expanded */}
            {isExpanded && (
              <div className="space-y-3 mb-4">
                {/* PYUSD Balance Card */}
                <div className="bg-white rounded-2xl p-4 w-1/2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <Image
                      src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg"
                      alt="PYUSD"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-gray-900">
                    <p className="text-lg font-bold">
                      {pyusdLoading
                        ? "..."
                        : pyusdAmount < 0.01
                          ? "<0.01"
                          : pyusdAmount.toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-500">PYUSD</p>
                  </div>
                  {!pyusdLoading && exchangeRate > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      ≈ Ksh{kesAmount.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Exchange Rate Info */}
                {exchangeRate > 0 && (
                  <p className="text-center text-white/60 text-xs">
                    1 PYUSD = KES {exchangeRate.toFixed(2)}
                  </p>
                )}

                {/* Disclaimer */}
                <p className="text-center text-white/70 text-sm mt-4">
                  {account ? "Live blockchain data" : "Sign in to see balances"}
                </p>
              </div>
            )}
          </div>

          {/* Expand/Collapse Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg transition-all mt-4"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.id} href={service.href}>
                  <div
                    className={`p-4 rounded-xl text-center transition-all ${
                      service.primary
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-white text-gray-900 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        service.primary ? "bg-green-500" : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${service.primary ? "text-white" : "text-gray-600"}`}
                      />
                    </div>
                    <p className="font-medium text-sm">{service.title}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            {account ? (
              <>
                <p className="text-sm">No recent transactions</p>
                <p className="text-xs mt-1">Your activity will appear here</p>
              </>
            ) : (
              <>
                <p className="text-sm">Sign in to continue</p>
                <p className="text-xs mt-1">
                  Sign in to see your transaction history
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sign in to continue</h3>
              <button
                onClick={() => setShowSignIn(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Sign in to access your wallet and start sending money to Kenya
              </p>
              <GoogleSignIn />
            </div>
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
