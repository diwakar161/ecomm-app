// src/app/api/login/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Add required type field based on typical API structure
    const apiRequestBody = {
      ...body,
      type: "password" // Add the required type field
    };

    console.log('🔵 Sending to API:', apiRequestBody);
    
    const response = await fetch('https://staging-backend.thebobproject.co/api/v2/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    });

    const data = await response.json();
    console.log('🔵 API Response:', data);
    
    // Forward the response exactly as received
    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to connect to server',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}