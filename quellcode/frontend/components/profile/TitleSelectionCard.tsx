'use client'

import { useState, useEffect } from 'react';
import { Achievement, AchievedAchievement, SelectedTitleResponse } from '@/types/interfaces';

interface TitleSelectionCardProps {
    onTitleChange?: () => void;
}

export default function TitleSelectionCard({ onTitleChange }: TitleSelectionCardProps) {
    const [selectedTitle, setSelectedTitle] = useState<SelectedTitleResponse | null>(null);
    const [achievedTitles, setAchievedTitles] = useState<AchievedAchievement[]>([]);
    const [allTitles, setAllTitles] = useState<Achievement[]>([]);
    const [allTitlesMap, setAllTitlesMap] = useState<Map<number, Achievement>>(new Map());
    const [titleLoading, setTitleLoading] = useState(false);

    useEffect(() => {
        loadSelectedTitle();
        loadAchievedTitles();
        loadAllTitles();
    }, []);

    // Load current selected title
    const loadSelectedTitle = async () => {
        try {
            const response = await fetch('/api/achievements/title');
            if (response.ok) {
                const data = await response.json();
                setSelectedTitle(data);
            }
        } catch (err) {
            console.error('Failed to load selected title:', err);
        }
    };

    // Load achieved titles
    const loadAchievedTitles = async () => {
        try {
            const response = await fetch('/api/achievements/achieved');
            if (response.ok) {
                const data = await response.json();
                setAchievedTitles(data);
            }
        } catch (err) {
            console.error('Failed to load achieved titles:', err);
        }
    };

    // Load all possible titles
    const loadAllTitles = async () => {
        try {
            const response = await fetch('/api/achievements/all');
            if (response.ok) {
                const data = await response.json();
                setAllTitles(data);
                // Create a map for easy lookup
                const titleMap = new Map();
                data.forEach((title: Achievement) => titleMap.set(title.id, title));
                setAllTitlesMap(titleMap);
            }
        } catch (err) {
            console.error('Failed to load all titles:', err);
        }
    };

    // Set a new selected title
    const setNewTitle = async (achievementId: number) => {
        setTitleLoading(true);
        try {
            const response = await fetch('/api/achievements/title', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ achievement: achievementId })
            });
            
            if (response.ok) {
                await loadSelectedTitle(); // Reload selected title
                onTitleChange?.(); // Notify parent component if needed
            }
        } catch (err) {
            console.error('Failed to set title:', err);
        } finally {
            setTitleLoading(false);
        }
    };

    return (
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden">
            {/* Animated gradient orbs */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-[#F596D3]/20 to-[#D247BF]/20 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-tr from-[#61DAFB]/20 to-[#F596D3]/20 rounded-full blur-3xl opacity-30"></div>
            
            <div className="relative">
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-[#61DAFB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Select your title
                    </h3>
                    
                    <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-gray-800/20 scrollbar-thumb-gray-600/60 hover:scrollbar-thumb-gray-500/80">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
                            {/* Show achieved titles */}
                            {achievedTitles.map((achievedTitle) => {
                                const titleInfo = allTitlesMap.get(achievedTitle.idAchievement);
                                // Check if this title is currently selected
                                const isSelected = selectedTitle?.idAchievement === achievedTitle.idAchievement;
                                
                                return (
                                    <button
                                        key={`achieved-${achievedTitle.id}`}
                                        onClick={() => setNewTitle(achievedTitle.idAchievement)}
                                        disabled={titleLoading}
                                        className={`text-left p-4 rounded-xl border transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed ${
                                            isSelected 
                                                ? 'bg-gradient-to-br from-[#61DAFB]/20 to-[#F596D3]/20 border-[#61DAFB]/60 ring-2 ring-[#61DAFB]/30' 
                                                : 'bg-gradient-to-br from-white/10 to-white/20 border-white/20 hover:border-[#61DAFB]/50 hover:from-white/15 hover:to-white/25'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                isSelected 
                                                    ? 'bg-gradient-to-br from-[#61DAFB] to-[#F596D3] shadow-lg' 
                                                    : 'bg-gradient-to-br from-[#61DAFB] to-[#F596D3]'
                                            }`}>
                                                {isSelected ? (
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`font-semibold transition-colors duration-300 ${
                                                        isSelected 
                                                            ? 'text-[#61DAFB]' 
                                                            : 'text-white group-hover:text-[#61DAFB]'
                                                    }`}>
                                                        {titleInfo?.titel || 'Unknown Title'}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                            
                            {/* Then show locked titles (not clickable) */}
                            {allTitles
                                .filter(title => !achievedTitles.some(achieved => achieved.idAchievement === title.id))
                                .map((title) => (
                                    <div
                                        key={`locked-${title.id}`}
                                        className="text-left p-4 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-600/40 opacity-60"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-500">
                                                        {title.titel}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {titleLoading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-[#F596D3] border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-3 text-gray-400">Updating title...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
