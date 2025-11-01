import { NextRequest, NextResponse } from "next/server";

// Configuration for external ramps API
const RAMPS_BASE_URL = process.env.RAMPS_BASE_URL || "http://localhost:3000";
const RAMPS_API_KEY = process.env.RAMPS_API_KEY || "your_server_api_key_here";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transaction_hash,
      shortcode,
      account_number,
      mobile_network,
      recipient_phone,
      amount,
    } = body;

    if (
      !transaction_hash ||
      !shortcode ||
      !account_number ||
      !mobile_network ||
      !recipient_phone
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call external ramps API for paybill payment
    const response = await fetch(`${RAMPS_BASE_URL}/api/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RAMPS_API_KEY,
      },
      body: JSON.stringify({
        transaction_hash: transaction_hash,
        shortcode: shortcode,
        account_number: account_number,
        amount: amount,
        type: "PAYBILL",
        mobile_network: mobile_network,
        chain: "ARBITRUM",
      }),
    });

    if (!response.ok) {
      throw new Error(`Ramps API error: ${response.status}`);
    }

    const result = await response.json();

    // Return the result from ramps API
    return NextResponse.json(result);
  } catch (error) {
    console.error("Paybill API error:", error);
    return NextResponse.json(
      { success: false, message: "Paybill processing failed" },
      { status: 500 }
    );
  }
}
