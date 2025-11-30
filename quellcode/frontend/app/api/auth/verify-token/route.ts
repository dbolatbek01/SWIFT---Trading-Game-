/**
 * This route verifies the Google access token by sending it to the backend.
 * It expects the token to be present in the NextAuth session.
 * If the token is valid, it returns the user data from the backend.
 * If the token is invalid or not present, it returns an error response.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} - The response containing user data or an error message.
 * @throws {Error} - If the token verification fails or if there is an error in the backend request.
 */

import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

/**
 * 
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} - The response containing user data or an error message.
 */
export async function POST(request: NextRequest) {
  try {
    // Try to get the token from the request using NextAuth's getToken method
    const authToken = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!authToken?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Send the access token to the backend for verification
    const backendResponse = await fetch(`${BACKEND_BASE_URL}/google/${authToken.accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      throw new Error('Backend token verification failed');
    }

    const userData = await backendResponse.json();
    
    return NextResponse.json({ 
      success: true, 
      user: userData 
    });
  } catch (error) {
    console.error('Error in verify-token route:', error);
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    );
  }
}