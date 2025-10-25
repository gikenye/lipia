"use client"

import Link from "next/link"
import { Smartphone, Coins } from "lucide-react"
import { Header } from "@/components/header"

export default function TopUpPage() {
  const options = [
    {
      id: "mpesa",
      title: "Mpesa",
      icon: Smartphone,
      href: "/top-up/mpesa",
    },
    {
      id: "crypto",
      title: "Crypto",
      icon: Coins,
      href: "/top-up/crypto",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header title="Top up PYUSD" showBack />

      <main className="px-4 py-6">
        <div className="space-y-4">
          {options.map((option) => {
            const Icon = option.icon
            return (
              <Link key={option.id} href={option.href}>
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-green-500 transition-colors cursor-pointer">
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