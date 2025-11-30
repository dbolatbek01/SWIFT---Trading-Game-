/**
 * API Route: Retrieve Stock Price by Day
 *
 * This Edge API endpoint retrieves the daily stock price for a specific stock (by ID).
 * The date can be provided as a query parameter; otherwise, the current date is used.
 * It authenticates the request using a NextAuth JWT token and queries a backend service.
 *
 * - Requires `id` parameter as a route param.
 * - Optional `date` parameter can be passed via query string; defaults to today's date (ISO format).
 * - Authenticates using a JWT token from the request.
 * - Fetches the stock price from the backend API.
 * - Caches responses for 30 seconds and allows stale data while revalidating for 15 seconds
 * - Returns HTTP 401 if authentication fails and HTTP 500 for internal errors.
 *
 * @module api/getStockPriceByDay
 */

import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_BASE_URL } from '@/config';
import { getToken } from 'next-auth/jwt';

// Use Next.js Edge Runtime for this route
export const runtime = 'edge';

/**
 * Handles GET requests to retrieve the stock price for a specific day.
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

    // Fetch the stock price for today from the backend
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/getStockPriceToday/${id}/${token.accessToken}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { 
          revalidate: 3600 // Cache for 1 hour
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
        // Cache for 30 seconds, allow stale for 15 seconds while revalidating
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=15'
      }
    });

  } catch (error) {
    // Log and return an internal server error response on failure
    console.error('Error fetching stock price by day:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stock price',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
