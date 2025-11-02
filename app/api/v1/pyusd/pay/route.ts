import { NextRequest, NextResponse } from "next/server";

// Configuration for external ramps API
const RAMPS_BASE_URL = process.env.RAMPS_BASE_URL;
const RAMPS_API_KEY = process.env.RAMPS_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Validate required environment variables
    if (!RAMPS_BASE_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error: RAMPS_BASE_URL not found",
        },
        { status: 500 }
      );
    }

    if (!RAMPS_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error: RAMPS_API_KEY not found",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      transaction_hash,
      amount,
      shortcode,
      type,
      mobile_network,
      callback_url,
    } = body;

    if (
      !transaction_hash ||
      !amount ||
      !shortcode ||
      !type ||
      !mobile_network
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call external ramps API for mobile payment
    const response = await fetch(`${RAMPS_BASE_URL}/api/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RAMPS_API_KEY,
      },
      body: JSON.stringify({
        transaction_hash: transaction_hash,
        shortcode: shortcode,
        amount: amount,
        fee: Math.ceil(parseFloat(amount) * 0.01).toString(), // 1% fee
        type: type,
        mobile_network: mobile_network,
        chain: "ARBITRUM",
        callback_url:
          callback_url || `${process.env.NEXTAUTH_URL}/api/callback`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ramps API error: ${response.status}`);
    }

    const result = await response.json();

    // Return the result from ramps API
    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json(
      { success: false, message: "Payment processing failed" },
      { status: 500 }
    );
  }
}
