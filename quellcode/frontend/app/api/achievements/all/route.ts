import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

/**
 * API Route: /api/achievements/all
 * 
 * GET: Retrieves all possible achievements/titles
 */

// Force dynamic rendering (not static)
export const dynamic = 'force-dynamic';
// Use Next.js Edge Runtime
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get the JWT token from the session
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token?.accessToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Call the backend API
    const response = await fetch(`${BACKEND_BASE_URL}/getAllAchievements/${token.accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to fetch all achievements', details: errorText },
        { status: response.status }
      );
    }

    const allAchievements = await response.json();
    
    return NextResponse.json(allAchievements, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching all achievements:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
