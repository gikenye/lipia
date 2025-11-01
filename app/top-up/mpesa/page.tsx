"use client";

import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import { Header } from "@/components/header";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/button";
import { validatePhoneNumber } from "@/lib/utils";

export default function MpesaTopUpPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(129.2);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topUpStatus, setTopUpStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  const amountNum = Number.parseFloat(amount) || 0;
  const pyusdAmount = amountNum / exchangeRate;

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch("/api/v1/exchange-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency_code: "KES" }),
      });
      const result = await response.json();
      if (result.success) {
        setExchangeRate(result.data.data.quoted_rate);
      }
    } catch (error) {
      console.error("Failed to fetch exchange rate");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!validatePhoneNumber(mobileNumber)) {
      newErrors.mobileNumber = "Invalid phone number format";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (amountNum < 100) {
      newErrors.amount = "Minimum amount is KES 100";
    } else if (amountNum > 100000) {
      newErrors.amount = "Maximum amount is KES 100,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTopUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTopUpStatus("processing");

    try {
      // TODO: Get actual recipient address from wallet context
      const recipientAddress = "0xaB12E94861B69ff2696b8365f6a0c992A38da2c8";

      const response = await fetch("/api/v1/pyusd/onramp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shortcode: mobileNumber,
          amount: amountNum,
          mobile_network: "Safaricom",
          recipient_address: recipientAddress,
          callback_url: `${window.location.origin}/api/v1/status`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTopUpStatus("success");
        setErrors({});
        console.log("Top-up initiated successfully:", result);
      } else {
        setTopUpStatus("error");
        setErrors({
          general: result.message || "Top-up failed. Please try again.",
        });
      }
    } catch (error) {
      setTopUpStatus("error");
      setErrors({ general: "Network error. Please try again." });
      console.error("Top-up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="M-Pesa Top Up" showBack />

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-green-900 mb-2">
            Add money via M-Pesa
          </h2>
          <p className="text-green-700 text-sm">
            Send money from your M-Pesa to get PYUSD
          </p>
        </div>

        <div className="space-y-6">
          <InputField
            label="M-Pesa Number"
            value={mobileNumber}
            onChange={setMobileNumber}
            placeholder="0799770833"
            type="tel"
            icon={<Copy className="w-5 h-5" />}
            error={errors.mobileNumber}
          />

          <InputField
            label="Amount (KES)"
            value={amount}
            onChange={setAmount}
            placeholder="100"
            type="number"
            error={errors.amount}
            hint="Min: KES 100, Max: KES 100,000"
          />

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">
              You will receive
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">PYUSD Amount</span>
              <div className="flex items-center gap-2">
                <img
                  src="https://www.paypalobjects.com/devdoc/coin-PYUSD.svg"
                  alt="PYUSD"
                  className="w-5 h-5"
                />
                <span className="font-bold text-lg">
                  {pyusdAmount.toFixed(4)} PYUSD
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Rate: 1 PYUSD = KES {exchangeRate}
            </p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          <Button
            onClick={handleTopUp}
            disabled={isLoading}
            fullWidth
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-xl disabled:bg-gray-400"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Add Money"
            )}
          </Button>

          {topUpStatus === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">
                Top-up initiated successfully! Check your M-Pesa for payment
                prompt.
              </p>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              You'll receive an M-Pesa prompt to complete payment
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
