"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function Dashboard() {
  const [walletBalance] = useState({
    kes: 48,
    pyusd: 0.37,
  });

  const [isExpanded, setIsExpanded] = useState(true);
  const [currencyMode, setCurrencyMode] = useState<"KES" | "USD">("KES");

  const tokenBalances = [
    {
      symbol: "cUSD",
      amount: 0.37,
      icon: "💵",
      color: "bg-green-100",
    },
    {
      symbol: "USDT",
      amount: 0.01,
      icon: "🟢",
      color: "bg-blue-100",
    },
    {
      symbol: "USDC",
      amount: 0.01,
      icon: "🔵",
      color: "bg-blue-100",
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
              <p className="text-sm text-gray-600">Welcome back</p>
              <p className="font-semibold">Your Account</p>
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
                    Ksh{walletBalance.kes}
                  </span>
                </div>
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
                <div className="grid grid-cols-2 gap-3">
                  {tokenBalances.slice(0, 2).map((token, index) => (
                    <div
                      key={token.symbol}
                      className="bg-white rounded-2xl p-4"
                    >
                      <div
                        className={`w-8 h-8 ${token.color} rounded-full flex items-center justify-center mb-2`}
                      >
                        <span className="text-sm">{token.icon}</span>
                      </div>
                      <div className="text-gray-900">
                        <p className="text-lg font-bold">
                          {token.amount < 0.01
                            ? "<0.01"
                            : token.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">{token.symbol}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Third token card (full width) */}
                <div className="bg-white rounded-2xl p-4 w-1/2">
                  <div
                    className={`w-8 h-8 ${tokenBalances[2].color} rounded-full flex items-center justify-center mb-2`}
                  >
                    <span className="text-sm">{tokenBalances[2].icon}</span>
                  </div>
                  <div className="text-gray-900">
                    <p className="text-lg font-bold">
                      {tokenBalances[2].amount < 0.01
                        ? "<0.01"
                        : tokenBalances[2].amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tokenBalances[2].symbol}
                    </p>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-center text-white/70 text-sm mt-4">
                  KES amounts are approximates
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
          <div className="grid grid-cols-2 gap-4">
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
            <p className="text-sm">No recent transactions</p>
            <p className="text-xs mt-1">Your activity will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
