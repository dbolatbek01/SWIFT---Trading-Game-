/**
 * API route to delete an order
 *
 * Features:
 * - Uses NextAuth for authentication
 * - Calls backend DELETE endpoint
 * - Handles errors and returns status
 *
 * @module api/orders/delete
 */

import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Handles DELETE requests to delete an order
 *
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} - Response with success or error
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const authToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!authToken?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get orderId from request body
    const { idOrder } = await request.json();
    if (!idOrder) {
      return NextResponse.json({ error: 'Missing idOrder' }, { status: 400 });
    }

    // Call backend DELETE endpoint
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/deleteOrder/${idOrder}/${authToken.accessToken}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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
    console.error('Order deletion failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
