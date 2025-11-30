import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

/**
 * API Route: /api/achievements/achieved
 * 
 * GET: Retrieves all achieved achievements/titles for a user
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

    const id_user = token.sub; // Google ID from token

    // Call the backend API
    const response = await fetch(`${BACKEND_BASE_URL}/getAchievedAchievements/${id_user}/${token.accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to fetch achieved achievements', details: errorText },
        { status: response.status }
      );
    }

    const achievementsData = await response.json();
    
    return NextResponse.json(achievementsData, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching achieved achievements:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
