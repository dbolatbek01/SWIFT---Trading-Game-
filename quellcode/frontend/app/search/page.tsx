'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import TopNavbar from '@/app/navigation/Navbar';
import StockGets from '@/components/stocks/StockGets';
import { Stock } from '@/types/interfaces';
import ScrollToTop from '@/components/ScrollToTop';

/**
 * Individual Stock Card Component with real-time price
 */
interface StockCardProps {
  stock: Stock;
  onClick: () => void;
}

// Table row component for desktop - now with price filtering
function StockTableRow({ stock, onClick }: Omit<StockCardProps, 'getStockPrice'>) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setIsLoadingPrice(true);
    const cached = sessionStorage.getItem('stockPrices');
    if (cached) {
      const prices = JSON.parse(cached);
      const price = prices[stock.id];
      setCurrentPrice(price);
      setIsLoadingPrice(false);
      setShouldRender(price !== null);
      return;
    }
    setCurrentPrice(null);
    setIsLoadingPrice(false);
    setShouldRender(false);
  }, [stock.id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Navigating to:', `/stocks/${stock.shortname}/view`);
    onClick();
  };

  // Show loading skeleton while checking price
  if (isLoadingPrice) {
    return (
      <tr className="animate-pulse">
        <td className="p-4">
          <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </td>
        <td className="p-4">
          <div className="h-4 bg-gray-600 rounded w-16"></div>
        </td>
        <td className="p-4">
          <div className="h-4 bg-gray-600 rounded w-20"></div>
        </td>
        <td className="p-4">
          <div className="h-6 bg-gray-600 rounded w-16"></div>
        </td>
      </tr>
    );
  }

  // Don't render if no valid price
  if (!shouldRender) {
    return null;
  }

  return (
    <tr 
      onClick={handleClick}
      className="hover:bg-[#2a2c38] transition-all duration-300 cursor-pointer group hover:shadow-md relative overflow-hidden"
    >
      {/* Dynamic gradient line that grows from left to right on hover */}
      <td className="p-4 relative" onClick={handleClick}>
        <div className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#61DAFB] to-[#F596D3] transition-all duration-500 ease-out z-10"></div>
        <div>
          <div className="font-medium text-gray-100 group-hover:text-white transition-colors duration-200">
            {stock.stockname}
          </div>
          {stock.industry && (
            <div className="text-xs text-gray-400 group-hover:text-gray-300 truncate mt-1 transition-colors duration-200">
              {stock.industry}
            </div>
          )}
        </div>
      </td>
      <td className="p-4" onClick={handleClick}>
        <span className="font-mono text-[#61DAFB] font-medium group-hover:text-[#61DAFB] group-hover:font-semibold transition-all duration-200">
          {stock.shortname}
        </span>
      </td>
      <td className="p-4" onClick={handleClick}>
        {isLoadingPrice ? (
          <div className="animate-pulse bg-gray-600 h-5 w-16 rounded"></div>
        ) : currentPrice !== null ? (
          <span className="font-semibold text-white group-hover:scale-105 transition-all duration-200">
            ${currentPrice.toFixed(2)}
          </span>
        ) : (
          <span className="text-red-400">N/A</span>
        )}
      </td>
      <td className="p-4" onClick={handleClick}>
        {stock.sector && (
          <span className="text-xs px-2 py-1 bg-[#61DAFB]/10 text-[#61DAFB] rounded border border-[#61DAFB]/20 group-hover:bg-[#61DAFB]/20 group-hover:border-[#61DAFB]/40 group-hover:shadow-sm transition-all duration-200">
            {stock.sector}
          </span>
        )}
      </td>
    </tr>
  );
}

// Mobile card component
function StockMobileCard({ stock, onClick }: Omit<StockCardProps, 'getStockPrice'>) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setIsLoadingPrice(true);
    const cached = sessionStorage.getItem('stockPrices');
    if (cached) {
      const prices = JSON.parse(cached);
      const price = prices[stock.id];
      setCurrentPrice(price);
      setIsLoadingPrice(false);
      setShouldRender(price !== null);
      return;
    }
    setCurrentPrice(null);
    setIsLoadingPrice(false);
    setShouldRender(false);
  }, [stock.id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Mobile - Navigating to:', `/stocks/${stock.shortname}/view`);
    onClick();
  };

  // Show loading skeleton while checking price
  if (isLoadingPrice) {
    return (
      <div className="p-4 animate-pulse">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-16"></div>
          </div>
          <div className="h-6 bg-gray-600 rounded w-20"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-600 rounded w-16"></div>
          <div className="h-6 bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    );
  }

  // Don't render if no valid price
  if (!shouldRender) {
    return null;
  }

  return (
    <div
      onClick={handleClick}
      className="p-4 hover:bg-[#2a2c38] transition-colors cursor-pointer group"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-100 group-hover:text-[#61DAFB] transition-colors truncate">
              {stock.stockname}
            </div>
            <div className="font-mono text-[#61DAFB] text-sm">
              {stock.shortname}
            </div>
          </div>
          <div className="ml-4">
            {isLoadingPrice ? (
              <div className="animate-pulse bg-gray-600 h-6 w-20 rounded"></div>
            ) : currentPrice !== null ? (
              <div className="text-lg font-semibold text-white">
                ${currentPrice.toFixed(2)}
              </div>
            ) : (
              <div className="text-red-400">N/A</div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {stock.sector && (
            <span className="text-xs px-2 py-1 bg-[#61DAFB]/10 text-[#61DAFB] rounded border border-[#61DAFB]/20">
              {stock.sector}
            </span>
          )}
          {stock.industry && (
            <span className="text-xs px-2 py-1 bg-[#F596D3]/10 text-[#F596D3] rounded border border-[#F596D3]/20">
              {stock.industry}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * SearchPage component displays a stock explorer interface
 * with a navbar, a grid of premium stock cards, and a scroll-to-top button.
 * 
 * - Uses Next.js navigation for routing.
 * - Fetches and displays stock data using StockGets.
 * - Includes a visually enhanced UI with gradient backgrounds, accent lines, and hover effects.
 */
export default function SearchPage() {
  const router = useRouter();

  return (
    <div className="min-h-full bg-gradient-to-b from-[#1e1f26] to-[#2a2c38]">
      {/* Navigation remains unchanged */}
      <div className="sticky top-0 z-50">
        <div className="container mx-auto">
          <TopNavbar />
        </div>
      </div>
      
      {/* Main page content */}
      <div className="flex flex-1">
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#61DAFB] to-[#03a3d7]">
                Stock Explorer
              </h1>
              <p className="mt-3 text-lg text-gray-400">
                Discover <span className="text-[#61DAFB]">market opportunities</span> with precision
              </p>
            </div>

            {/* Modern stock table view */}
            <StockGets>
              {({ stocks }) => (
                <div className="overflow-hidden">
                  {/* No stocks message */}
                  {stocks.length === 0 && (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#61DAFB] mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading stocks...</p>
                    </div>
                  )}
                  
                  {/* Stock display */}
                  {stocks.length > 0 && (
                    <>
                      {/* Use proper HTML table for desktop */}
                      <div className="hidden md:block">
                    <table className="w-full">
                      <thead className="bg-[#1e1f26] border-b border-[#2d303d]">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-gray-400 w-2/5">Company</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400 w-1/5">Symbol</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400 w-1/5">Price</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400 w-1/5">Sector</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stocks.map((stock: Stock) => (
                          <StockTableRow 
                            key={stock.id}
                            stock={stock}
                            onClick={() => router.push(`/stocks/${stock.shortname}/view`)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                      {/* Mobile card layout */}
                      <div className="md:hidden divide-y divide-[#2d303d]">
                        {stocks.map((stock: Stock) => (
                          <StockMobileCard 
                            key={stock.id}
                            stock={stock}
                            onClick={() => router.push(`/stocks/${stock.shortname}/view`)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </StockGets>
          </div>
        </main>
      </div>

      {/* Floating Scroll to Top button */}
      <ScrollToTop />
    </div>
  );
}