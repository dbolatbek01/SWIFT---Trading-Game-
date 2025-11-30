/** 
 * This handler fetches all user transactions (always fresh) and stock data (cacheable)
 * in a single API call. It authenticates the request, fetches both datasets in parallel,
 * combines and processes the data, and returns a unified, typed JSON response.
 * 
 * Error handling is streamlined for both backend and cache errors, and
 * cache-control headers are set for edge delivery efficiency.
 */

import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';
import { Stock, AllTransactions, RawTransaction } from '@/types/interfaces';

// Force dynamic rendering, no static caching at build-time
export const dynamic = 'force-dynamic';
// Use the Edge Runtime for low-latency responses at the CDN edge
export const runtime = 'edge';

/**
 * GET handler for the API route.
 * 
 * 1. Authenticates the incoming request using JWT.
 * 2. Fetches all user transactions (fresh, no cache) and stock data (revalidated every 60s) in parallel.
 * 3. Handles and returns errors for either backend or cache failures.
 * 4. Combines transactions and stock data, mapping stocks to transactions and calculating values.
 * 5. Responds with processed data and sets appropriate cache headers for the response.
 * 
 * @param request NextRequest The incoming request object from Next.js Edge API Routes.
 * @returns NextResponse JSON response with combined transaction and stock data, or error status.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate using JWT from next-auth
    const authToken = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!authToken?.accessToken) {
      // If authentication fails, return 401 Unauthorized
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const origin = request.nextUrl.origin;

    // 2. Fetch transactions (always fresh) and stocks (cacheable) in parallel
    const [transactionsResponse, stocksResponse] = await Promise.all([
      // Always fresh transactions from backend
      fetch(`${BACKEND_BASE_URL}/getAllTransactions/${authToken.accessToken}`, {
        cache: 'no-store'
      }),
      // Stock data, cacheable for 60 seconds
      fetch(`${origin}/stocks.json`, {
        next: { revalidate: 60 }
      })
    ]);

    // 3. Error handling for transactions fetch
    if (!transactionsResponse.ok) {
      const errorData = await transactionsResponse.json().catch(() => null);
      return NextResponse.json(
        {
          error: 'Transactions service error',
          details: errorData?.message || `Status: ${transactionsResponse.status}`,
          status: transactionsResponse.status
        },
        { status: 502 }
      );
    }

    // Error handling for stocks fetch
    if (!stocksResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch stock data', status: stocksResponse.status },
        { status: 500 }
      );
    }

    // 4. Process both responses into typed objects
    const [rawTransactions, stocks]: [RawTransaction[], Stock[]] = await Promise.all([
      transactionsResponse.json(),
      stocksResponse.json()
    ]);

    // Map and enrich transactions with corresponding stock info
    const transactions = rawTransactions.map(tx => {
      try {
        // Support multiple id keys for stock
        const stockId = tx.idStock || tx.id_stock || null;
        // Find matching stock object
        const stock = stocks.find(s => s.id === stockId);
        // Calculate transaction value (price * count), fixed to 2 decimals
        const value = Number((Number(tx.value) * Number(tx.count)).toFixed(2));

        return {
          idStock: stockId,
          value: Number(value),
          date: tx.date,
          stockName: stock?.stockname || `Stock #${stockId}`,
          bs: tx.bs ?? null
        } as AllTransactions;
      } catch (e) {
        // Skip and warn on malformed transaction data
        console.warn('Skipping malformed transaction:', tx, e);
        return null;
      }
    }).filter(Boolean) as AllTransactions[];

    // 5. Set edge cache control: 1s fresh, 5s stale
    const response = NextResponse.json(transactions);
    response.headers.set(
      'Cache-Control', 
      'public, s-maxage=1, stale-while-revalidate=5'
    );
    
    return response;

  } catch (error) {
    // 6. Catch-all for unexpected errors, log and return 500
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}