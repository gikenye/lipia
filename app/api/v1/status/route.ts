import { NextRequest, NextResponse } from 'next/server';

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
        { success: false, message: 'Missing transaction_code' },
        { status: 400 }
      );
    }

    // Mock transaction data (replace with actual database lookup)
    const response = {
      success: true,
      message: 'Status retrieved',
      data: {
        code: 200,
        message: 'Transaction',
        data: {
          id: Math.floor(Math.random() * 100000),
          transaction_code,
          status: 'COMPLETE',
          amount: '100',
          amount_in_usd: '0.77',
          type: 'MOBILE',
          shortcode: '0758515833',
          account_number: null,
          public_name: null,
          receipt_number: Math.random().toString(36).substring(2, 12).toUpperCase(),
          category: 'COLLECTION',
          chain: 'CELO',
          asset: null,
          transaction_hash: null,
          message: 'Transaction processed successfully.',
          currency_code: 'KES',
          is_released: false,
          created_at: new Date().toISOString()
        }
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