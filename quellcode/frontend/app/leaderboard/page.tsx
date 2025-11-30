"use client"

import TopNavbar from '@/app/navigation/Navbar';
import { useAuthToken } from '@/lib/useAuthToken';
import { useEffect, useState } from 'react';
import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable';
import { useSession } from 'next-auth/react';

interface LeaderboardEntry {
    idUsersCust: number;
    userName: string;
    email: string;
    depotBalance: number;
    indexPerformance: number;
    performanceVsIndex: number;
}

export default function LeaderboardPage() {
    const token = useAuthToken();
    const { data: session } = useSession();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSeason0, setShowSeason2] = useState(false);

    useEffect(() => {
        async function fetchLeaderboard() {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const endpoint = showSeason0
                    ? '/api/leaderboard/getLeaderboardHistoryBySeason'
                    : '/api/leaderboard/getLeaderboard';

                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }
                const data = await response.json();
                setLeaderboard(data.leaderboard);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
                console.error('Leaderboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboard();
    }, [token, showSeason0]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1e1f26] to-[#2a2c38]">
            <div className="container mx-auto sticky top-0 z-100">
                <TopNavbar />
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-[42px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F596D3] to-[#D247BF] mb-2">
                        Leaderboard
                    </h1>
                    <p className="text-gray-400 text-[16px]">
                        See how your portfolio performance ranks against other traders
                    </p>
                </div>

                {/* Season Toggle */}
                <div className="flex justify-center mb-6">
                    <div className="inline-flex bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setShowSeason2(false)}
                            className={`px-6 py-2 rounded-md text-[14px] font-semibold transition-all ${
                                !showSeason0
                                    ? 'bg-gradient-to-r from-[#61DAFB] to-[#03a3d7] text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Current Season
                        </button>
                        <button
                            onClick={() => setShowSeason2(true)}
                            className={`px-6 py-2 rounded-md text-[14px] font-semibold transition-all ${
                                showSeason0
                                    ? 'bg-gradient-to-r from-[#61DAFB] to-[#03a3d7] text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Last Season
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] p-12 rounded-lg shadow-lg text-white border border-white/10">
                        <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#61DAFB] mb-4"></div>
                            <p className="text-gray-400">Loading leaderboard...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] p-8 rounded-lg shadow-lg text-white border border-red-500/30">
                        <div className="flex flex-col items-center justify-center">
                            <div className="text-red-400 text-[48px] mb-4">⚠️</div>
                            <h3 className="text-[20px] font-semibold mb-2">Failed to Load Leaderboard</h3>
                            <p className="text-gray-400 text-center">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-6 px-6 py-2 bg-gradient-to-r from-[#61DAFB] to-[#03a3d7] rounded-lg hover:opacity-90 transition-opacity text-white font-semibold"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Leaderboard Table */}
                {!loading && !error && (
                    <LeaderboardTable
                        leaderboard={leaderboard}
                        currentUserEmail={session?.user?.email ?? undefined}
                    />
                )}

                {/* Info Section */}
                {!loading && !error && leaderboard.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] p-4 rounded-lg border border-white/10">
                            <h3 className="text-[16px] font-semibold text-[#61DAFB] mb-2">Portfolio Value</h3>
                            <p className="text-[12px] text-gray-400">
                                Your total portfolio value including all holdings and cash
                            </p>
                        </div>
                        <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] p-4 rounded-lg border border-white/10">
                            <h3 className="text-[16px] font-semibold text-[#61DAFB] mb-2">Market Index</h3>
                            <p className="text-[12px] text-gray-400">
                                The benchmark index is shown as a reference point. Users ranked above it are outperforming the market.
                            </p>
                        </div>
                        <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] p-4 rounded-lg border border-white/10">
                            <h3 className="text-[16px] font-semibold text-[#61DAFB] mb-2">SWIFT-Value</h3>
                            <p className="text-[12px] text-gray-400">
                                Your performance relative to the benchmark index
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
