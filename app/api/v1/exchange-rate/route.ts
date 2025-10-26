import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currency_code } = body;

    const mockResponse = {
      success: true,
      message: "Exchange rate retrieved",
      data: {
        code: 200,
        message: "Exchange rates",
        data: {
          buying_rate: 128.65,
          selling_rate: 131.25,
          quoted_rate: 129.2
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to get exchange rate" },
      { status: 500 }
    );
  }
}