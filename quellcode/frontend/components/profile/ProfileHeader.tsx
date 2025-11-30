'use client'

import Image from 'next/image';
import { GoogleUserInfo } from '@/types/interfaces';

interface ProfileHeaderProps {
    userInfo: GoogleUserInfo | null;
}

export default function ProfileHeader({ userInfo }: ProfileHeaderProps) {
    return (
        <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden group">
            {/* Animated gradient orbs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#61DAFB]/20 to-[#F596D3]/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-[#D247BF]/20 to-[#61DAFB]/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-8">
                {/* Profile Picture with enhanced glow */}
                <div className="relative group/avatar flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#61DAFB] via-[#F596D3] to-[#D247BF] rounded-full blur-2xl opacity-40 group-hover/avatar:opacity-60 transition-all duration-500 animate-pulse"></div>
                    {userInfo?.profilePicture ? (
                        <Image
                            src={userInfo.profilePicture}
                            alt="Profile"
                            width={140}
                            height={140}
                            className="relative rounded-full object-cover shadow-2xl ring-4 ring-white/20 group-hover/avatar:ring-white/30 group-hover/avatar:scale-105 transition-all duration-500"
                            unoptimized
                            priority
                        />
                    ) : (
                        <div className="relative w-[140px] h-[140px] rounded-full bg-gradient-to-br from-[#61DAFB] via-[#F596D3] to-[#D247BF] flex items-center justify-center shadow-2xl ring-4 ring-white/20 group-hover/avatar:ring-white/30 group-hover/avatar:scale-105 transition-all duration-500">
                            <span className="text-5xl font-bold text-white">
                                {userInfo?.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                        </div>
                    )}
                </div>

                {/* User name and info */}
                <div className="flex-1 text-center md:text-left space-y-3">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                        {userInfo?.name || 'User'}
                    </h1>
                    
                    {/* Email Badge */}
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#61DAFB]/10 to-[#D247BF]/10 border border-white/10 hover:border-white/20 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#61DAFB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email:</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{userInfo?.email || 'No email provided'}</span>
                    </div>

                    {/* Username Badge */}
                    {userInfo?.username && (
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#61DAFB]/10 to-[#F596D3]/10 border border-white/10 hover:border-white/20 transition-all duration-300 ml-2">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-[#F596D3]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Username:</span>
                            </div>
                            <span className="text-sm font-semibold text-white">{userInfo.username}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
