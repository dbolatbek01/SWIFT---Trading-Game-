'use client';
import Link from 'next/link';
import Image from 'next/image';
import TopNavbar from '@/app/navigation/Navbar';

/**
 * NotFound Component
 * 
 * This component displays a user-friendly interface when a requested page is not found.
 * It includes a navigation bar, an error message with a graphical icon, and several
 * links to guide the user back to main sections of the application such as the homepage,
 * FAQ section, and portfolio page. Additionally, it provides contact information for
 * further assistance.
 * 
 * The component ensures consistent styling with a dark background and uses animations
 * and hover effects to enhance user experience.
 */

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-800">
      <div className="container mx-auto px-25 sticky top-0 z-100">
        <TopNavbar />
      </div>
      <div className="container mx-auto px-4 flex flex-1">
        <main className="flex-1 p-10 flex flex-col items-center justify-center">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-8">
              <svg 
                className="mx-auto" 
                width="120" 
                height="120" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* The top part */}
                <path 
                  d="M10.5 3.75H13.5L12.5778 15H11.4222L10.5 3.75Z" 
                  fill="#61DAFB"
                />
                {/* The bottom part */}
                <circle 
                  cx="12" 
                  cy="18" 
                  r="1.5" 
                  fill="#61DAFB"
                />
                {/* The circle around it */}
                <path 
                  d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                  stroke="#1fc0f1" 
                  strokeWidth="2"
                />
              </svg>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Oops! This site does not exist.
            </h1>
            
            <p className="text-gray-300 text-xl mb-10">
              Don&apos;t worry, here are some links to get you going:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Link href="/home" className="flex flex-col items-center p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl hover:bg-gray-700 transition-colors">
                <Image
                  src="/icons/icon_home.png"
                  width={40}
                  height={40}
                  alt="Home Icon"
                  className="mb-4"
                />
                <span className="text-white font-medium">Homepage</span>
              </Link>
              
              <Link href="/#faq" className="flex flex-col items-center p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl hover:bg-gray-700 transition-colors">
                <svg className="w-12 h-12 mb-4 text-[#61DAFB]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" />
                  <path d="M12 17a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 01-1-1v-3a1 1 0 112 0v3a1 1 0 01-1 1z" />
                </svg>
                <span className="text-white font-medium">FAQ-Section</span>
              </Link>
              
              <Link href="/portfolio" className="flex flex-col items-center p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl hover:bg-gray-700 transition-colors">
                <Image
                  src="/icons/icon_portfolio.png"
                  width={40}
                  height={40}
                  alt="Portfolio Icon"
                  className="mb-4"
                />
                <span className="text-white font-medium">Portfolio</span>
              </Link>
            </div>
            
            <Link 
              href="/home" 
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Back Home
            </Link>
          </div>
            <p className='text-gray-300 text-sm mt-10'>
                Any questions? Text us at: <a href="mailto:example@example.com" className="text-[#1fc0f1] hover:underline">example@example.com</a>
            </p>
        </main>
      </div>
    </div>
  );
}