/**
 * API Route: Retrieve Stock Price by Hour
 *
 * This Edge API endpoint retrieves the hourly stock price for a specific stock (by ID).
 * The date and time can be provided as a query parameter; otherwise, the current time plus 2 hours is used.
 * It authenticates the request using a NextAuth JWT token and queries a backend service.
 *
 * - Requires `id` parameter as a route param.
 * - Optional `date` query parameter; defaults to local datetime +2 hours in `YYYY-MM-DD HH:mm:00` format.
 * - Authenticates using a JWT token from the request.
 * - Fetches the stock price from the backend API.
 * - Caches responses for 30 seconds and allows stale data while revalidating for 15 seconds
 * - Returns HTTP 401 if authentication fails and HTTP 500 for internal errors.
 *
 * @module api/getStockPriceByHour
 */

import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_BASE_URL } from '@/config';
import { getToken } from 'next-auth/jwt';

// Use Next.js Edge Runtime for this route
export const runtime = 'edge';

/**
 * Handles GET requests to retrieve the stock price for a specific hour.
 *
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} context - The context object containing route parameters.
 * @param {Promise<{id: string}>} context.params - Promise resolving to the route params, specifically the stock `id`.
 *
 * @returns {Promise<NextResponse>} - A streamed JSON response with the stock price or an error response.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve stock ID from route parameters
    const { id } = await params;

    // Retrieve JWT token for authentication
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // Return unauthorized if no authentication token is present
    if (!token?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the stock price for the last hour from the backend
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/getStockPriceLastHour/${id}/${token.accessToken}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { 
          revalidate: 30 // Cache for 30 seconds
        }
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
        // Cache for 5 minutes, allow stale for 2.5 minutes while revalidating
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150'
      }
    });

  } catch (error) {
    // Log and return an internal server error response on failure
    console.error('Error fetching stock price by hour:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stock price',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
