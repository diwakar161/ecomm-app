// src/app/api/events/route.ts - Keep this file separate
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Construct the API URL with all query parameters
    const apiUrl = `https://staging-backend.thebobproject.co/api/public/v2/event/list?${searchParams.toString()}`;
    
    console.log('🔵 Forwarding to events API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': token,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Events proxy error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch events',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}