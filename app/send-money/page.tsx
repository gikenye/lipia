"use client"

import { useState } from "react"
import { Copy, Phone } from "lucide-react"
import { Header } from "@/components/header"
import { InputField } from "@/components/input-field"
import { Button } from "@/components/button"
import { WalletInfo } from "@/components/wallet-info"
import { WarningMessage } from "@/components/warning-message"
import { ProviderSelector } from "@/components/provider-selector"
import { validatePhoneNumber, validateAmount, calculateCUSD } from "@/lib/utils"

const PROVIDERS = [
  { id: "mpesa", name: "Safaricom", logo: "📱" },
  { id: "airtel", name: "Airtel", logo: "📡" },
]

const MIN_AMOUNT = 100
const MAX_AMOUNT = 100000
const EXCHANGE_RATE = 128.15

export default function SendMoneyPage() {
  const [selectedProvider, setSelectedProvider] = useState("mpesa")
  const [mobileNumber, setMobileNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isVerified, setIsVerified] = useState(false)
  const [walletBalance] = useState({ kes: 47.8, pyusd: 0.37 })

  const amountNum = Number.parseFloat(amount) || 0
  const pyusdAmount = calculateCUSD(amountNum, EXCHANGE_RATE)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required"
    } else if (!validatePhoneNumber(mobileNumber)) {
      newErrors.mobileNumber = "Invalid phone number format"
    }

    if (!amount) {
      newErrors.amount = "Amount is required"
    } else if (!validateAmount(amountNum, MIN_AMOUNT, MAX_AMOUNT)) {
      newErrors.amount = `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleVerify = () => {
    if (validatePhoneNumber(mobileNumber)) {
      setIsVerified(true)
    } else {
      setErrors({ mobileNumber: "Invalid phone number" })
    }
  }

  const handleContinue = () => {
    if (validateForm()) {
      console.log("Processing payment:", {
        provider: selectedProvider,
        mobileNumber,
        amount: amountNum,
        pyusd: pyusdAmount,
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="Send Money" showBack />

      <main className="px-4 py-6 pb-20">
        <div className="space-y-6">
          {/* Provider Selection */}
          <div className="relative">
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black appearance-none">
              <option>M-PESA ✓ Safaricom</option>
            </select>
          </div>

          {/* Mobile Number */}
          <div>
            <InputField
              label="Mobile number"
              value={mobileNumber}
              onChange={setMobileNumber}
              placeholder="0799770833"
              type="tel"
              icon={<Copy className="w-5 h-5" />}
              error={errors.mobileNumber}
              disabled={isVerified}
            />
            {!isVerified && (
              <button
                onClick={handleVerify}
                className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
              >
                Verify mobile
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </button>
            )}
          </div>

          {/* Amount */}
          <InputField
            label={`Amount (min ${MIN_AMOUNT} - max ${MAX_AMOUNT})`}
            value={amount}
            onChange={setAmount}
            placeholder="100"
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
          <div>
            <label className="block text-sm text-gray-600 mb-1">You will pay (PYUSD)</label>
            <div className="flex items-center gap-2">
              <img src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg" alt="PYUSD" className="w-5 h-5" />
              <p className="text-lg font-bold text-black">{pyusdAmount.toFixed(2)} PYUSD</p>
            </div>
          </div>

          {/* Continue Button */}
          <Button onClick={handleContinue} fullWidth size="lg" className="bg-green-500 hover:bg-green-600 text-white">
            Continue
          </Button>

          {/* Warning */}
          <div className="text-center">
            <p className="text-teal-600 text-sm">ⓘ Payment to wrong Recipient number is non-refundable.</p>
          </div>

          {/* Help Button */}
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Need help?</span>
              <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                <img src="/telegram-icon.svg" alt="Telegram" className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
