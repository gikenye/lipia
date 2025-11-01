import { NextRequest, NextResponse } from "next/server";

// Configuration for external ramps API
const RAMPS_BASE_URL = process.env.RAMPS_BASE_URL || "http://localhost:3000";
const RAMPS_API_KEY = process.env.RAMPS_API_KEY;

if (!RAMPS_API_KEY) {
  throw new Error("RAMPS_API_KEY environment variable is required");
}

interface OnrampRequest {
  shortcode: string;
  amount: number;
  mobile_network: string;
  recipient_address: string;
  callback_url: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate required environment variables
    if (!RAMPS_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error: API key not found",
        },
        { status: 500 }
      );
    }
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
      signal: AbortSignal.timeout(30000),
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
