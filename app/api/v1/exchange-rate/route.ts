import { NextRequest, NextResponse } from "next/server";

// Configuration for external ramps API
const RAMPS_BASE_URL = process.env.RAMPS_BASE_URL || "http://localhost:3000";
const RAMPS_API_KEY = process.env.RAMPS_API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currency_code } = body;

    // Validate currency code
    if (!currency_code) {
      return NextResponse.json(
        { success: false, message: "Currency code is required" },
        { status: 400 }
      );
    }

    // Call external ramps API for exchange rate
    const response = await fetch(`${RAMPS_BASE_URL}/api/v1/exchange-rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RAMPS_API_KEY,
      },
      body: JSON.stringify({
        currency_code: currency_code,
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
    console.error("Exchange rate API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get exchange rate" },
      { status: 500 }
    );
  }
}
