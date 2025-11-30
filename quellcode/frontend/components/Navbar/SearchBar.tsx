'use client'; // Marks this as a Client Component in Next.js 13+

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import StockGets from '@/components/stocks/StockGets'; // HOC/component that fetches stock data
import { Stock } from '@/types/interfaces'; // Stock type definition

/**
 * SearchBarContent
 * Displays a search input for stocks with live filtering and suggestions.
 * Shows filtered results as the user types, or popular random stocks if the query is empty.
 * Handles keyboard focus and closes dropdowns on outside clicks.
 */
function SearchBarContent({ stocks, getStockPrice }: { stocks: Stock[], getStockPrice: (id: number) => Promise<number | null> }) {
  const [query, setQuery] = useState(''); // User input for search
  const [results, setResults] = useState<Stock[]>([]); // Filtered search results
  const [stockPrices, setStockPrices] = useState<Record<number, number | null>>({}); // Map stock id to price
  // getStockPrice will be injected from StockGets via props
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [isFocused, setIsFocused] = useState(false); // Tracks if the input is focused
  const [randomStocks, setRandomStocks] = useState<Stock[]>([]); // Randomly selected stocks for suggestions
  const router = useRouter(); // Navigation hook
  const searchRef = useRef<HTMLDivElement>(null); // Ref to detect outside clicks

  // Close dropdown if user clicks outside the search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Filters the list of stocks based on user query with a debounce delay.
   * Only filters if query is present, resets results if empty.
   * Only includes stocks with a valid price.
   */
  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.length < 1) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const filtered = stocks.filter((stock: Stock) => {
        const price = stockPrices[stock.id];
        return (
          (stock.stockname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.shortname.toLowerCase().includes(searchQuery.toLowerCase())) &&
          price !== undefined && price !== null
        );
      });
      setResults(filtered);
    }, 300); // Debounce delay

    return () => clearTimeout(timer); // Cleanup timeout if query changes
  }, [stocks, stockPrices]);

  // Populate random stock suggestions on initial load
  useEffect(() => {
    if (stocks.length > 0 && randomStocks.length === 0 && !isLoadingPrices) {
      const pricedStocks = stocks.filter((stock) => {
        const price = stockPrices[stock.id];
        return price !== undefined && price !== null;
      });
      const shuffled = [...pricedStocks].sort(() => 0.5 - Math.random());
      setRandomStocks(shuffled.slice(0, 3));
    }
  }, [stocks, randomStocks.length, stockPrices, isLoadingPrices]);
  // Fetch prices for all stocks on mount using getStockPrice from StockGets
  useEffect(() => {
    let isMounted = true;
    async function fetchPrices() {
      if (stocks.length > 0) {
        setIsLoadingPrices(true);
        // Try to load from sessionStorage first
        const cached = sessionStorage.getItem('stockPrices');
        if (cached) {
          setStockPrices(JSON.parse(cached));
          setIsLoadingPrices(false);
          return;
        }
        const prices: Record<number, number | null> = {};
        await Promise.all(
          stocks.map(async (stock) => {
            prices[stock.id] = await getStockPrice(stock.id);
          })
        );
        if (isMounted) setStockPrices(prices);
        sessionStorage.setItem('stockPrices', JSON.stringify(prices));
        setIsLoadingPrices(false);
      }
    }
    fetchPrices();
    return () => { isMounted = false; };
  }, [stocks, getStockPrice]);

  // Trigger search when query changes
  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  return (
    <div className="relative w-[450px] min-w-[200px]" ref={searchRef}>
      {/* Search input with search icon */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Image 
            src="/icons/icon_suchen.png" alt="Search icon" width={20} height={30}
          />
        </div>
        <input
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="bg-white/10 hover:bg-white/15 focus:bg-white/10 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F596D3]/50 w-full text-white placeholder-gray-400 transition-all duration-200"
        />
      </div>

      {/* Dropdown with results or suggestions */}
      {isFocused && (
        <div className="absolute z-50 mt-2 w-full bg-gradient-to-b from-[#1e1f26]/95 to-[#2a2c38]/95 rounded-xl shadow-xl border border-gray-700 max-h-96 overflow-y-auto backdrop-blur-sm">
          {/* Link to view all stocks */}
          <Link
            href="/search"
            className="block px-4 py-3 text-[#61DAFB] hover:bg-white/15 font-medium border-b border-gray-700 transition-colors"
            onClick={() => setIsFocused(false)}
          >
            View all stocks →
          </Link>

          {/* Show popular stocks if no query */}
          {!query && (
            <>
              <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                Popular stocks
              </div>
              {randomStocks.map((stock) => (
                <div
                  key={stock.id}
                  onClick={() => router.push(`/stocks/${stock.shortname}/view`)}
                  className="px-4 py-3 hover:bg-white/15 cursor-pointer flex justify-between items-center transition-colors"
                >
                  <div>
                    <div className="font-medium">{stock.shortname}</div>
                    <div className="text-sm text-gray-400">{stock.stockname}</div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Show filtered results if query exists */}
          {query && results.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700 bg-white/10">
                Search results
              </div>
              {results.map((stock) => (
                <div
                  key={stock.id}
                  onClick={() => router.push(`/stocks/${stock.shortname}/view`)}
                  className="px-4 py-3 hover:bg-white/15 cursor-pointer flex justify-between items-center transition-colors"
                >
                  <div>
                    <div className="font-medium">{stock.shortname}</div>
                    <div className="text-sm text-gray-400">{stock.stockname}</div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Show message if no search results */}
          {query && results.length === 0 && (
            <div className="px-4 py-3 text-gray-400">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * SearchBar
 * Wrapper component that fetches stocks and passes them to SearchBarContent.
 * Handles the data-fetching logic and leaves UI responsibilities to SearchBarContent.
 */
export default function SearchBar() {
  return (
    <StockGets>
      {({ stocks, getStockPrice }) => (
        <SearchBarContent stocks={stocks} getStockPrice={getStockPrice} />
      )}
    </StockGets>
  );
}