"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentIndex } from './LeaderboardIndex';
import type { IndexInfo } from '@/types/interfaces';
import UserTitle from './UserTitle';
import UserAchievements from './UserAchievements';

interface LeaderboardEntry {
  idUsersCust: number;
  userName: string;
  email: string;
  depotBalance: number;
  indexPerformance: number;
  performanceVsIndex: number;
}

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  currentUserEmail?: string;
}

function InfoIcon({ text }: { text: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="ml-1 text-gray-400 hover:text-[#61DAFB] transition-colors cursor-help inline-block"
        aria-label="Information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 inline-block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          {/* Modal Content */}
          <div
            className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-2xl border border-white/20 max-w-md w-full p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F596D3] to-[#D247BF]">
                SWIFT-Value
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="text-gray-300 text-[14px] leading-relaxed space-y-3">
              <p>{text}</p>
              <p className="text-[12px] text-gray-400 italic">
                SWIFT-Value shows how much better (or worse) your portfolio is performing compared to the market index.
                A positive value means you&apos;re outperforming the market!
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-[#61DAFB] to-[#03a3d7] rounded-lg hover:opacity-90 transition-opacity text-white font-semibold text-[14px]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getPerformanceColor(value: number): string {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-gray-300';
}

function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function getMedalEmoji(rank: number): string {
  switch (rank) {
    case 1:
      return '\u{1F947}'; // Gold medal
    case 2:
      return '\u{1F948}'; // Silver medal
    case 3:
      return '\u{1F949}'; // Bronze medal
    default:
      return '';
  }
}

function Podium({ topThree, currentUserEmail, indexInfo }: { topThree: LeaderboardEntry[]; currentUserEmail?: string; indexInfo?: IndexInfo | null }) {
  if (topThree.length === 0) return null;

  const [first, second, third] = topThree;

  const PodiumUser = ({ entry, rank, height }: { entry: LeaderboardEntry | undefined; rank: number; height: string }) => {
    if (!entry) return <div className="flex-1"></div>;

    const isCurrentUser = currentUserEmail && entry.email === currentUserEmail;
    const isIndex = entry.idUsersCust === -1;
    const medal = getMedalEmoji(rank);
    const indexEmoji = '\u{1F4CA}'

    const displayPerformance = isIndex ? entry.indexPerformance : entry.performanceVsIndex;

    return (
      <div className="flex-1 flex flex-col items-center">
        <div className="mb-4 text-center">
          <div className="text-[48px] mb-2">{isIndex ? indexEmoji : medal}</div>
          <div>
            <Link
              href={isIndex ? `/indices/${encodeURIComponent(indexInfo?.shortname || '404')}/view` : '/portfolio'}
              className={`text-[18px] font-bold mb-1 ${isCurrentUser ? 'text-[#61DAFB]' : isIndex ? 'text-yellow-400' : 'text-white'} hover:opacity-80 transition-opacity cursor-pointer`}
            >
              {entry.userName}
              {isCurrentUser && <span className="text-[12px] text-gray-400 ml-2 inline-flex items-center">(You)</span>}
              {isIndex && <span className="text-[12px] text-gray-400 block">(Benchmark)</span>}
            </Link>
            <UserTitle userId={entry.idUsersCust} isIndex={isIndex} />
          </div>
          {!isIndex && (
            <div className="text-[14px] font-semibold text-gray-300 mb-1">
              ${entry.depotBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          )}
          <div className={`text-[14px] font-semibold ${getPerformanceColor(displayPerformance)}`}>
            {formatPercentage(displayPerformance)}
          </div>
        </div>

        <div
          className={`w-full ${height} rounded-t-lg flex flex-col items-center justify-between pt-6 pb-4 ${
            isIndex
              ? 'bg-gradient-to-b from-blue-500/30 to-blue-600/20 border-2 border-blue-500/50'
              : rank === 1
              ? 'bg-gradient-to-b from-yellow-500/30 to-yellow-600/20 border-2 border-yellow-500/50'
              : rank === 2
              ? 'bg-gradient-to-b from-gray-400/30 to-gray-500/20 border-2 border-gray-400/50'
              : 'bg-gradient-to-b from-orange-600/30 to-orange-700/20 border-2 border-orange-600/50'
          }`}
        >
          <div className={`text-[32px] font-bold ${
            isIndex ? 'text-blue-400' : rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : 'text-orange-400'
          }`}>
            {rank}
          </div>
          {!isIndex && (
            <UserAchievements userId={entry.idUsersCust} isIndex={isIndex} displayMode="horizontal" size="medium" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] p-8 rounded-lg shadow-lg border border-white/10 mb-6">
      <h3 className="text-center text-[24px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F596D3] to-[#D247BF] mb-8">
        Top Performers
      </h3>
      <div className="flex items-end justify-center gap-4 max-w-4xl mx-auto">
        {/* Second Place - Left */}
        <PodiumUser entry={second} rank={2} height="h-40" />

        {/* First Place - Center */}
        <PodiumUser entry={first} rank={1} height="h-56" />

        {/* Third Place - Right */}
        <PodiumUser entry={third} rank={3} height="h-32" />
      </div>
    </div>
  );
}

export default function LeaderboardTable({ leaderboard, currentUserEmail }: LeaderboardTableProps) {
  const [indexInfo, setIndexInfo] = useState<IndexInfo | null>(null);

  useEffect(() => {
    async function loadIndex() {
      try {
        const data = await getCurrentIndex();
        setIndexInfo(data);
      } catch (err) {
        console.error('Error loading index data: ', err)
      }
    }
    loadIndex();
  }, []);

  if (leaderboard.length === 0) {
    return (
      <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] p-6 rounded-lg shadow-lg text-white border border-white/10">
        <p className="text-center text-gray-400">No leaderboard data available</p>
      </div>
    );
  }

  const indexPerformance = leaderboard.length > 0 ? leaderboard[0].indexPerformance : 0;
  const indexEntry: LeaderboardEntry = {
    idUsersCust: -1, // special id for index
    userName: indexInfo?.indexname || 'Market Index',
    email: '',
    depotBalance: 0, // no portfolio value
    indexPerformance: indexPerformance,
    performanceVsIndex: 0, // index vs itself is always 0
  };

  const combinedLeaderboard = [...leaderboard, indexEntry].sort((a, b) => {
    const aValue = a.performanceVsIndex;
    const bValue = b.performanceVsIndex;
    return bValue - aValue;
  });

  const topThree = combinedLeaderboard.slice(0, 3);
  const restOfLeaderboard = combinedLeaderboard.slice(3);

  return (
    <>
      {/* Podium for Top 3 */}
      <Podium topThree={topThree} currentUserEmail={currentUserEmail} />

      {/* Table for remaining users */}
      {restOfLeaderboard.length > 0 && (
        <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg text-white border border-white/10 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-[#2a2c38]">
                  <th className="px-4 py-3 text-left text-[14px] font-semibold text-gray-300">Rank</th>
                  <th className="px-4 py-3 text-left text-[14px] font-semibold text-gray-300">User</th>
                  <th className="px-4 py-3 text-center text-[14px] font-semibold text-gray-300">Badges</th>
                  <th className="px-4 py-3 text-right text-[14px] font-semibold text-gray-300">Portfolio</th>
                  <th className="px-4 py-3 text-right text-[14px] font-semibold text-gray-300">
                    <span className="inline-flex items-center">
                      SWIFT-Value
                      <InfoIcon text="Your performance relative to the benchmark index" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {restOfLeaderboard.map((entry) => {
                  const isCurrentUser = currentUserEmail && entry.email === currentUserEmail;
                  const isIndex = entry.idUsersCust === -1;

                  // Calculate rank (only for non-index entries)
                  let rank = 0;
                  if (!isIndex) {
                    // Count how many non-index entries are above this one
                    rank = combinedLeaderboard.filter((e, i) => 
                      i < combinedLeaderboard.indexOf(entry) && e.idUsersCust !== -1
                    ).length + 1;
                  }

                  // for index, show indexPerformance; for users, show performanceVsIndex
                  const displayPerformance = isIndex ? entry.indexPerformance : entry.performanceVsIndex;

                  return (
                    <tr
                      key={entry.idUsersCust}
                      className={`border-b border-white/5 transition-colors ${
                        isIndex
                          ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-l-4 border-l-blue-400'
                          : isCurrentUser
                          ? 'bg-gradient-to-r from-[#61DAFB]/20 to-[#03a3d7]/20 border-l-4 border-l-[#61DAFB]'
                          : 'hover:bg-gray-600/30'
                      }`}
                    >
                      {/* Rank */}
                      <td className="px-4 py-4 text-[16px] font-bold">
                        {isIndex ? (
                          <span></span>
                        ) : (
                          rank
                        )}
                      </td>

                      {/* Username */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <Link
                              href={isIndex ? `/indices/${encodeURIComponent(indexInfo?.shortname || '404')}/view` : '/portfolio'}
                              className={`text-[16px] font-semibold ${isCurrentUser ? 'text-[#61DAFB]' : isIndex ? 'text-yellow-400' : ''} hover:opacity-80 transition-opacity cursor-pointer`}
                            >
                              {entry.userName}
                            </Link>
                            {isCurrentUser && (
                              <span className="text-[12px] text-gray-400 font-normal">(You)</span>
                            )}
                            {isIndex && (
                              <span className="text-[12px] text-gray-400 font-normal">(Benchmark)</span>
                            )}
                          </div>
                          <UserTitle userId={entry.idUsersCust} isIndex={isIndex} />
                        </div>
                      </td>

                      {/* Achievements/Badges */}
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <UserAchievements userId={entry.idUsersCust} isIndex={isIndex} displayMode="horizontal" size="medium" />
                        </div>
                      </td>

                      {/* Depot Balance */}
                      <td className="px-4 py-4 text-right">
                        {isIndex ? (
                          <span className="text-[16px] font-semibold text-gray-500"></span>
                        ) : (
                          <span className="text-[16px] font-semibold text-white">
                            ${entry.depotBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        )}
                      </td>

                      {/* Performance (SWIFT-Value for users, Index Performance for index) */}
                      <td className="px-4 py-4 text-right">
                        {isIndex ? (
                          <span className="text-[16px] font-semibold text-gray-500"></span>
                        ) : (
                          <span
                            className={`text-[16px] font-bold ${getPerformanceColor(displayPerformance)}`}
                          >
                            {formatPercentage(displayPerformance)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer with info */}
          <div className="p-4 bg-[#2a2c38] border-t border-white/10">
            <p className="text-[12px] text-gray-400 text-center">
              Performance metrics are updated in real-time. Rankings are based on SWIFT-Value.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
