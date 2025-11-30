/**
 * API Route: Retrieve Current Portfolio Data with Latest Prices
 *
 * This Edge API endpoint retrieves the user's current portfolio positions, including the latest prices,
 * by authenticating via NextAuth JWT and querying a backend service.
 *
 * - Authenticates the user using NextAuth JWT token
 * - Fetches current portfolio data with the latest prices from the backend
 * - Uses a request timeout to avoid hanging requests (5 seconds)
 * - Returns each stock position with stock ID, latest price (rounded to two decimals), and count
 * - Returns HTTP 401 if authentication fails, HTTP 502 for backend errors, and HTTP 500 for internal errors
 *
 * @module api/portfolio/currentPricePortfolio
 */

import { NextResponse, NextRequest } from 'next/server';
import { BACKEND_BASE_URL } from '@/config';
import { PortfolioDataWithCurrentPrice } from '@/types/interfaces';
import { getToken } from 'next-auth/jwt';

// Force dynamic rendering (not static)
export const dynamic = 'force-dynamic';
// Use Next.js Edge Runtime
export const runtime = 'edge';

/**
 * Handles GET requests to retrieve the user's current portfolio data with latest prices
 * 
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} - A JSON response with portfolio data or error response
 */
export async function GET(request: NextRequest) {
  try {
    // Get authentication token
    const authToken = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // Return unauthorized if no authentication token is present
    if (!authToken?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch current portfolio data from backend
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/${authToken.accessToken}/currentPortfolio`,
      {
        method: 'GET',
        next: { revalidate: 2 }, // Short cache for frequently updated data
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => null);
      return NextResponse.json(
        { 
          error: 'Backend error',
          status: backendResponse.status,
          details: errorData?.message || 'No additional details'
        },
        { status: 502 }
      );
    }

    // Parse and transform portfolio data
    const portfolioData: PortfolioDataWithCurrentPrice[] = await backendResponse.json();
    
    return NextResponse.json(
      portfolioData.map(({ idStock, latestPrice, count }) => ({
        idStock,
        latestPrice: Number(latestPrice.toFixed(2)),
        count
      }))
    );

  } catch (error) {
    // Handle specific timeout error
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout', details: 'Backend did not respond in time' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}