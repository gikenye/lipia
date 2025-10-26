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

export default function BuyGoodsPage() {
  const [tillNumber, setTillNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [walletBalance, setWalletBalance] = useState({ kes: 0, pyusd: 0 })
  const [exchangeRate, setExchangeRate] = useState(0)

  const amountNum = Number.parseFloat(amount) || 0
  const pyusdAmount = exchangeRate > 0 ? calculateCUSD(amountNum, exchangeRate) : 0

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

  const handleContinue = async () => {
    if (!validateForm()) return;
    
    try {
      const response = await fetch('/api/v1/pyusd/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountNum.toString(),
          shortcode: tillNumber,
          type: "BUY_GOODS",
          mobile_network: "Safaricom",
          callback_url: `${window.location.origin}/callback`
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Payment processed! Transaction: ${result.data.data.transaction_code}`);
      } else {
        const error = result.error;
        if (error?.message === "AMOUNT_MISMATCH") {
          alert(`Amount mismatch! Expected: KES ${error.details.expected}, Provided: KES ${error.details.provided}`);
        } else {
          alert("Payment failed. Please try again.");
        }
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Pay Merchant" showBack />

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Context Section */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-purple-900 mb-2">Pay at stores and shops</h2>
          <p className="text-purple-700 text-sm">Use the merchant's till number to pay for goods and services</p>
        </div>
        
        <div className="space-y-6">
          {/* Till Number */}
          <InputField
            label="Merchant Till Number"
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
            {exchangeRate > 0 && <span className="text-gray-600">1 PYUSD = KES {exchangeRate}</span>}
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
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
          <Button onClick={handleContinue} fullWidth size="lg" className="bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg font-semibold rounded-xl">
            Pay Merchant
          </Button>
        </div>
      </main>
    </div>
  )
}
