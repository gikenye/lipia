"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, ShoppingCart, FileText, Plus, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [walletBalance] = useState({
    kes: 47.8,
    pyusd: 0.37,
  });

  const services = [
    {
      id: "send-money",
      title: "Send Money",
      icon: Send,
      href: "/send-money",
      primary: true
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
    <div className="min-h-screen bg-gray-50">
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
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm">Your Balance</p>
              <p className="text-3xl font-bold">{walletBalance.kes.toFixed(1)} KES</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <img src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg" alt="PYUSD" className="w-5 h-5" />
                <span className="text-green-100">{walletBalance.pyusd.toFixed(2)} PYUSD</span>
              </div>
              <p className="text-xs text-green-200 mt-1">≈ $0.37 USD</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇰🇪</span>
            <span className="text-green-100">Kenya</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.id} href={service.href}>
                  <div className={`p-4 rounded-xl text-center transition-all ${
                    service.primary 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-white text-gray-900 shadow-sm hover:shadow-md'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      service.primary ? 'bg-green-500' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${service.primary ? 'text-white' : 'text-gray-600'}`} />
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