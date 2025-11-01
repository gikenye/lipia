import { NextRequest, NextResponse } from "next/server";

// Configuration for external ramps API
const RAMPS_BASE_URL = process.env.RAMPS_BASE_URL || "http://localhost:3000";
const RAMPS_API_KEY = process.env.RAMPS_API_KEY || "your_server_api_key_here";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txHash, recipientPhone, mobileNetwork, amount } = body;

    if (!txHash || !recipientPhone || !mobileNetwork) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // For disbursement (PYUSD to KES), we use the pay endpoint
    // This represents sending KES to a mobile number from verified PYUSD
    const response = await fetch(`${RAMPS_BASE_URL}/api/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RAMPS_API_KEY,
      },
      body: JSON.stringify({
        transaction_hash: txHash,
        shortcode: recipientPhone,
        amount: amount,
        fee: Math.ceil(parseFloat(amount || "0") * 0.01).toString(), // 1% fee
        type: "MOBILE",
        mobile_network: mobileNetwork,
        chain: "ARBITRUM",
        callback_url: `${process.env.NEXTAUTH_URL}/api/callback`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ramps API error: ${response.status}`);
    }

    const result = await response.json();

    // Return the result from ramps API
    return NextResponse.json(result);
  } catch (error) {
    console.error("Disbursement API error:", error);
    return NextResponse.json(
      { success: false, message: "Disbursement failed" },
      { status: 500 }
    );
  }
}
