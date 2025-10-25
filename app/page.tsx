"use client"

import { useState } from "react"
import Link from "next/link"
import { Send, ShoppingCart, FileText, Star, TrendingUp, Plus } from "lucide-react"
import dynamic from "next/dynamic"

const HomeAnimation = dynamic(() => import("@/components/home-animation"), { ssr: false })
import { ErrorBoundary } from "@/components/error-boundary"
import { Header } from "@/components/header"
import { WalletInfo } from "@/components/wallet-info"
import { Button } from "@/components/button"

export default function Dashboard() {
  const [walletBalance] = useState({
    kes: 47.8,
    pyusd: 0.37,
  })

  const exchangeRate = 128.15

  const services = [
    {
      id: "top-up",
      title: "Top up PYUSD",
      icon: Plus,
      href: "/top-up",
    },
    {
      id: "send-money",
      title: "Send Money",
      icon: Send,
      href: "/send-money",
    },
    {
      id: "buy-goods",
      title: "Buy Goods",
      icon: ShoppingCart,
      href: "/buy-goods",
    },
    {
      id: "paybill",
      title: "Paybill",
      icon: FileText,
      href: "/paybill",
    },
  ]

  return (
    <div className="min-h-screen bg-white relative">
      <HomeAnimation />
      {/* Hero Banner */}
      <div className="bg-green-800 text-white px-4 py-8 relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-yellow-400">Pay with</h2>
              <img src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg" alt="PYUSD" className="w-8 h-8" />
            </div>
          </div>
          <div className="text-4xl">📱</div>
        </div>
      </div>

      <main className="px-4 py-6 relative z-10">
        {/* Country & Balance Section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-white text-sm font-bold">$</span>
          </div>
          <span className="text-black font-medium">Kenya</span>
          <span className="text-lg">🇰🇪</span>
          <span className="ml-auto text-sm">▼</span>
        </div>

        <div className="mb-4 bg-semi-transparent rounded-lg p-4">
          <p className="text-3xl font-bold text-black">{walletBalance.kes.toFixed(1)} KES</p>
          <div className="flex items-center gap-1">
            <img src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg" alt="PYUSD" className="w-4 h-4" />
            <p className="text-gray-600">{walletBalance.pyusd.toFixed(2)} PYUSD</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 bg-semi-transparent rounded-lg p-4">
          <span className="text-teal-600 font-medium">Spend & Earn</span>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        </div>



        {/* Financial Services */}
        <div className="mb-8 bg-semi-transparent rounded-lg p-4">
          <h3 className="text-gray-600 mb-4">Financial services</h3>
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.id} href={service.href}>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center hover:shadow-lg transition-shadow">
                    <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-black font-medium">{service.title}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Help Button */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Need help?</span>
            <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
              <img src="/telegram-icon.svg" alt="Telegram" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
