"use client";

import { useState } from "react";
import { Copy, Phone } from "lucide-react";
import { Header } from "@/components/header";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/button";
import { WalletInfo } from "@/components/wallet-info";
import { WarningMessage } from "@/components/warning-message";
import { ProviderSelector } from "@/components/provider-selector";
import {
  validatePhoneNumber,
  validateAmount,
  calculateCUSD,
} from "@/lib/utils";

const PROVIDERS = [
  { id: "mpesa", name: "Safaricom", logo: "📱" },
  { id: "airtel", name: "Airtel", logo: "📡" },
];

const MIN_AMOUNT = 100;
const MAX_AMOUNT = 100000;

export default function SendMoneyPage() {
  const [selectedProvider, setSelectedProvider] = useState("mpesa");
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVerified, setIsVerified] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedName, setValidatedName] = useState("");
  const [walletBalance, setWalletBalance] = useState({ kes: 0, pyusd: 0 });
  const [exchangeRate, setExchangeRate] = useState(0);

  const amountNum = Number.parseFloat(amount) || 0;
  const pyusdAmount =
    exchangeRate > 0 ? calculateCUSD(amountNum, exchangeRate) : 0;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!validatePhoneNumber(mobileNumber)) {
      newErrors.mobileNumber = "Invalid phone number format";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (!validateAmount(amountNum, MIN_AMOUNT, MAX_AMOUNT)) {
      newErrors.amount = `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMobile = async (phoneNumber: string) => {
    if (!validatePhoneNumber(phoneNumber)) return;

    setIsValidating(true);
    try {
      const response = await fetch("/api/v1/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "MOBILE",
          shortcode: phoneNumber,
          mobile_network: "Safaricom",
        }),
      });

      const result = await response.json();

      if (result.success && result.data.data.status === "COMPLETE") {
        setIsVerified(true);
        setValidatedName(result.data.data.public_name);
        setErrors((prev) => ({ ...prev, mobileNumber: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          mobileNumber: "Unable to verify this number",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        mobileNumber: "Verification failed. Please try again.",
      }));
    } finally {
      setIsValidating(false);
    }
  };

  const handleMobileNumberChange = (value: string) => {
    setMobileNumber(value);
    setIsVerified(false);
    setValidatedName("");

    // Auto-validate when number is complete (10 digits)
    if (value.length === 10 && validatePhoneNumber(value)) {
      validateMobile(value);
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  const handleContinue = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      // TODO: Replace with actual transaction hash from wallet interaction
      const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66);

      const response = await fetch("/api/v1/pyusd/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_hash: mockTxHash,
          amount: amountNum,
          shortcode: mobileNumber,
          type: "MOBILE",
          mobile_network: selectedProvider === "mpesa" ? "Safaricom" : "Airtel",
          callback_url: `${window.location.origin}/api/v1/status`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus("success");
        // TODO: Navigate to success page or show success message
        console.log("Payment initiated successfully:", result);
      } else {
        setPaymentStatus("error");
        console.error("Payment failed:", result.error || result.message);
      }
    } catch (error) {
      setPaymentStatus("error");
      console.error("Payment processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Send Money" showBack />

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Context Section */}
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-green-900 mb-2">
            Send money instantly
          </h2>
          <p className="text-green-700 text-sm">
            Send money directly to any mobile number in Kenya
          </p>
        </div>

        <div className="space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mobile Network
            </label>
            <div className="bg-white border border-gray-300 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">M-Pesa</p>
                  <p className="text-sm text-gray-600">Safaricom</p>
                </div>
                <div className="ml-auto text-green-600">✓</div>
              </div>
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <InputField
              label="Mobile number"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              placeholder="0799770833"
              type="tel"
              icon={<Copy className="w-5 h-5" />}
              error={errors.mobileNumber}
              disabled={isVerified}
            />

            {/* Validation Status */}
            {isValidating && (
              <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Verifying number...
              </div>
            )}

            {isVerified && validatedName && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Verified</p>
                    <p className="text-xs">{validatedName}</p>
                  </div>
                </div>
              </div>
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
            <span className="text-teal-600">
              ⓘ Wallet balance KES {walletBalance.kes}
            </span>
            {exchangeRate > 0 && (
              <span className="text-gray-600">
                1 PYUSD = KES {exchangeRate}
              </span>
            )}
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount to send</span>
                <span className="font-semibold">
                  KES {amountNum.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">You will pay</span>
                <div className="flex items-center gap-2">
                  <img
                    src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg"
                    alt="PYUSD"
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">
                    {pyusdAmount.toFixed(2)} PYUSD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <Button
              onClick={handleContinue}
              fullWidth
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg disabled:bg-gray-400"
              disabled={isProcessing || !isVerified}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                "Send Money"
              )}
            </Button>

            {paymentStatus === "error" && (
              <p className="text-red-600 text-sm mt-2 text-center">
                Payment failed. Please try again.
              </p>
            )}

            {paymentStatus === "success" && (
              <p className="text-green-600 text-sm mt-2 text-center">
                Payment initiated successfully!
              </p>
            )}
          </div>

          {/* Warning */}
          <div className="text-center">
            <p className="text-teal-600 text-sm">
              ⓘ Payment to wrong Recipient number is non-refundable.
            </p>
          </div>

          {/* Help Button */}
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
