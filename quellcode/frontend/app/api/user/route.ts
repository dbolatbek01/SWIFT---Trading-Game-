import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

/**
 * API Route: /api/user
 * 
 * Retrieves Google user information from the backend
 * using the authenticated user's token
 */
export async function GET(request: NextRequest) {
  try {
    // Get the JWT token from the session
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token?.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Call the backend API with the Google token
    const response = await fetch(`${BACKEND_BASE_URL}/google/${token.accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to fetch user information', details: errorText },
        { status: response.status }
      );
    }

    const userData = await response.json();
    
    return NextResponse.json(userData, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
