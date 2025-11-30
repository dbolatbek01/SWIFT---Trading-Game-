/**
 * API Route: Retrieve Portfolio Data with Invested Value and Buy In
 *
 * This Edge API endpoint retrieves the user's current portfolio data, including invested values,
 * by authenticating via NextAuth JWT and querying a backend service.
 *
 * - Authenticates the user using NextAuth JWT token
 * - Fetches portfolio data with invested value for each position
 * - Returns stock positions with ID, value (rounded to two decimals), and count
 * - Returns HTTP 401 if authentication fails, HTTP 502 for backend errors, and HTTP 500 for internal errors
 *
 * @module api/portfolio/averagePricePortfolio
 */

import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';
import { PortfolioDataWithInvestedValue } from '@/types/interfaces';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Use Edge Runtime for better performance
export const runtime = 'edge';

/**
 * Handles GET requests to retrieve portfolio data with invested values
 * 
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} - JSON response with portfolio data or error
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!authToken?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch portfolio data from backend
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/${authToken.accessToken}/portfolio`,
      {
        method: 'GET',
        next: { revalidate: 2 }, // Short cache for frequently updated data
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!backendResponse.ok) {
      const errorDetails = await backendResponse.text();
      console.error(`Backend error ${backendResponse.status}:`, errorDetails);
      return NextResponse.json(
        { 
          error: 'Backend request failed',
          status: backendResponse.status,
          details: errorDetails || 'No additional details'
        },
        { status: 502 }
      );
    }

    // Process and return portfolio data
    const portfolioData: PortfolioDataWithInvestedValue[] = await backendResponse.json();
    
    return NextResponse.json(
      portfolioData.map(({ idStock, value, count }) => ({
        idStock,
        value: Number(value.toFixed(2)),
        count
      }))
    );

  } catch (error) {
    console.error('Portfolio data fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch portfolio data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}