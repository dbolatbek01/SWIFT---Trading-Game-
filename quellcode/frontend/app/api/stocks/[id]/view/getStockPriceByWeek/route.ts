import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_BASE_URL } from '@/config';
import { getToken } from 'next-auth/jwt';

// Specify that this function should run on the edge runtime
export const runtime = 'edge';

/**
 * Handles a GET request to fetch weekly stock price data for a specific asset ID.
 * @param {NextRequest} request - The incoming HTTP request object from Next.js.
 * @param {Object} context - An object containing route parameters.
 * @param {Promise<{ id: string }>} context.params - A promise resolving to an object containing the stock ID.
 * @returns {Promise<NextResponse>} A response containing the stock price data or an error message.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract the asset ID from the route parameters
    const { id } = await params;

    // Retrieve the user's JWT token for authentication
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // If no access token is found, return an unauthorized response
    if (!token?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Construct and send a request to the backend API to fetch weekly stock price data
    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/getStockPriceLastWeek/${id}/${token.accessToken}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { 
          revalidate: 21600 // Cache for 6 hours
        }
      }
    );

    // If the backend API responds with an error, log and throw it
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend API error:', backendResponse.status, errorText);
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    // Return the successful response with appropriate cache headers
    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 30 seconds, allow stale for 15 seconds while revalidating
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=15'
      }
    });

  } catch (error) {
    // Handle any unexpected errors and return a 500 error response
    console.error('Error fetching stock price by week:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stock price',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}