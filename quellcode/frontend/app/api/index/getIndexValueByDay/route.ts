/**
 * API Route: Retrieve Index Value for a Specific Day
 *
 * This Edge API endpoint retrieves the value of a specified index (by ID) for a specific date,
 * authenticates the request using a NextAuth JWT token, and queries a backend service.
 *
 * - Requires `date` and `id` parameters (provided as route params).
 * - Authenticates using a JWT token from the request.
 * - Fetches the index value for the specified date and ID from the backend.
 * - Returns HTTP 400 if parameters are missing, HTTP 401 if authentication fails,
 *   HTTP 502 for backend or data errors, and HTTP 500 for internal errors.
 *
 * @module api/getIndexValueByDay
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

// Use Next.js Edge Runtime for this route
export const runtime = 'edge';

/**
 * Handles GET requests to retrieve the index value for a specific day.
 *
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} context - The context object containing route parameters.
 * @param {Promise<{date: string; id: string}>} context.params - Promise resolving to the route params, specifically `date` and `id`.
 *
 * @returns {Promise<NextResponse>} - A streamed JSON response with the index value or an error response.
 */
export async function GET(request: NextRequest) {
  try {
    const token = (await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }))?.accessToken;
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/getIndexValueToday/${token}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 5 }
      }
    );
    
    // Handle backend errors
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend API error:', backendResponse.status, errorText);
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    // Proxy the backend response body directly (supports streaming)
    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 5 seconds, allow stale for 10 seconds while revalidating
        'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10'
      }
    });
    
  } catch (error) {
    // Log and return an internal server error response on failure
    console.error('Error fetching day index values:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch day index values',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}