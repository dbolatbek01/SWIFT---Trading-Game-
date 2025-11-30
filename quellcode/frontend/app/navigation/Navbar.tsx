'use client'; // Marks this as a Client Component (required for interactive UI in Next.js 13+)

import Image from 'next/image'; // Next.js Image component for optimized images
import Link from 'next/link'; // Next.js Link component for client-side navigation
import NavLinks from '@/components/Navbar/NavLinks'; // Navigation links component
import UserMenu from '@/components/Navbar/NavUserMenu'; // User dropdown menu (e.g., profile, logout)
import SearchBar from '@/components/Navbar/SearchBar'; // Search bar component

/**
 * TopNavbar Component
 * Displays the main navigation bar at the top of the page.
 * - Includes a logo linking to the home page
 * - Contains a centered search bar
 * - Renders navigation links and a user menu on the right
 */
export default function TopNavbar() {
  return (
    <nav className="grid grid-cols-[auto_1fr_auto] items-center h-19 backdrop-blur-sm rounded-xl relative z-[100] p-2 gap-4">
      {/* Logo that links to the home page */}
      <Link href="/home" className="flex items-center mr-6">
        <Image
          src="/icons/swift_logo.png" 
          width={60}                  
          height={28}                
          alt="Swift Logo"           
          priority                    // High loading priority
          className="hover:opacity-90 transition-opacity" // Hover effect
        />
      </Link>

      {/* Search bar centered between logo and navigation items */}
      <div className="sm:block mx-2 relative z-50">
        <SearchBar />
      </div>

      {/* Navigation links and user menu on the right */}
      <div className="flex items-center justify-end space-x-4 sm:space-x-6">
        <NavLinks /> {/* Main navigation links */}
        <div className="h-6 w-px bg-gray-700 mx-1 sm:mx-2"></div> {/* Divider line */}
        <UserMenu /> {/* User menu (avatar, dropdown, etc.) */}
      </div>
    </nav>
  );
}