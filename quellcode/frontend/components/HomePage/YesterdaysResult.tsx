'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getPortfolioValues } from '@/components/HomePage/PortfolioChartGetsHP';
import IndexGets from '@/components/Index/IndexGets';
import { 
  calculateYesterdaysPortfolioChange, 
  calculateYesterdaysPercentageChange,
  calculatePerformanceDifference 
} from '@/app/api/homepage/yesterdaysResult/calculateYesterdaysChange';

/**
 * Props interface for YesterdaysResult component
 * @interface YesterdaysResultProps
 * @property {string | null} token - Authentication token for API calls
 * @property {number | null} selectedIndexId - Currently selected index ID for comparison
 */
interface YesterdaysResultProps {
  token: string | null;
  selectedIndexId: number | null;
}

/**
 * Component that displays yesterday's portfolio performance compared to a selected index
 * Shows the portfolio change, index change, and the performance difference
 * @component
 * @param {YesterdaysResultProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export default function YesterdaysResult({ token, selectedIndexId }: YesterdaysResultProps) {
  // State for portfolio percentage change from yesterday
  const [portfolioChange, setPortfolioChange] = useState<number | null>(null);
  // State for index percentage change from yesterday
  const [indexChange, setIndexChange] = useState<number | null>(null);
  // Loading state for data fetching
  const [loading, setLoading] = useState(true);
  // Error state for handling fetch failures
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch portfolio data and calculate yesterday's change
   * Uses weekly data to ensure sufficient data points for calculation
   * @returns {Promise<number | null>} The percentage change or null if unavailable
   */
  const fetchPortfolioChange = useCallback(async () => {
    if (!token) return null;

    try {
      // Fetch weekly data to ensure we have enough data points
      const data = await getPortfolioValues(token, 'lastWeek');
      
      if (data && data.length >= 2) {
        // Calculate the change between yesterday and the day before
        const change = calculateYesterdaysPortfolioChange(data);
        return change;
      }
      return null;
    } catch {
      console.error('Error fetching portfolio data');
      return null;
    }
  }, [token]);

  /**
   * Effect to fetch portfolio data when component mounts or dependencies change
   * Handles loading states and error handling
   */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const change = await fetchPortfolioChange();
        setPortfolioChange(change);
      } catch {
        setError('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadData();
    }
  }, [token, fetchPortfolioChange]);

  // Calculate the performance difference between portfolio and index
  const performanceDifference = calculatePerformanceDifference(portfolioChange, indexChange);

  /**
   * Helper function to format percentage values for display
   * @param {number | null} value - The percentage value to format
   * @returns {string} Formatted percentage string with sign and 2 decimal places
   */
  const formatPercentage = (value: number | null): string => {
    if (value === null) return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  /**
   * Determine the color class based on performance difference
   * @param {number | null} diff - The performance difference
   * @returns {string} Tailwind CSS color class
   */
  const getDifferenceColor = (diff: number | null): string => {
    if (diff === null) return 'text-gray-400';
    if (diff > 0) return 'text-green-400';
    if (diff < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  /**
   * Generate winner message based on performance comparison
   * @param {number | null} diff - The performance difference
   * @param {string} [indexName] - Optional index name for personalized message
   * @returns {string} Winner message with appropriate emoji
   */
  const getWinnerMessage = (diff: number | null, indexName?: string): string => {
    if (diff === null) return 'N/A';
    
    if (diff > 0) {
      return "You've Won! \u{1F389}";
    } else if (diff < 0) {
      return indexName ? `${indexName} Won! \u{1F4C8}` : 'Index Won! \u{1F4C8}';
    } else {
      return 'It\'s a Tie! \u{1F91D}';
    }
  };

  return (
    <IndexGets>
      {({ getIndexValues: indexValuesGetter, indexes: indexList }) => {
        // Fetch index data when dependencies are available (using setTimeout to avoid state update during render)
        if (indexValuesGetter && selectedIndexId) {
          setTimeout(async () => {
            try {
              const today = new Date();
              today.setDate(today.getDate() + 1);
              const dateStr = today.toISOString().split('T')[0];
              
              const data = await indexValuesGetter(selectedIndexId, 'week', dateStr);
              
              if (data && data.length >= 2) {
                const change = calculateYesterdaysPercentageChange(data);
                setIndexChange(change);
              } else {
                setIndexChange(null);
              }
            } catch {
              console.error('Error fetching index data');
              setIndexChange(null);
            }
          }, 0);
        }

        // Find the selected index to get its long name for display
        const selectedIndex = indexList?.find(index => index.id === selectedIndexId);

        // Show loading spinner while data is being fetched
        if (loading) {
          return (
            <div className="text-center text-gray-400">
              <div className="animate-pulse">Loading...</div>
            </div>
          );
        }

        // Show error message if data fetching failed
        if (error) {
          return (
            <div className="text-center text-red-400 text-sm">
              {error}
            </div>
          );
        }

        // Show prompt if no index is selected or no token is available
        if (!token || !selectedIndexId) {
          return (
            <div className="text-center text-gray-400 text-sm">
              Please select an index
            </div>
          );
        }

        // Main render - display performance comparison
        return (
          <div className="flex flex-col justify-between h-full">
            {/* Winner Message */}
            <div className="text-center mb-4">
              <div className={`text-[18px] font-bold ${getDifferenceColor(performanceDifference)}`}>
                {getWinnerMessage(performanceDifference, selectedIndex?.indexname)}
              </div>
            </div>

            {/* Statistics Section */}
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              {/* Portfolio Change */}
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-[16px]">Portfolio:</span>
                <span className={`font-medium text-[14px] ${portfolioChange !== null && portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentage(portfolioChange)}
                </span>
              </div>

              {/* Index Change */}
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-[16px]">
                  {selectedIndex?.indexname || 'Index'}:
                </span>
                <span className={`font-medium text-[14px] ${indexChange !== null && indexChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentage(indexChange)}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-600 my-2"></div>

              {/* Performance Difference */}
              <div className="flex justify-between items-center">
                <span className="text-white font-medium text-[16px]">Difference:</span>
                <span className={`font-bold text-[14px] ${getDifferenceColor(performanceDifference)}`}>
                  {formatPercentage(performanceDifference)}
                </span>
              </div>
            </div>

            {/* Performance indicator text */}
            {performanceDifference !== null && (
              <div className="text-center text-[14px] mt-4">
                {performanceDifference > 0 ? (
                  <span className="text-green-400">{'\u{1F3AF}'} You outperformed the index</span>
                ) : performanceDifference < 0 ? (
                  <span className="text-red-400">{'\u{1F4C9}'} The index outperformed you</span>
                ) : (
                  <span className="text-gray-400">{'\u{2696}\u{FE0F}'} You matched the index performance</span>
                )}
              </div>
            )}
          </div>
        );
      }}
    </IndexGets>
  );
}