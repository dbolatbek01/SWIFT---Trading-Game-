'use client'; // Indicates this component is a Client Component in Next.js 13+

import React from 'react'; // Import React for Fragment
import Link from 'next/link'; // For navigation between pages
import Image from 'next/image'; // Optimized image component from Next.js
import { usePathname } from 'next/navigation'; // Hook to get the current pathname

/**
 * Main navigation links component.
 * Renders navigation buttons with icons for Home, Portfolio, and Cash.
 * Highlights the active link and shows a tooltip on hover or when active.
 */
export default function NavLinks() {
  const pathname = usePathname(); // Get the current URL path

  // Defines an array of navigation links with name, URL, and icon
  const links = [
    { 
      name: 'Achievements', 
      href: '/achievements', 
      icon: <Image src="/icons/icon_achievement.png" width={20} height={20} alt="Achievement" />
    },
    { 
      name: 'Leaderboard', 
      href: '/leaderboard', 
      icon: <Image src="/icons/icon_leaderboard.png" width={22} height={22} alt="Leaderboard" />
    },
    { 
      name: 'Home', 
      href: '/home', 
      icon: <Image src="/icons/icon_home.png" width={22} height={22} alt="Home" />
    },
    { 
      name: 'Portfolio', 
      href: '/portfolio', 
      icon: <Image src="/icons/icon_portfolio.png" width={22} height={22} alt="Portfolio" />
    },
    { 
      name: 'Cash', 
      href: '/cash', 
      icon: <Image src="/icons/icon_cashh.png" width={20} height={20} alt="Cash" />
    }
  ];

  return (
    // Container for navigation links with horizontal spacing
    <div className="flex items-center space-x-1">
      {links.map((link, index) => {
        const isActive = pathname === link.href; // Determine if the link is active (matches current path)

        return (
          <React.Fragment key={link.name}>
            {/* Add divider line between Achievement and Home */}
            {index === 2 && <div className="h-6 w-px bg-gray-700 mx-1 sm:mx-2"></div>}
            
            {/* Wrap each link in a container with relative positioning and hover group */}
            <div className="relative group">
            <Link
              href={link.href}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                isActive 
                  ? 'bg-[#61DAFB]/70 text-[#61DAFB]' // Active link styling
                  : 'text-gray-400 hover:text-white hover:bg-white/15' // Inactive link with hover effect
              }`}
            >
              {link.icon} {/* Display the icon for the link */}
            </Link>

              {/* Tooltip label shown on hover or always visible if active */}
              <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs text-white rounded ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } transition-opacity pointer-events-none whitespace-nowrap`}>
                {link.name}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}