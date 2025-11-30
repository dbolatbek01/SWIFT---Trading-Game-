/**
 * API Route: Retrieve Current Stock Price
 *
 * This Edge API endpoint retrieves the current price of a specific stock by its ID,
 * authenticates the request using a NextAuth JWT token, and queries a backend service.
 *
 * - Requires an `id` parameter (provided as a route param).
 * - Authenticates using a JWT token from the request.
 * - Fetches the current stock price and last updated date from the backend.
 * - Uses a request timeout (3 seconds) to avoid hanging requests.
 * - Returns the price (rounded to two decimals) and last updated date.
 * - Caches the response for 30 seconds.
 * - Returns HTTP 401 if authentication fails, HTTP 502 for backend or data errors, and HTTP 500 for internal errors.
 *
 * @module api/getCurrentStockPrice
 */

import { NextResponse, NextRequest } from 'next/server';
import { BACKEND_BASE_URL } from '@/config';
import { getToken } from 'next-auth/jwt';

// Configuration constants
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
const CACHE_TTL = 30; // Cache duration in seconds
const REQUEST_TIMEOUT = 3000; // Timeout for backend requests in milliseconds

/**
 * Interface for the backend's stock price response.
 */
interface StockPriceResponse {
  price: number;
  date: string;
}

/**
 * Handles GET requests to retrieve the current price of a specific stock.
 *
 * @param {NextRequest} request - The incoming HTTP request.
 * @param {Object} context - The context object containing route parameters.
 * @param {Promise<{id: string}>} context.params - Promise resolving to the route params, specifically an `id`.
 *
 * @returns {Promise<NextResponse>} - A JSON response with the stock price and last updated date, or an error response.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve the route parameters
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    // Retrieve the authentication token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Return unauthorized if no authentication token is present
    if (!token?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Set up a controller to abort the fetch request if it takes too long
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    // Fetch current stock price from the backend using the access token
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/getcurrentStockPrice/${id}/${token.accessToken}`,
      {
        signal: controller.signal,
        next: { revalidate: CACHE_TTL }, // Cache for 30 seconds
        headers: { 'Content-Type': 'application/json' }
      }
    );

    // Clear the timeout once the fetch completes
    clearTimeout(timeoutId);

    // Handle backend errors
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { 
          error: 'Backend error',
          status: backendResponse.status,
          details: errorText || 'No additional details'
        },
        { status: 502 }
      );
    }

    // Validate backend data format
    const { price, date }: StockPriceResponse = await backendResponse.json();

    if (isNaN(Number(price)) || !date) {
      return NextResponse.json(
        { error: 'Invalid data format from backend' },
        { status: 502 }
      );
    }

    // Return the formatted response
    return NextResponse.json({
      price: Number(price.toFixed(2)),
      lastUpdated: date
    }, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_TTL}`
      }
    });

  } catch (error) {
    // Handle unexpected errors with an internal server error response
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}