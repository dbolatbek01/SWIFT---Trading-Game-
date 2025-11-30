'use client'

import { useState, useEffect } from 'react';
import TopNavbar from '@/app/navigation/Navbar';
import { fetchGoogleUserInfo } from '@/lib/userService';
import { GoogleUserInfo } from '@/types/interfaces';
import ProfileHeader from '@/components/profile/ProfileHeader';
import TitleSelectionCard from '@/components/profile/TitleSelectionCard';

export default function Profile(){
    const [userInfo, setUserInfo] = useState<GoogleUserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadUserInfo() {
            try {
                const data = await fetchGoogleUserInfo();
                setUserInfo(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load user information');
            } finally {
                setLoading(false);
            }
        }

        loadUserInfo();
    }, []);

    return(
        <div className="min-h-screen bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] overflow-hidden flex flex-col">
            {/* Navigation bar */}
            <div className="container mx-auto sticky top-0 z-100">
                <TopNavbar />
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 sm:px-6 py-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-[#F596D3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-400">Loading profile...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 max-w-md">
                                <h3 className="text-red-400 font-semibold mb-2">Error</h3>
                                <p className="text-gray-300">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Profile Header Card */}
                            <ProfileHeader userInfo={userInfo} />

                            {/* Title Selection Card */}
                            <TitleSelectionCard />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
