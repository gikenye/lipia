import { NextRequest, NextResponse } from "next/server";

interface StatusRequest {
  transaction_code: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: StatusRequest = await request.json();

    // Validate required fields
    const { transaction_code } = body;

    if (!transaction_code) {
      return NextResponse.json(
        { success: false, message: "Missing transaction_code" },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database lookup
    // Query transaction status from database using transaction_code
    // const transaction = await db.transactions.findByCode(transaction_code);

    // TODO: Return actual transaction status from database
    return NextResponse.json(
      { success: false, message: "Status endpoint not implemented" },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
