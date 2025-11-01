"use client";

import { useState } from "react";
import { Copy, Shield } from "lucide-react";
import { Header } from "@/components/header";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/button";
import { WalletInfo } from "@/components/wallet-info";
import { WarningMessage } from "@/components/warning-message";
import { validateAmount, calculateCUSD } from "@/lib/utils";

const MIN_AMOUNT = 20;
const MAX_AMOUNT = 100000;

export default function PaybillPage() {
  const [paybillNumber, setPaybillNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [walletBalance, setWalletBalance] = useState({ kes: 0, pyusd: 0 });
  const [exchangeRate, setExchangeRate] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  const amountNum = Number.parseFloat(amount) || 0;
  const pyusdAmount =
    exchangeRate > 0 ? calculateCUSD(amountNum, exchangeRate) : 0;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!paybillNumber) {
      newErrors.paybillNumber = "Paybill number is required";
    }

    if (!accountNumber) {
      newErrors.accountNumber = "Account number is required";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (!validateAmount(amountNum, MIN_AMOUNT, MAX_AMOUNT)) {
      newErrors.amount = `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      // TODO: Replace with actual transaction hash from wallet interaction
      const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66);

      const response = await fetch("/api/v1/pyusd/pay/paybill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_hash: mockTxHash,
          shortcode: paybillNumber,
          account_number: accountNumber,
          mobile_network: "Safaricom",
          recipient_phone: "0758515833", // TODO: Get from user input or context
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus("success");
        console.log("Paybill processed successfully:", result);
      } else {
        setPaymentStatus("error");
        console.error("Paybill failed:", result.message);
      }
    } catch (error) {
      setPaymentStatus("error");
      console.error("Network error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Pay Bills" showBack />

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Context Section */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">
            Pay your bills easily
          </h2>
          <p className="text-blue-700 text-sm">
            Pay utilities, services, and other bills using your wallet balance
          </p>
        </div>

        <div className="space-y-6">
          <InputField
            label="Paybill number"
            value={paybillNumber}
            onChange={setPaybillNumber}
            placeholder="4029669"
            type="text"
            icon={<Copy className="w-5 h-5" />}
            error={errors.paybillNumber}
          />

          <InputField
            label="Account number"
            value={accountNumber}
            onChange={setAccountNumber}
            placeholder="KFE-2023-7109"
            type="text"
            icon={<Shield className="w-5 h-5" />}
            error={errors.accountNumber}
          />

          <InputField
            label={`Amount (min ${MIN_AMOUNT} - max ${MAX_AMOUNT})`}
            value={amount}
            onChange={setAmount}
            placeholder="20"
            type="number"
            icon={<Copy className="w-5 h-5" />}
            error={errors.amount}
            hint="Amount (min 20 - max 100,000)"
          />

          <div className="flex items-center gap-2 text-sm">
            <span className="text-teal-600">
              ⓘ Wallet balance KES {walletBalance.kes}
            </span>
            {exchangeRate > 0 && (
              <span className="text-gray-600">
                1 PYUSD = KES {exchangeRate}
              </span>
            )}
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">You will pay (PYUSD)</span>
              <div className="flex items-center gap-2">
                <img
                  src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg"
                  alt="PYUSD"
                  className="w-5 h-5"
                />
                <span className="text-lg font-bold text-black">
                  {pyusdAmount.toFixed(2)} PYUSD
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            fullWidth
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-xl disabled:bg-gray-400"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Pay Bill"
            )}
          </Button>

          {paymentStatus === "error" && (
            <p className="text-red-600 text-sm mt-2 text-center">
              Payment failed. Please try again.
            </p>
          )}

          {paymentStatus === "success" && (
            <p className="text-green-600 text-sm mt-2 text-center">
              Paybill payment processed successfully!
            </p>
          )}

          <WarningMessage
            message="Payment to wrong Paybill number is non-refundable."
            type="info"
          />

          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Need help?</span>
              <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                <img
                  src="/telegram-icon.svg"
                  alt="Telegram"
                  className="w-4 h-4 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
