/**
 * API route to retrieve current bank account worth
 * 
 * This Edge API endpoint fetches the current worth of a bank account
 * using NextAuth JWT authentication and communicates with a backend service.
 * 
 * Features:
 * - Uses NextAuth for authentication
 * - Runs on Edge Runtime for low latency
 * - Returns current worth rounded to 2 decimal places
 * - Implements proper error handling and cache control
 * 
 * @module api/getCurrentWorthBankaccount
 */

import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Use Edge Runtime for better performance
export const runtime = 'edge';

/**
 * Handles GET requests to fetch current bank account worth
 * 
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} - Response with current worth or error
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

    // Fetch from backend
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/getCurrentWorthBankaccount/${authToken.accessToken}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store' // Skip cache for fresh data
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

    // Process response
    const { currentWorth } = await backendResponse.json();
    const response = NextResponse.json({
      currentWorth: Number(currentWorth?.toFixed(2) ?? 0)
    });

    // Set cache headers (1s cache, 5s stale while revalidate)
    response.headers.set(
      'Cache-Control', 
      'public, s-maxage=1, stale-while-revalidate=5'
    );
    
    return response;

  } catch (error) {
    console.error('Bank account worth fetch failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve bank account balance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}