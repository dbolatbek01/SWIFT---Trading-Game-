import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

/**
 * API Route: /api/achievements/title
 * 
 * GET: Retrieves the selected title for a user
 * PUT: Sets the selected title for a user
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

    // Get userId from query parameter or use the logged-in user's ID
    const { searchParams } = new URL(request.url);
    const id_user = searchParams.get('userID') || token.sub;

    // Call the backend API
    const response = await fetch(`${BACKEND_BASE_URL}/getSelectedTitle/${id_user}/${token.accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      console.error('Response status:', response.status);
      
      // If it's an "Index out of bounds" error, it means no title is selected yet
      if (errorText.includes('Index 0 out of bounds for length 0')) {
        return NextResponse.json({ selectedTitle: null, message: 'No title selected yet' }, { status: 200 });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch selected title', details: errorText },
        { status: response.status }
      );
    }

    const titleData = await response.json();
    
    return NextResponse.json(titleData, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching selected title:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    // Parse the request body to get the achievement ID
    const body = await request.json();
    const { achievement } = body;

    if (!achievement) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

    // Create URL with query parameter for the backend
    const url = new URL(`${BACKEND_BASE_URL}/setSelectedTitel/${id_user}/${token.accessToken}`);
    url.searchParams.append('achievement', achievement.toString());

    // Call the backend API
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to set selected title', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.text();
    
    return NextResponse.json({ message: result }, { status: 200 });
    
  } catch (error) {
    console.error('Error setting selected title:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
