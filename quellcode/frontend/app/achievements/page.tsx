'use client'

import TopNavbar from '@/app/navigation/Navbar';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Achievement {
  id: number;
  name: string;
  threshold: number;
  titel: string;
  description: string;
}

interface AchievedAchievement {
  id: number;
  idAchievement: number;
  idUser: string;
  progress: number;
  reached: boolean;
  selected_achievement: number | null;
  selected_title: string | null;
}

interface CombinedAchievement extends Achievement {
  progress: number;
  reached: boolean;
  achievedId?: number;
}

export default function Achievements() {
  const { status } = useSession();
  const [achievements, setAchievements] = useState<CombinedAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAchievementIds, setSelectedAchievementIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (status !== 'authenticated') {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [allAchievementsRes, achievedAchievementsRes, selectedAchievementsRes] = await Promise.all([
          fetch('/api/achievements/all'),
          fetch('/api/achievements/achieved'),
          fetch('/api/achievements/selected'),
        ]);

        if (!allAchievementsRes.ok) {
          throw new Error('Failed to fetch all achievements');
        }

        if (!achievedAchievementsRes.ok) {
          throw new Error('Failed to fetch achieved achievements');
        }

        if (!selectedAchievementsRes.ok) {
          console.warn('Failed to fetch selected achievements, using empty array');
        }

        const allAchievements: Achievement[] = await allAchievementsRes.json();
        const achievedAchievements: AchievedAchievement[] = await achievedAchievementsRes.json();

        // Get selected achievements (could be empty array)
        let selectedData = { selectedAchievements: [] };
        if (selectedAchievementsRes.ok) {
          selectedData = await selectedAchievementsRes.json();
        }

        // Extract the achievement IDs from selected achievements
        // The backend returns achieved_achievement records, we need the idAchievement values
        const selectedIds = Array.isArray(selectedData.selectedAchievements)
          ? selectedData.selectedAchievements
              .filter((item: AchievedAchievement) => item.idAchievement !== null)
              .map((item: AchievedAchievement) => item.idAchievement)
          : Array.isArray(selectedData)
            ? selectedData
                .filter((item: AchievedAchievement) => item.idAchievement !== null)
                .map((item: AchievedAchievement) => item.idAchievement)
            : [];

        setSelectedAchievementIds(selectedIds);

        // match achievements with user progress
        const combined: CombinedAchievement[] = allAchievements.map((achievement) => {
          const achieved = achievedAchievements.find(
            (a) => a.idAchievement === achievement.id
          );

          return {
            ...achievement,
            progress: achieved?.progress || 0,
            reached: achieved?.reached || false,
            achievedId: achieved?.id,
          };
        });

        setAchievements(combined);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [status]);

  // Toggle achievement selection
  const toggleAchievementSelection = (achievementId: number) => {
    setSelectedAchievementIds((prev) => {
      if (prev.includes(achievementId)) {
        // Deselect
        return prev.filter((id) => id !== achievementId);
      } else {
        // Select (max 3)
        if (prev.length >= 3) {
          return prev; // Don't add more than 3
        }
        return [...prev, achievementId];
      }
    });
    setSaveSuccess(false); // Reset success message when selection changes
  };

  // Save selected achievements
  const saveSelectedAchievements = async () => {
    if (selectedAchievementIds.length === 0) {
      setError('Please select at least one achievement');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      const body: {
        achievement1: number;
        achievement2?: number;
        achievement3?: number;
      } = {
        achievement1: selectedAchievementIds[0],
      };

      if (selectedAchievementIds[1]) {
        body.achievement2 = selectedAchievementIds[1];
      }

      if (selectedAchievementIds[2]) {
        body.achievement3 = selectedAchievementIds[2];
      }

      const response = await fetch('/api/achievements/selected', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save selected achievements');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (err) {
      console.error('Error saving selected achievements:', err);
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] overflow-hidden flex flex-col">
        <div className="container mx-auto sticky top-0 z-100">
          <TopNavbar />
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-white text-xl">Loading achievements...</div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] overflow-hidden flex flex-col">
        <div className="container mx-auto sticky top-0 z-100">
          <TopNavbar />
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-white text-xl">Please sign in to view achievements</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] overflow-hidden flex flex-col">
        <div className="container mx-auto sticky top-0 z-100">
          <TopNavbar />
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-red-400 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] overflow-hidden flex flex-col">
      {/* Navigation bar */}
      <div className="container mx-auto sticky top-0 z-100">
        <TopNavbar />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-2">Achievements</h1>
        <p className="text-gray-400 text-center mb-8">
          Track your progress and unlock exclusive titles
        </p>

        {/* Selection Panel */}
        <div className="max-w-3xl mx-auto mb-8 bg-[#2a2c38] border-2 border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Featured Achievements</h2>
              <p className="text-sm text-gray-400">
                Select up to 3 unlocked achievements to showcase ({selectedAchievementIds.length}/3 selected)
              </p>
            </div>
            <button
              onClick={saveSelectedAchievements}
              disabled={saving || selectedAchievementIds.length === 0}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                saving || selectedAchievementIds.length === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg'
              }`}
            >
              {saving ? 'Saving...' : 'Save Selection'}
            </button>
          </div>

          {/* Success/Error Messages */}
          {saveSuccess && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
              Successfully saved your selected achievements!
            </div>
          )}
          {error && !saveSuccess && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Selected Achievements Preview */}
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => {
              const selectedId = selectedAchievementIds[index];
              const achievement = achievements.find((a) => a.id === selectedId);

              return (
                <div
                  key={index}
                  className="relative aspect-square bg-[#1e1f26] rounded-lg border-2 border-gray-700 flex items-center justify-center"
                >
                  {achievement ? (
                    <div className="relative w-full h-full p-4">
                      <Image
                        src={`/badgets/${achievement.id}.png`}
                        alt={achievement.name}
                        fill
                        className="object-contain p-2"
                      />
                      <button
                        onClick={() => toggleAchievementSelection(achievement.id)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-600 text-4xl">+</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {achievements.map((achievement) => {
            const progressPercentage = Math.min(
              (achievement.progress / achievement.threshold) * 100,
              100
            );
            const isSelected = selectedAchievementIds.includes(achievement.id);
            const canSelect = achievement.reached && (isSelected || selectedAchievementIds.length < 3);

            return (
              <div
                key={achievement.id}
                className={`relative rounded-xl p-6 transition-all duration-300 ${
                  achievement.reached
                    ? isSelected
                      ? 'bg-gradient-to-br from-[#2a2c38] to-[#3a3c48] border-2 border-purple-500/70 shadow-lg shadow-purple-500/30'
                      : 'bg-gradient-to-br from-[#2a2c38] to-[#3a3c48] border-2 border-green-500/50 shadow-lg shadow-green-500/20'
                    : 'bg-[#2a2c38] border-2 border-gray-700/50 opacity-75'
                }`}
              >
                {/* Achievement Badge */}
                <div className="flex justify-center mb-4">
                  <div className={`relative w-24 h-24 ${!achievement.reached && 'opacity-40 grayscale'}`}>
                    <Image
                      src={`/badgets/${achievement.id}.png`}
                      alt={achievement.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        // fallback for missing images
                        e.currentTarget.src = '/badgets/1.png';
                      }}
                    />
                  </div>
                </div>

                {/* Achievement reached badge */}
                {achievement.reached && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    UNLOCKED
                  </div>
                )}

                {/* Achievement name */}
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  {achievement.name}
                </h3>

                {/* Achievement title */}
                <div className="text-center mb-3">
                  <span className="inline-block bg-purple-500/20 text-purple-300 text-sm font-semibold px-3 py-1 rounded-full border border-purple-500/30">
                    {achievement.titel}
                  </span>
                </div>

                {/* Achievement description */}
                <p className="text-gray-400 text-sm text-center mb-4">
                  {achievement.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>
                      {achievement.progress} / {achievement.threshold}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        achievement.reached
                          ? 'bg-gradient-to-r from-green-500 to-green-400'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Selection Button (only for reached achievements) */}
                {achievement.reached && (
                  <button
                    onClick={() => toggleAchievementSelection(achievement.id)}
                    disabled={!canSelect}
                    className={`w-full mt-4 py-2 px-4 rounded-lg font-semibold transition-all ${
                      isSelected
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : canSelect
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : canSelect ? 'Select for Showcase' : 'Max 3 Selected'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}