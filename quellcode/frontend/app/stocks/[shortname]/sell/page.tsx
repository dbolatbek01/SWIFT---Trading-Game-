'use client'; // Marks this file as a Client Component, allowing usage of client-side hooks like useParams

import TopNavbar from '@/app/navigation/Navbar'; // Imports the top navigation bar
import StockGets from '@/components/stocks/StockGets'; // Component responsible for fetching stock data
import SellPageContent from '@/components/transactionPages/sellPage/SellPageContent'; // Main content component for selling stocks
import ScrollToTop from '@/components/ScrollToTop'; // Scroll-to-top UI component
import { useParams } from 'next/navigation'; // Hook to access route parameters in a client component

/**
 * SellPage Component
 * Main page for selling shares of a stock.
 * - Displays a sticky navigation bar
 * - Shows the stock's shortname in the header and description
 * - Fetches stock data and renders the sell form/content
 * - Includes a scroll-to-top button
 */
export default function SellPage() {
  // Extract the stock shortname from the route parameters (e.g., /stocks/[shortname]/sell)
  const { shortname } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1f26] to-[#2a2c38]">
      {/* Top navigation bar with sticky positioning */}
      <div className="container mx-auto sticky top-0 z-100">
        <TopNavbar />
      </div>

      {/* Main content section */}
      <div className="flex flex-1">
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {/* Page heading and description */}
            <div className="text-center mb-4">
              <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
                Sell shares of {shortname} {/* Displays the specific stock symbol being sold */}
              </p>
            </div>

            {/* Fetch stock data and render the SellPageContent component */}
            <StockGets>
              {({ stocks, getStockPrice }) => (
                <SellPageContent stocks={stocks} getStockPrice={getStockPrice} />
              )}
            </StockGets>
          </div>
        </main>
      </div>

      {/* Floating scroll-to-top button */}
      <ScrollToTop />
    </div>
  );
}