// Only catches errors from server components and not from client components.
// gloval-error.tsx catches errors from client components
"use client"

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TopNavbar from '@/app/navigation/Navbar';

/**
 * Error component for displaying error messages in the application.
 * 
 * This component captures errors from server components and provides a
 * user-friendly interface to inform the user about the error. It includes
 * options to attempt a reset or navigate to other parts of the application.
 * 
 * Props:
 * - error: An object containing error details, including an optional digest.
 * - reset: A function to be called when the user wants to retry the operation.
 * 
 * The component logs the error to the console and displays a warning icon,
 * an error message, and navigation options for the user.
 */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="container mx-auto px-25 sticky top-0 z-100">
        <TopNavbar />
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
                {/* Warning icon */}
                <circle 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="#F596D3" 
                  strokeWidth="2"
                />
                <path 
                  d="M12 7V13" 
                  stroke="#F596D3" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <circle 
                  cx="12" 
                  cy="17" 
                  r="1" 
                  fill="#F596D3"
                />
              </svg>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#F596D3] via-[#D247BF] to-[#A30CA0] text-transparent bg-clip-text">
              Oops! Es ist ein Fehler aufgetreten.
            </h1>
            
            <p className="text-gray-300 text-xl mb-10">
              {error.message || "Etwas ist schief gelaufen."}
            </p>
            
            <div className="flex flex-col gap-6 mb-12">
              <button
                onClick={() => reset()}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#F596D3] to-[#D247BF] hover:from-[#D247BF] hover:to-[#A30CA0] text-white font-medium rounded-lg transition-colors mx-auto"
              >
                Erneut versuchen
              </button>
              
              <Link 
                href="/home" 
                className="w-full md:w-auto inline-block px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors mx-auto"
              >
                Zurück zur Hauptseite
              </Link>
            </div>
            
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
                <svg className="w-10 h-10 mb-4 text-[#61DAFB]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" />
                  <path d="M12 17a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 01-1-1v-3a1 1 0 112 0v3a1 1 0 01-1 1z" />
                </svg>
                <span className="text-white font-medium">FAQ-Sektion</span>
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
            
            <p className='text-gray-300 text-sm mt-10'>
              Bei weiterhin bestehenden Problemen: <a href="mailto:example@example.com" className="text-[#F596D3] hover:underline">example@example.com</a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}