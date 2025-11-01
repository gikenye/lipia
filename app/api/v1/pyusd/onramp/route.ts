import { NextRequest, NextResponse } from "next/server";

// Configuration for external ramps API
const RAMPS_BASE_URL = process.env.RAMPS_BASE_URL || "http://localhost:3000";
const RAMPS_API_KEY = process.env.RAMPS_API_KEY || "your_server_api_key_here";

interface OnrampRequest {
  shortcode: string;
  amount: number;
  mobile_network: string;
  recipient_address: string;
  callback_url: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OnrampRequest = await request.json();

    // Validate required fields
    const {
      shortcode,
      amount,
      mobile_network,
      recipient_address,
      callback_url,
    } = body;

    if (
      !shortcode ||
      !amount ||
      !mobile_network ||
      !recipient_address ||
      !callback_url
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call external ramps API for KES onramp
    const response = await fetch(`${RAMPS_BASE_URL}/api/v1/pyusd/onramp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RAMPS_API_KEY,
      },
      body: JSON.stringify({
        shortcode: shortcode,
        amount: amount,
        mobile_network: mobile_network,
        recipient_address: recipient_address,
        callback_url: callback_url,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ramps API error: ${response.status}`);
    }

    const result = await response.json();

    // Return the result from ramps API
    return NextResponse.json(result);
  } catch (error) {
    console.error("Onramp API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
