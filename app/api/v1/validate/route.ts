import { NextRequest, NextResponse } from "next/server";

// Configuration for external ramps API
const RAMPS_BASE_URL = process.env.RAMPS_BASE_URL || "http://localhost:3000";
const RAMPS_API_KEY = process.env.RAMPS_API_KEY || "your_server_api_key_here";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, shortcode, mobile_network, account_number } = body;

    if (!type || !shortcode || !mobile_network) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare request body for ramps API
    const requestBody: any = {
      type: type,
      shortcode: shortcode,
      mobile_network: mobile_network,
    };

    // Add account_number for paybill validation
    if (type === "PAYBILL" && account_number) {
      requestBody.account_number = account_number;
    }

    // Call external ramps API for validation
    const response = await fetch(`${RAMPS_BASE_URL}/api/v1/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RAMPS_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Ramps API error: ${response.status}`);
    }

    const result = await response.json();

    // Return the result from ramps API
    return NextResponse.json(result);
  } catch (error) {
    console.error("Validation API error:", error);
    return NextResponse.json(
      { success: false, message: "Validation failed" },
      { status: 500 }
    );
  }
}
