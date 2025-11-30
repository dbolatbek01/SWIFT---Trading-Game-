import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { TransactionData } from '@/types/interfaces';
import { BACKEND_BASE_URL } from '@/config';

export const runtime = 'edge';
/**
 * Handles a POST request to buy a stock.
 *
 * @param request - The incoming HTTP request containing JSON body data.
 * @param params - Route parameters, specifically the stock ID to be bought.
 * @returns A JSON response indicating success or an appropriate error.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract the number of stocks to buy from the request body
    const { count } = await request.json();

    // Extract the stock ID from the route parameters
    const { id } = await params;
    const id_stock = parseInt(id);

    // Construct the transaction object to send to the backend
    const transactionData: TransactionData = {
      id_stock,
      count
    };

    // Retrieve the user's authentication token via NextAuth
    const authToken = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // Return 401 Unauthorized if the token is missing or invalid
    if (!authToken?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Send a POST request to the backend to execute the stock purchase
    const backendResponse = await fetch(`${BACKEND_BASE_URL}/buyStock/${authToken.accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    // Throw an error if the backend request fails
    if (!backendResponse.ok) {
      throw new Error('Backend request failed');
    }

    // Return a success response
    return NextResponse.json({ success: true });

  } catch (error) {
    // Log and return a 500 Internal Server Error in case of failure
    console.error('Error in buy route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
