import { NextRequest, NextResponse } from "next/server";

// Configuration for external ramps API
const RAMPS_BASE_URL = process.env.RAMPS_BASE_URL || "http://localhost:3000";
const RAMPS_API_KEY = process.env.RAMPS_API_KEY || "your_server_api_key_here";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txHash } = body;

    if (!txHash) {
      return NextResponse.json(
        { success: false, message: "Transaction hash is required" },
        { status: 400 }
      );
    }

    // Call external ramps API for PYUSD transaction verification
    const response = await fetch(`${RAMPS_BASE_URL}/api/v1/pyusd/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RAMPS_API_KEY,
      },
      body: JSON.stringify({
        txHash: txHash,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ramps API error: ${response.status}`);
    }

    const result = await response.json();

    // Return the result from ramps API
    return NextResponse.json(result);
  } catch (error) {
    console.error("Verification API error:", error);
    return NextResponse.json(
      { success: false, message: "Transaction verification failed" },
      { status: 500 }
    );
  }
}
