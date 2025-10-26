import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { txHash, recipientPhone, mobileNetwork } = body;

    if (!txHash || !recipientPhone || !mobileNetwork) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Implement actual disbursement processing
    // 1. Verify transaction hash and extract PYUSD amount
    // 2. Validate recipient phone number and mobile network
    // 3. Calculate KES equivalent using current exchange rate
    // 4. Initiate M-Pesa disbursement
    // 5. Create and queue disbursement job
    // 6. Return job ID for tracking

    // TODO: Replace with actual implementation
    return NextResponse.json(
      { success: false, message: "Disbursement endpoint not implemented" },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Disbursement failed" },
      { status: 500 }
    );
  }
}
