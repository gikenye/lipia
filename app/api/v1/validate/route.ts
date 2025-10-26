import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, shortcode, mobile_network } = body;

    // Mock validation - replace with actual API call
    const mockResponse = {
      success: true,
      message: "Validation completed",
      data: {
        code: 200,
        message: "Validation results",
        data: {
          status: "COMPLETE",
          shortcode: shortcode,
          public_name: "JOHNSTONE GIKENYE NJUGUNA",
          mobile_network: mobile_network || "Safaricom"
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Validation failed" },
      { status: 500 }
    );
  }
}