/**
 * API Route: Retrieve Hourly Index Value
 *
 * This Edge API endpoint retrieves hourly index values for a specific datetime.
 * It authenticates the request using a NextAuth JWT token and queries a backend service.
 *
 * - Requires `dateTime` parameter (provided as route param).
 * - Authenticates using a JWT token from the request.
 * - Fetches the hourly index values from the backend API.
 * - Returns HTTP 400 if parameters are missing, HTTP 401 if authentication fails,
 *   and HTTP 500 for internal errors or backend communication issues.
 *
 * Note: Backend route is /getIndexValueByHour/{dateTime}/{token} - returns ALL indices for that hour
 *
 * @module api/getIndexValueByHour
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

// Use Next.js Edge Runtime for this route
export const runtime = 'edge';

/**
 * Handles GET requests to retrieve hourly index values.
 *
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} context - The context object containing route parameters.
 * @param {Promise<{dateTime: string}>} context.params - Promise resolving to the route params, specifically `dateTime`.
 *
 * @returns {Promise<NextResponse>} - A streamed JSON response with the index values or an error response.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ dateTime: string }> }) {
  try {
    // Parameter aus Route-Params lesen
    const { dateTime } = await params;
    const token = (await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }))?.accessToken;

    // Validate required parameters
    if (!dateTime) {
      return NextResponse.json(
        { error: 'Missing dateTime parameter' },
        { status: 400 }
      );
    }
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the hourly index values vom Backend (returns all indices)
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/getIndexValueByHour/${encodeURIComponent(dateTime)}/${token}`,
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
    console.error('Error fetching hour index values:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch hour index values',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
