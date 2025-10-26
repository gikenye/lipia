"use client"

import Link from "next/link"
import { Smartphone, Coins } from "lucide-react"
import { Header } from "@/components/header"

export default function TopUpPage() {
  const options = [
    {
      id: "mpesa",
      title: "M-Pesa Mobile Money",
      icon: Smartphone,
      href: "/top-up/mpesa",
    },
    {
      id: "crypto",
      title: "Cryptocurrency",
      icon: Coins,
      href: "/top-up/crypto",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Add Money" showBack />

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Context Section */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">Add money to your wallet</h2>
          <p className="text-blue-700 text-sm">Choose how you'd like to add money to start sending payments</p>
        </div>
        
        <div className="space-y-4">
          {options.map((option) => {
            const Icon = option.icon
            return (
              <Link key={option.id} href={option.href}>
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-500 hover:shadow-md transition-all cursor-pointer min-h-[80px] flex items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-black text-lg">{option.title}</h4>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}