"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { Header } from "@/components/header"
import { InputField } from "@/components/input-field"
import { Button } from "@/components/button"
import { WalletInfo } from "@/components/wallet-info"
import { WarningMessage } from "@/components/warning-message"
import { validateAmount, calculateCUSD } from "@/lib/utils"

const MIN_AMOUNT = 20
const MAX_AMOUNT = 100000
const EXCHANGE_RATE = 128.15

export default function BuyGoodsPage() {
  const [tillNumber, setTillNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [walletBalance] = useState({ kes: 47.8, pyusd: 0.37 })

  const amountNum = Number.parseFloat(amount) || 0
  const pyusdAmount = calculateCUSD(amountNum, EXCHANGE_RATE)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!tillNumber) {
      newErrors.tillNumber = "Till number is required"
    } else if (!/^\d{7}$/.test(tillNumber)) {
      newErrors.tillNumber = "Till number must be 7 digits"
    }

    if (!amount) {
      newErrors.amount = "Amount is required"
    } else if (!validateAmount(amountNum, MIN_AMOUNT, MAX_AMOUNT)) {
      newErrors.amount = `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      console.log("Processing buy goods:", {
        tillNumber,
        amount: amountNum,
        pyusd: pyusdAmount,
      })
    }
  }

  return (
    <div className="min-h-screen bg-(--color-background)">
      <Header title="MPESA Buy Goods" showBack />

      <main className="px-4 py-6 pb-20">
        <div className="space-y-6">
          {/* Till Number */}
          <InputField
            label="Till / Buy Goods"
            value={tillNumber}
            onChange={setTillNumber}
            placeholder="4029669"
            type="text"
            icon={<Copy className="w-5 h-5" />}
            error={errors.tillNumber}
          />

          {/* Amount */}
          <InputField
            label={`Amount (min ${MIN_AMOUNT} - max ${MAX_AMOUNT})`}
            value={amount}
            onChange={setAmount}
            placeholder="20"
            type="number"
            icon={<Copy className="w-5 h-5" />}
            error={errors.amount}
          />

          {/* Wallet Info */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-teal-600">ⓘ Wallet balance KES {walletBalance.kes}</span>
            <span className="text-gray-600">1 PYUSD = KES {EXCHANGE_RATE}</span>
          </div>

          {/* Payment Summary */}
          <div className="bg-(--color-surface) rounded-lg p-4 border border-(--color-border)">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">You will pay (PYUSD)</span>
              <div className="flex items-center gap-2">
                <img src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg" alt="PYUSD" className="w-5 h-5" />
                <span className="text-lg font-bold text-black">{pyusdAmount.toFixed(2)} PYUSD</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <WarningMessage message="Payment to wrong Till number is non-refundable." type="info" />

          {/* Continue Button */}
          <Button onClick={handleContinue} fullWidth size="lg">
            Continue
          </Button>
        </div>
      </main>
    </div>
  )
}
