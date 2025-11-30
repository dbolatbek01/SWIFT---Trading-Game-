import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { TransactionData } from '@/types/interfaces';
import { BACKEND_BASE_URL } from '@/config';

export const runtime = 'edge';
/**
 * Handles a POST request to sell a specific number of stock units.
 *
 * @param request - The incoming HTTP request, which should include the quantity to sell.
 * @param params - Dynamic route parameters, specifically the stock ID to sell.
 * @returns A JSON response indicating success or an appropriate error.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract the number of stocks to sell from the request body
    const { count } = await request.json();

    // Extract stock ID from route parameters and convert it to a number
    const { id } = await params;
    const id_stock = parseInt(id);

    // Create the transaction payload
    const transactionData: TransactionData = {
      id_stock,
      count
    };

    // Retrieve the authentication token from the user's session
    const authToken = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // If no token is found, return 401 Unauthorized
    if (!authToken?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Send the transaction to the backend API to sell the stock
    const backendResponse = await fetch(`${BACKEND_BASE_URL}/sellStock/${authToken.accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    // Throw an error if the backend responds with a failure status
    if (!backendResponse.ok) {
      throw new Error('Backend request failed');
    }

    // Return a success response if the transaction was processed successfully
    return NextResponse.json({ success: true });

  } catch (error) {
    // Log the error for debugging and return a 500 Internal Server Error
    console.error('Error in sell route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
