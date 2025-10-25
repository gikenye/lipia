"use client"

import { Info } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface WalletInfoProps {
  kesBalance: number
  cusdBalance: number
  exchangeRate: number
}

export function WalletInfo({ kesBalance, cusdBalance, exchangeRate }: WalletInfoProps) {
  return (
    <div className="bg-(--color-surface) rounded-lg p-4 border border-(--color-border)">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-(--color-accent)" />
        <span className="text-sm text-(--color-text-secondary)">
          wallet balance {formatCurrency(kesBalance)} / {cusdBalance.toFixed(2)} cUSD
        </span>
      </div>
      <div className="text-right text-xs text-(--color-text-secondary)">1 cUSD = {formatCurrency(exchangeRate)}</div>
    </div>
  )
}
