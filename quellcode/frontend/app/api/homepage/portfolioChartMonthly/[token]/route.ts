/**
 * API Route: Retrieve Today's Portfolio Value
 *
 * This Edge API endpoint fetches the user's current portfolio value
 * by communicating with a backend service using the authenticated user's token.
 *
 * - Uses the authenticated user's access token from NextAuth
 * - Proxies the backend response directly to the client, supporting streaming
 * - Returns HTTP 401 if unauthorized, and HTTP 500 for internal errors
 *
 * @module api/portfolio/getPortfolioChartMonthly
 */

import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_BASE_URL } from '@/config';
import { getToken } from 'next-auth/jwt';

// Force dynamic rendering (not static)
export const dynamic = 'force-dynamic';
// Use Edge Runtime for lower latency
export const runtime = 'edge';

/**
 * Handles GET requests to retrieve the user's current portfolio value
 * 
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} - A streamed JSON response with portfolio value or error
 */
export const GET = async (request: NextRequest) => {
  try {
    // Get authenticated user token
    const authToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!authToken?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch current portfolio value from backend
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/chart/monthly/${authToken.accessToken}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Explicitly set revalidation for caching (5 seconds)
        next: { revalidate: 5 }
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend error:', backendResponse.status, errorText);
      throw new Error(`Backend responded with ${backendResponse.status}`);
    }

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: {
        'Content-Type': 'application/json',
        // Client-side caching (shorter duration for real-time data)
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10'
      }
    });

  } catch (error) {
    console.error('Failed to fetch today\'s portfolio value:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve today\'s portfolio value',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
};