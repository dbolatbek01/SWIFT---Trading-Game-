import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

/**
 * API Route: /api/achievements/selected
 *
 * GET: Retrieves the selected achievements for a user (up to 3)
 * PUT: Sets the selected achievements for a user (1-3 achievements)
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
    const response = await fetch(`${BACKEND_BASE_URL}/getSelectedAchievements/${id_user}/${token.accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      console.error('Response status:', response.status);

      // If no achievements are selected yet, return empty array
      if (errorText.includes('Index 0 out of bounds for length 0') ||
          errorText.includes('No selected achievements')) {
        return NextResponse.json({ selectedAchievements: [], message: 'No achievements selected yet' }, { status: 200 });
      }

      return NextResponse.json(
        { error: 'Failed to fetch selected achievements', details: errorText },
        { status: response.status }
      );
    }

    const selectedAchievements = await response.json();

    return NextResponse.json(selectedAchievements, { status: 200 });

  } catch (error) {
    console.error('Error fetching selected achievements:', error);
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

    // Parse the request body to get the achievement IDs
    const body = await request.json();
    const { achievement1, achievement2, achievement3 } = body;

    // Validate that at least achievement1 is provided
    if (!achievement1) {
      return NextResponse.json(
        { error: 'At least one achievement (achievement1) is required' },
        { status: 400 }
      );
    }

    // Create URL with query parameters for the backend
    const url = new URL(`${BACKEND_BASE_URL}/setSelectedAchievements/${id_user}/${token.accessToken}`);
    url.searchParams.append('achievement1', achievement1.toString());

    if (achievement2 !== undefined && achievement2 !== null) {
      url.searchParams.append('achievement2', achievement2.toString());
    }

    if (achievement3 !== undefined && achievement3 !== null) {
      url.searchParams.append('achievement3', achievement3.toString());
    }

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
        { error: 'Failed to set selected achievements', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.text();

    return NextResponse.json({ message: result }, { status: 200 });

  } catch (error) {
    console.error('Error setting selected achievements:', error);
    return NextResponse.json(
      {
        error: 'Server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
