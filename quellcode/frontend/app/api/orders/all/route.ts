/**
 * API route to fetch all orders for the authenticated user
 *
 * Features:
 * - Uses NextAuth for authentication
 * - Runs on Edge Runtime for low latency
 * - Implements proper error handling
 *
 * @module api/orders/all
 */

import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Handles GET requests to fetch all orders for the user
 *
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} - Response with orders or error
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    if (!authToken?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch orders from backend
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/getAllOrders/${authToken.accessToken}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      }
    );

    if (!backendResponse.ok) {
      const errorDetails = await backendResponse.text();
      console.error('Backend error:', backendResponse.status, errorDetails);
      return NextResponse.json(
        {
          error: 'Backend service unavailable',
          status: backendResponse.status
        },
        { status: 502 }
      );
    }

    // Success response
    const orders = await backendResponse.json();
    return NextResponse.json(orders);

  } catch (error) {
    console.error('Order fetch failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
