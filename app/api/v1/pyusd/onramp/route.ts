import { NextRequest, NextResponse } from "next/server";

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

    // TODO: Implement actual onramp logic
    // 1. Validate wallet address
    // 2. Create transaction record in database
    // 3. Initiate M-Pesa collection request
    // 4. Return transaction ID for status tracking

    // TODO: Replace with actual implementation
    return NextResponse.json(
      { success: false, message: "Onramp endpoint not implemented" },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
