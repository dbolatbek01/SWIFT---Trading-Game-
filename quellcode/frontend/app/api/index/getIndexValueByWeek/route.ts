/**
 * API Route: Retrieve Weekly Index Value
 *
 * This Edge API endpoint retrieves weekly index values for a specific index (by ID) and date.
 * It authenticates the request using a NextAuth JWT token and queries a backend service.
 *
 * - Requires `date` and `id` parameters (provided as route params).
 * - Authenticates using a JWT token from the request.
 * - Fetches the weekly index values from the backend API.
 * - Returns HTTP 400 if parameters are missing, HTTP 401 if authentication fails,
 *   and HTTP 500 for internal errors or backend communication issues.
 *
 * @module api/getIndexValueByWeek
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

// Next.js Edge Runtime
export const runtime = 'edge';

/**
 * Handles GET requests to retrieve weekly index values.
 *
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} context - The context object containing route parameters.
 * @param {Promise<{date: string; id: string}>} context.params - Promise resolving to the route params, specifically `date` and `id`.
 *
 * @returns {Promise<NextResponse>} - A streamed JSON response with the index values or an error response.
 */
export async function GET(request: NextRequest) {
  try {
    const token = (await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }))?.accessToken;
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/getIndexValueLastWeek/${token}`,
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
    console.error('Error fetching week index values:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch week index values',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
