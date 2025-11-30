'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// Leaderboard entry data structure
interface LeaderboardEntry {
  idUsersCust: number;
  userName: string;
  email: string;
  depotBalance: number;
  indexPerformance: number;
  performanceVsIndex: number;
}

// Component props
interface MiniLeaderboardProps {
  token: string | null;
}

/**
 * MiniLeaderboard Component
 * 
 * Displays user's current rank and surrounding positions.
 * Shows user with position above and below for context.
 */
export default function MiniLeaderboard({ token }: MiniLeaderboardProps) {
  const { data: session } = useSession();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<number | null>(null);

  // Fetch and process leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/leaderboard/getLeaderboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      
      if (data.leaderboard && Array.isArray(data.leaderboard)) {
        // Sort by performance descending
        const sortedLeaderboard = [...data.leaderboard].sort(
          (a, b) => (b.performanceVsIndex || 0) - (a.performanceVsIndex || 0)
        );
        
        setLeaderboardData(sortedLeaderboard);
        
        // Find user's position in sorted list
        if (session?.user?.email) {
          const position = sortedLeaderboard.findIndex(
            entry => entry.email === session.user?.email
          );
          setUserPosition(position !== -1 ? position : null);
        }
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [token, session?.user?.email]);

  // Load leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Returns color class based on performance value
  const getPerformanceColor = (value: number): string => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-300';
  };

  // Formats percentage with + or - sign
  const formatPercentage = (value: number): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Returns medal emoji for top 3 ranks
  const getMedalEmoji = (rank: number): string => {
    switch (rank) {
      case 1:
        return '\u{1F947}';
      case 2:
        return '\u{1F948}';
      case 3:
        return '\u{1F949}';
      default:
        return '';
    }
  };

  // Gets entries to display: user and adjacent positions
  const getDisplayEntries = (): LeaderboardEntry[] => {
    if (userPosition === null || leaderboardData.length === 0) {
      return [];
    }

    const entries: LeaderboardEntry[] = [];
    
    // Include position above if exists
    if (userPosition > 0) {
      entries.push(leaderboardData[userPosition - 1]);
    }
    
    // Include current user
    entries.push(leaderboardData[userPosition]);
    
    // Include position below if exists
    if (userPosition < leaderboardData.length - 1) {
      entries.push(leaderboardData[userPosition + 1]);
    }
    
    return entries;
  };

  // Returns 1-indexed rank for display
  const getRank = (entry: LeaderboardEntry): number => {
    return leaderboardData.findIndex(e => e.email === entry.email) + 1;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <div className="animate-pulse">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  // Empty state
  if (!token || userPosition === null || leaderboardData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400 text-sm">
          No leaderboard data available
        </div>
      </div>
    );
  }

  const displayEntries = getDisplayEntries();

  return (
    <div className="flex flex-col h-full">
      {/* User position header */}
      <div className="mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
        <p className="text-gray-400 text-[11px] sm:text-[12px] lg:text-[13px] xl:text-[14px] text-center">
          Your position: <span className="text-white font-semibold">#{userPosition + 1}</span> of {leaderboardData.length}
        </p>
      </div>

      {/* Entries list */}
      <div className="flex-1 flex flex-col justify-center space-y-2 sm:space-y-2.5 lg:space-y-3 overflow-y-auto">
        {displayEntries.map((entry) => {
          const isCurrentUser = entry.email === session?.user?.email;
          const rank = getRank(entry);
          
          return (
            <div
              key={entry.email}
              className={`
                flex items-center justify-between p-2 sm:p-2.5 lg:p-3 rounded-lg
                ${isCurrentUser 
                  ? 'bg-gradient-to-r from-[#61DAFB]/20 to-[#03a3d7]/20 border-2 border-[#61DAFB]' 
                  : 'bg-gray-800/30 border border-gray-700'
                }
                transition-all duration-200 flex-shrink-0
              `}
            >
              {/* Left: Rank and username */}
              <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 flex-1 min-w-0">
                <div className={`
                  text-[13px] sm:text-[14px] lg:text-[15px] xl:text-[16px] font-bold w-6 sm:w-7 lg:w-8 text-center flex-shrink-0
                  ${isCurrentUser ? 'text-[#61DAFB]' : 'text-gray-400'}
                `}>
                  #{rank}
                </div>
                {/* Medal icon for top 3 */}
                {rank <= 3 && (
                  <div className="text-[16px] sm:text-[18px] lg:text-[20px] flex-shrink-0">
                    {getMedalEmoji(rank)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className={`
                    text-[11px] sm:text-[12px] lg:text-[13px] xl:text-[14px] font-semibold truncate
                    ${isCurrentUser ? 'text-[#61DAFB]' : 'text-white'}
                  `}>
                    {entry.userName}
                    {isCurrentUser && <span className="text-[10px] sm:text-[11px] lg:text-[12px] text-gray-400 ml-1">(You)</span>}
                  </div>
                </div>
              </div>

              {/* Right: Performance percentage */}
              <div className={`
                text-[11px] sm:text-[12px] lg:text-[13px] xl:text-[14px] font-bold flex-shrink-0 ml-2
                ${getPerformanceColor(entry.performanceVsIndex)}
              `}>
                {formatPercentage(entry.performanceVsIndex)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer description */}
      <div className="mt-2 sm:mt-3 lg:mt-4 text-center flex-shrink-0">
        <p className="text-gray-500 text-[10px] sm:text-[11px] lg:text-[12px] whitespace-nowrap">
          SWIFT-VALUE: Performance relative to Index
        </p>
      </div>
    </div>
  );
}
