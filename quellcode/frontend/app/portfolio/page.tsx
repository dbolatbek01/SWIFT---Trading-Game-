'use client'; // Marks this as a Client Component (necessary for using hooks and interactivity)

import TopNavbar from '@/app/navigation/Navbar'; // Import the top navigation bar
import PortfolioChart from '@/components/Portfolio/portfolioChart'; // Import the portfolio chart component
import PortfolioRelativeChart from '@/components/Portfolio/portfolioRelativeChart'; // Import the portfolio performance chart component
import HoldingsList from '@/components/Portfolio/holdingsList'; // Import the holdings list component
import { useAuthToken } from '@/lib/useAuthToken'; // Import a custom hook to get the user's auth token
import { useState } from 'react';

/**
 * PortfolioPage Component
 * Main page for the portfolio section.
 * Displays a sticky navigation bar, two portfolio charts (total value and performance), and a list of current holdings.
 * The authentication token is retrieved via a custom hook and passed to child components for secure API calls.
 */
export default function PortfolioPage() {
  // Retrieve the authentication token using a custom hook
  const token = useAuthToken(); 
  
  // State for chart type selection
  const [selectedChartType, setSelectedChartType] = useState<'total' | 'performance'>('total');

  // Return the UI layout for the portfolio page
  return (
    <div className="h-full overflow-hidden">
      {/* Sticky top navigation bar */}
      <div className="container mx-auto sticky top-0 z-100">
        <TopNavbar />
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4">
        <main className="pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Chart takes up two columns on large screens */}
            <div className="lg:col-span-2">
              <div className="h-[calc(100vh-10rem)]">
                {/* Conditional chart rendering with integrated tabs */}
                {selectedChartType === 'total' ? (
                  <PortfolioChart 
                    token={token} 
                    onTabChange={(tab) => setSelectedChartType(tab)}
                  />
                ) : (
                  <PortfolioRelativeChart 
                    token={token} 
                    onTabChange={(tab) => setSelectedChartType(tab)}
                  />
                )}
              </div>
            </div>
            {/* Holdings list takes up one column on large screens */}
            <div 
              className="lg:col-span-1 mt-3 max-h-[calc(100vh-17rem)] overflow-y-auto rounded-2xl custom-scrollbar"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(75, 85, 99, 0.3) transparent',
              }}
            >
              <HoldingsList token={token} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}