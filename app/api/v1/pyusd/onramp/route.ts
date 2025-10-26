import { NextRequest, NextResponse } from 'next/server';

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
    const { shortcode, amount, mobile_network, recipient_address, callback_url } = body;
    
    if (!shortcode || !amount || !mobile_network || !recipient_address || !callback_url) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate mock IDs (replace with actual implementation)
    const onrampId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const collectTransactionId = crypto.randomUUID();

    const response = {
      success: true,
      message: 'PYUSD onramp initiated',
      data: {
        onrampId: "68fe124751a998f3ac819fc1",
        collectTransactionId: "e389b4d1-35b1-4656-8631-36eadd624b43",
        kesAmount: amount,
        recipientAddress: recipient_address,
        status: 'pending_collection',
        message: 'Fiat collection initiated. PYUSD will be released after payment confirmation.'
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}