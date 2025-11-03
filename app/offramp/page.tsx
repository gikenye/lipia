"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Header } from "@/components/header";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/button";

export default function OfframpPage() {
  const [txHash, setTxHash] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [disburseResult, setDisburseResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCashOut = async () => {
    if (!txHash || !recipientPhone) {
      setError("Transaction hash and phone number are required");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Step 1: Verify transaction
      const verifyResponse = await fetch("/api/v1/pyusd/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        setError(verifyData.message || "Transaction verification failed");
        return;
      }

      setVerifyResult(verifyData.data);

      // Step 2: Disburse fiat
      const disburseResponse = await fetch("/api/v1/pyusd/disburse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txHash,
          recipientPhone,
          mobileNetwork: "Safaricom",
        }),
      });

      const disburseData = await disburseResponse.json();

      if (disburseData.success) {
        setDisburseResult(disburseData.data);
      } else {
        setError(disburseData.message || "Disbursement failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Cash Out PYUSD" showBack />

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">
            Convert PYUSD to Cash
          </h2>
          <p className="text-blue-700 text-sm">
            Send PYUSD and receive M-Pesa money instantly
          </p>
        </div>

        <div className="space-y-6">
          <InputField
            label="Transaction Hash"
            value={txHash}
            onChange={setTxHash}
            placeholder="0xe10d061b0c1d6b0058be6ddbb467c18a7c40b1dc..."
            type="text"
            icon={<Copy className="w-5 h-5" />}
            error={error}
          />

          <InputField
            label="M-Pesa Number"
            value={recipientPhone}
            onChange={setRecipientPhone}
            placeholder="07xxxxxxxx"
            type="tel"
            icon={<Copy className="w-5 h-5" />}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleCashOut}
            disabled={isProcessing || !txHash || !recipientPhone}
            fullWidth
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-xl disabled:bg-gray-400"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              "Cash Out PYUSD"
            )}
          </Button>

          {verifyResult && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-3">
                ✓ Transaction Verified
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    {verifyResult.amountFormatted} PYUSD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-blue-600 font-medium">
                    {verifyResult.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Block:</span>
                  <span className="font-medium">
                    {verifyResult.blockNumber}
                  </span>
                </div>
              </div>
            </div>
          )}

          {disburseResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 mb-3">
                ✓ Disbursement Queued
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job ID:</span>
                  <span className="font-medium">{disburseResult.jobId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    {disburseResult.pyusdAmount} PYUSD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">
                    {disburseResult.status}
                  </span>
                </div>
                <p className="text-green-700 text-xs mt-2">
                  {disburseResult.message}
                </p>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Send PYUSD to our address, then enter transaction hash and phone
              number to receive M-Pesa
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
