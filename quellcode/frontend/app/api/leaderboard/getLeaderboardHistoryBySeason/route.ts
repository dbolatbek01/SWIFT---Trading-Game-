import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BACKEND_BASE_URL } from '@/config';

interface LeaderboardEntryRaw {
  idUsersCust: number;
  userName: string;
  email: string;
  depotBalance: number | null;
  indexPerformance: number |null;
  performanceVsIndex: number | null;
}


export const dynamic = 'force-dynamic';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const authToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!authToken?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${BACKEND_BASE_URL}/getLeaderboardHistoryBySeason/2/${authToken.accessToken}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      }
    );

    if (!backendResponse.ok) {
      const errorDetails = await backendResponse.text();
      console.error('Backend error:', backendResponse.status, errorDetails);
      return NextResponse.json(
        {
          error: 'Backend service unavailable',
          status: backendResponse.status
        },
        { status: 502 }
      );
    }

    const leaderboardData = await backendResponse.json();

    // TODO: Sprint02: Titel einfügen, depotBalance, indexPerformance entfernen
    const processedLeaderboard = Array.isArray(leaderboardData)
      ? leaderboardData.map((entry: LeaderboardEntryRaw) => ({
          idUsersCust: entry.idUsersCust,
          userName: entry.userName,
          email: entry.email,
          depotBalance: Number(entry.depotBalance?.toFixed(2) ?? 0),
          indexPerformance: Number(entry.indexPerformance?.toFixed(2) ?? 0),
          performanceVsIndex: Number(entry.performanceVsIndex?.toFixed(2) ?? 0)
        }))
      : [];

    const response = NextResponse.json({
      leaderboard: processedLeaderboard
    });

    response.headers.set(
      'Cache-Control',
      'public, s-maxage=1, stale-while-revalidate=5'
    );

    return response;

  } catch (error) {
    console.error('Leaderboard history fetch failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve leaderboard history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
