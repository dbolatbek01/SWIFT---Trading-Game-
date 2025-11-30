import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import fs from 'fs/promises';
import path from 'path';
import { BACKEND_BASE_URL } from '@/config';

/**
 * Handles a GET request to fetch stock data from the backend API
 * and write it to a local file (`public/stocks.json`).
 *
 * @param request - The incoming HTTP request from the client.
 * @returns A JSON response indicating success or an appropriate error.
 */
export async function GET(request: NextRequest) { 
  try {
    // Retrieve the authenticated user's token using NextAuth
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // If no token is found or it's invalid, return 401 Unauthorized
    if (!token?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch stock data from the backend API using the access token
    const backendResponse = await fetch(`${BACKEND_BASE_URL}/loadStocks/${token.accessToken}`);
    
    // If backend responds with an error, throw to trigger catch block
    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    // Parse the backend response JSON
    const stocks = await backendResponse.json();

    // Construct the absolute path to the local file
    const filePath = path.join(process.cwd(), 'public', 'stocks.json');

    // Write the stock data to the local JSON file (pretty-printed)
    await fs.writeFile(filePath, JSON.stringify(stocks, null, 2));

    // Return a success response
    return NextResponse.json({ success: true });

  } catch (error) {
    // Log any unexpected errors and return a 500 Internal Server Error
    console.error('Error loading stocks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
