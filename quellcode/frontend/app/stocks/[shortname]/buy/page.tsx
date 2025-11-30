'use client'; // Declares this as a Client Component (required for using hooks like useParams)

import TopNavbar from '@/app/navigation/Navbar'; // Top navigation bar
import StockGets from '@/components/stocks/StockGets'; // Component for fetching stock data
import BuyPageContent from '@/components/transactionPages/buyPage/BuyPageContent'; // Component rendering the stock buying form/content
import ScrollToTop from '@/components/ScrollToTop'; // Scroll-to-top button component
import { useParams } from 'next/navigation'; // Hook for accessing route parameters

/**
 * BuyPage Component
 * Main page for buying stocks.
 * - Displays a sticky navigation bar
 * - Shows the stock's shortname in the header
 * - Fetches stock data and renders the buy form/content
 * - Includes a scroll-to-top button
 */
export default function BuyPage() {
  // Extract the stock shortname from the URL parameters
  const { shortname } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1f26] to-[#2a2c38]">
      {/* Sticky top navigation bar */}
      <div className="container mx-auto sticky top-0 z-100">
        <TopNavbar />
      </div>

      {/* Main content layout */}
      <div className="flex flex-1">
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {/* Header section */}
            <div className="text-center mb-4">
              <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
                Buy shares of {shortname} {/* Dynamically displays the stock's shortname */}
              </p>
            </div>

            {/* Fetch and provide stock data to the BuyPageContent component */}
            <StockGets>
              {({ stocks, getStockPrice }) => (
                <BuyPageContent stocks={stocks} getStockPrice={getStockPrice} />
              )}
            </StockGets>
          </div>
        </main>
      </div>

      {/* Scroll-to-top button */}
      <ScrollToTop />
    </div>
  );
}