'use client'; // Ensures this component runs on the client side in Next.js

import React, { useEffect, useState, useCallback, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import StockGets from '@/components/stocks/StockGets'; // HOC that provides stocks data
import { 
  getPortfolioAllValues 
} from '@/components/Portfolio/portfolioGets'; // Fetching functions for portfolio data
import OpenOrdersModal from '@/components/Portfolio/OpenOrdersModal';

import {
  Stock,
  Holding,
  PortfolioDataWithCurrentPrice,
  PortfolioDataWithInvestedValue
} from '@/types/interfaces';

interface HoldingsListProps {
  token: string; // Auth token to fetch portfolio data
}

/**
 * Combines invested and current values with stock data into a holdings list.
 * @param investedValues - Array of portfolio data containing invested values.
 * @param currentValues - Array of portfolio data containing current prices.
 * @param stockMap - Map of stock IDs to Stock objects.
 * @returns Array of Holding objects combining stock, invested, and current values.
 */
function buildHoldings(
  investedValues: PortfolioDataWithInvestedValue[],
  currentValues: PortfolioDataWithCurrentPrice[],
  stockMap: Map<number, Stock>
): Holding[] {
  const currentMap = new Map(currentValues.map((c) => [c.idStock, c]));

  return investedValues
    .map((inv) => {
      const current = currentMap.get(inv.idStock);
      const stock = stockMap.get(inv.idStock);
      if (!current || !stock) return null;

      return {
        stock,
        investedAmount: inv.value * inv.count,
        currentValue: current.latestPrice * current.count
      };
    })
    .filter(Boolean) as Holding[];
}

/**
 * Main UI component rendering holdings and handling all data and state logic.
 * @param stocks - The list of stocks available.
 * @param token - The authentication token.
 */
function HoldingsListContent({ stocks, token }: { stocks: Stock[]; token: string }) {
  const router = useRouter();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition(); // Enables concurrent rendering
  const [showPercentage, setShowPercentage] = useState<boolean>(true); // Toggle between % and absolute values
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // Dropdown state
  const [showOrdersModal, setShowOrdersModal] = useState(false); // Modal state for open orders

  // Memoize the mapping from stock IDs to Stock objects for efficient lookup.
  const stockMap = useMemo(
    () => new Map(stocks.map((stock) => [stock.id, stock])),
    [stocks]
  );

  /**
   * Fetches and calculates the user's current holdings from API.
   */
  const fetchHoldings = useCallback(async () => {
    setLoading(true);
    try {
      // Holt Invested- und Current-Values parallel
      const { invested, current } = await getPortfolioAllValues(token);
      const calculatedHoldings = buildHoldings(invested, current, stockMap).sort(
        (a, b) => b.currentValue - a.currentValue
      );
      setHoldings(calculatedHoldings);
    } catch (error) {
      console.error('Error loading holdings:', error);
    } finally {
      setLoading(false);
    }
  }, [token, stockMap]);

  /**
   * Triggers loading of holdings when stocks are available.
   */
  useEffect(() => {
    if (stocks.length > 0) {
      startTransition(() => {
        fetchHoldings();
      });
    }
  }, [stocks, fetchHoldings]);

  /**
   * Closes dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  /**
   * Toggles dropdown visibility.
   * @param e - Mouse click event
   */
  const toggleDropdown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click bubbling (to avoid navigation)
    setIsDropdownOpen(prev => !prev);
  }, []);

  /**
   * Handles selection of display mode and closes dropdown.
   * @param showPercent - Whether to show percentage or absolute values
   */
  const handleSelection = useCallback((showPercent: boolean) => {
    setShowPercentage(showPercent);
    setIsDropdownOpen(false);
  }, []);

  // Loading UI
  if (loading || isPending) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text font-bold pl-2">
            Investments
          </h2>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/30 transition-colors duration-200 text-white text-xs font-medium"
            >
              <span>{showPercentage ? '(%)' : '($)'}</span>
              <svg 
                className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-44 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleSelection(true)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-all duration-300 rounded-t-lg ${
                    showPercentage 
                      ? 'text-white' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>Since Purchase (%)</span>
                  {showPercentage && (
                    <svg className="w-3 h-3 text-[#61DAFB]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleSelection(false)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-all duration-300 rounded-b-lg ${
                    !showPercentage 
                      ? 'text-white' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>Since Purchase ($)</span>
                  {!showPercentage && (
                    <svg className="w-3 h-3 text-[#61DAFB]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg bg-black/10 animate-pulse">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="h-4 w-32 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-16 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state UI if there are no holdings
  if (holdings.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text font-bold pl-2">
            Investments
          </h2>
          <button
            className="p-2 rounded-full bg-black/20 text-gray-300 hover:bg-black/40 hover:text-white transition flex items-center justify-center"
            title="Open Orders"
            aria-label="Open Orders"
            onClick={() => setShowOrdersModal(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <OpenOrdersModal show={showOrdersModal} onClose={() => setShowOrdersModal(false)} />
        <button 
          onClick={() => router.push("/search")}
          className="flex flex-col items-center justify-center w-full p-6 space-y-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#61DAFB]/60 via-[#1fc0f1]/60 to-[#03a3d7]/60 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-white font-bold">Buy stocks</span>
        </button>
      </div>
    );
  }

  // Main holdings list UI
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text font-bold pl-2">
          Investments
        </h2>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full bg-black/20 text-gray-300 hover:bg-black/40 hover:text-white transition flex items-center justify-center"
            title="Open Orders"
            aria-label="Open Orders"
            onClick={() => setShowOrdersModal(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1.5 px-2.5 py-2.5 rounded-lg bg-black/20 backdrop-blur-md hover:bg-black/30 transition-colors duration-200 text-white text-xs font-medium"
            >
              <span>{showPercentage ? '(%)' : '($)'}</span>
              <svg 
                className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-44 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleSelection(true)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-all duration-300 rounded-t-lg ${
                    showPercentage 
                      ? 'text-white' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>Since Purchase (%)</span>
                  {showPercentage && (
                    <svg className="w-3 h-3 text-[#61DAFB]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleSelection(false)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-all duration-300 rounded-b-lg ${
                    !showPercentage 
                      ? 'text-white' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>Since Purchase ($)</span>
                  {!showPercentage && (
                    <svg className="w-3 h-3 text-[#61DAFB]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <OpenOrdersModal show={showOrdersModal} onClose={() => setShowOrdersModal(false)} />
      <div className="flex flex-col space-y-4">
        {holdings.map((holding) => {
          const profitLoss = holding.currentValue - holding.investedAmount;
          const profitLossPercentage = (profitLoss / holding.investedAmount) * 100;
          const isPositive = profitLoss >= 0;

          return (
            <div
              key={holding.stock.id}
              onClick={() => router.push(`/stocks/${holding.stock.shortname}/view`)}
              className="flex items-center justify-between hover:bg-white/5 px-4 py-3 rounded-lg cursor-pointer transition"
            >
              {/* Stock Name & Value */}
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-white font-semibold">{holding.stock.stockname}</p>
                  <p className="text-gray-400 text-sm">
                    {holding.currentValue.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </p>
                </div>
              </div>

              {/* Profit/Loss Display */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPercentage(prev => !prev);
                }}
                className={`text-sm font-semibold cursor-pointer ${isPositive ? 'text-green-500' : 'text-red-500'}`}
              >
                {isPositive ? '▲' : '▼'}
                {showPercentage 
                  ? ` ${Math.abs(profitLossPercentage).toFixed(2)}%`
                  : ` ${Math.abs(profitLoss).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}`
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Wrapper component that fetches stock list and passes them to content component.
 * @param token - The authentication token for API calls.
 */
export default function HoldingsList({ token }: HoldingsListProps) {
  return (
    <StockGets>
      {({ stocks }) => <HoldingsListContent stocks={stocks} token={token} />}
    </StockGets>
  );
}