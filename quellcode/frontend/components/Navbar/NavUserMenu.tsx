'use client'; // Marks this as a Client Component in Next.js 13+

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // Next.js optimized Image component
import Link from 'next/link'; // For navigation between pages
import { signOut, useSession } from 'next-auth/react'; // Authentication hooks from NextAuth.js
import { fetchGoogleUserInfo } from '@/lib/userService'; // Import the user service
import { GoogleUserInfo } from '@/types/interfaces';

/**
 * UserMenu component
 * Displays the user's profile image as a button that toggles a dropdown menu.
 * The dropdown shows the user's name and a logout button.
 * Closes automatically when clicking outside the menu.
 */
export default function UserMenu() {
  const { data: session } = useSession(); // Get current user session for auth check
  const [isOpen, setIsOpen] = useState(false); // Toggle dropdown menu visibility
  const menuRef = useRef<HTMLDivElement>(null); // Ref to the dropdown container
  const [userInfo, setUserInfo] = useState<GoogleUserInfo | null>(null); // Store user info from API
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch user info from API
  useEffect(() => {
    async function loadUserInfo() {
      if (!session) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await fetchGoogleUserInfo();
        setUserInfo(data);
      } catch (error) {
        console.error('Failed to load user info:', error);
        // Fallback to session data if API fails
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserInfo();
  }, [session]);

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close the menu if the click is outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    // Dropdown container with reference
    <div className="relative" ref={menuRef}>
      {/* Button that toggles the menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center p-1 rounded-full transition-all ${isOpen ? 'ring-2 ring-[#F596D3]' : ''}`}
      >
        {/* Show user's profile image if available, otherwise show fallback with "?" */}
        {(userInfo?.profilePicture || session?.user?.image) ? (
          <Image
            src={userInfo?.profilePicture || session?.user?.image || ''}
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full object-cover shadow-md"
            unoptimized 
            priority
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#F596D3] to-[#D247BF] flex items-center justify-center shadow-md">
            <span className="text-sm font-medium text-white">
              {loading ? '...' : (userInfo?.name?.charAt(0).toUpperCase() || session?.user?.name?.charAt(0).toUpperCase() || '?')}
            </span>
          </div>
        )}
      </button>

      {/* Dropdown menu content */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-gradient-to-br from-[#1a1b23] via-[#1e1f26] to-[#252730] rounded-2xl shadow-2xl py-1 z-50 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
          {/* User info section with gradient background */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              {(userInfo?.profilePicture || session?.user?.image) ? (
                <Image
                  src={userInfo?.profilePicture || session?.user?.image || ''}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover shadow-lg ring-2 ring-[#F596D3]/30"
                  unoptimized 
                  priority
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F596D3] to-[#D247BF] flex items-center justify-center shadow-lg">
                  <span className="text-base font-semibold text-white">
                    {userInfo?.name?.charAt(0).toUpperCase() || session?.user?.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {userInfo?.name || session?.user?.name || 'User'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {/* Profile link */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-[#F596D3]/10 hover:to-[#D247BF]/10 hover:text-white transition-all duration-200 group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#F596D3] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium">Profile</span>
            </Link>

            {/* Logout button */}
            <button
              onClick={() => {
                sessionStorage.removeItem('stockPrices');
                signOut({ callbackUrl: '/' });
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 hover:text-red-400 transition-all duration-200 group border-t border-gray-700/30 mt-1"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}