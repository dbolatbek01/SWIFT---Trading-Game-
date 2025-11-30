// app/api/index/loadIndexes/route.ts
// API route handler for loading financial indexes from backend service
// This endpoint authenticates the user and fetches available indexes

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

// Configure Next.js to use Edge Runtime for better performance
export const runtime = 'edge';

/**
 * GET handler for loading financial indexes
 * Authenticates the user via JWT token and fetches indexes from backend
 * 
 * @param request - Next.js request object containing headers and authentication
 * @returns NextResponse with indexes array or error message
 */
export async function GET(request: NextRequest) {
  try {
    // Extract JWT token from the request using NextAuth
    // This token contains user authentication information
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if user is authenticated by verifying accessToken presence
    if (!token?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Make backend API call with access token as path parameter
    // This follows the backend's authentication pattern
    const backendResponse = await fetch(`${BACKEND_BASE_URL}/loadIndexes/${token.accessToken}`);

    // Handle backend service errors
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Backend error: ${backendResponse.status} - ${errorText}`);
      return NextResponse.json({ 
        error: 'Backend error', 
        details: errorText 
      }, { status: backendResponse.status });
    }

    // Parse the response as JSON
    const indexObj = await backendResponse.json();

    // The backend returns a single index object, but frontend expects an array
    // Validate that the response is an object (not null and not an array) and wrap it in an array.
    if (!indexObj || typeof indexObj !== 'object' || Array.isArray(indexObj)) {
      console.error('Backend returned invalid data structure:', typeof indexObj);
      return NextResponse.json({ 
        error: 'Invalid data structure from backend' 
      }, { status: 500 });
    }

    // Return the single index object wrapped in an array for frontend compatibility
    return NextResponse.json([indexObj]);
    
  } catch (error) {
    // Handle any unexpected errors during the process
    console.error('Error loading indexes:', error);
    
    return NextResponse.json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}