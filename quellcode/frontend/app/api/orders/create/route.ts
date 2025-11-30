/**
 * API route to create a new order (buy/sell, market/limit/stop)
 *
 * Features:
 * - Uses NextAuth for authentication
 * - Runs on Edge Runtime for low latency
 * - Implements proper error handling
 *
 * @module api/orders/create
 */

import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Handles POST requests to create a new order
 *
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} - Response with success or error
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!authToken?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get order data from request body
    const orderData = await request.json();

    // Send order to backend
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/createOrder/${authToken.accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      }
    );

    if (!backendResponse.ok) {
      const errorDetails = await backendResponse.text();
      console.error('Backend error:', backendResponse.status, errorDetails);
      return NextResponse.json(
        {
          error: 'Backend service unavailable',
          status: backendResponse.status,
        },
        { status: 502 }
      );
    }

    // Success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
