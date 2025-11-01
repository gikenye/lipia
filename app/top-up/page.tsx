"use client"

import Link from "next/link"
import { useState } from "react"
import { Smartphone, Wallet, Copy, Check } from "lucide-react"
import { Header } from "@/components/header"
import { useActiveAccount } from "thirdweb/react"

export default function TopUpPage() {
  const activeAccount = useActiveAccount()
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (activeAccount?.address) {
      await navigator.clipboard.writeText(activeAccount.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const options = [
    {
      id: "mpesa",
      title: "M-Pesa Mobile Money",
      icon: Smartphone,
      href: "/top-up/mpesa",
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
          
          {/* Connected Wallet */}
          {activeAccount && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black text-lg">Connected Wallet</h4>
                    <p className="text-gray-600 text-sm font-mono">
                      {activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors flex items-center justify-center"
                  title="Copy wallet address"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}