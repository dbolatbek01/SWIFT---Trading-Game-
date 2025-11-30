'use client';
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PortfolioSnapshot, PortfolioTimeFrame } from '@/types/interfaces';
import { getPortfolioValues } from '@/components/HomePage/PortfolioChartGetsHP';
import { useRouter } from 'next/navigation';
import { getChartOptions } from '@/components/common/chartOptions';

// Dynamic import to avoid SSR issues with ApexCharts
// ApexCharts doesn't work well with server-side rendering, so we import it dynamically
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Interface defining the props that the PortfolioChart component accepts
interface PortfolioChartProps {
  token: string; // Authentication token for API calls
  timeframe?: string; // Optional external timeframe control
  onValueUpdate?: (value: number, percentageChange?: number) => void; // Callback for value updates
}

// Type for internal timeframe display labels
type TimeFrameDisplay = '1D' | '1W' | '1M';

/**
 * Formats a date to German time format (HH:mm)
 * @param date - The date to format
 * @returns Formatted time string in German locale
 */
const formatGermanTime = (date: Date) => {
  const germanDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(germanDate);
};

/**
 * Formats X-axis labels based on the selected timeframe
 * @param value - Timestamp value
 * @param selection - Current timeframe selection
 * @returns Formatted label string
 */
const formatXAxisLabel = (value: number, selection: string) => {
  const date = new Date(value);

  switch (selection) {
    case 'today':
      return formatGermanTime(date);
    case 'lastWeek':
      return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'Europe/Berlin'
      }).format(date);
    case 'lastMonth':
      return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'Europe/Berlin'
      }).format(date);
    default:
      return formatGermanTime(date);
  }
};

/**
 * Formats a date to German date-time format (DD.MM.YYYY HH:mm)
 * @param date - The date to format
 * @returns Formatted date-time string in German locale
 */
const formatGermanDateTime = (date: Date) => {
  const germanDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(germanDate);
};

/**
 * Fixes timezone offset for date strings that might be missing timezone info
 * @param s - Date string
 * @returns Date string with proper timezone offset
 */
const fixOffset = (s: string) => s.match(/[Z\+\-]/) ? s : s + '+02:00';

/**
 * Portfolio Chart Component
 * Displays a time-series chart of portfolio values with interactive timeframe selection
 */
const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
  token, 
  timeframe: externalTimeframe,
  onValueUpdate 
}) => {

  useEffect(() => {
    import('react-apexcharts');
  }, []);

  // Next.js router for navigation
  const router = useRouter();
  
  // Internal state for timeframe when not controlled by parent component
  const [internalSelectedTimeFrame, setInternalSelectedTimeFrame] = useState<PortfolioTimeFrame>('today');
  // Chart data containing portfolio snapshots
  const [chartData, setChartData] = useState<PortfolioSnapshot[]>([]);
  // Current portfolio value
  const [currentValue, setCurrentValue] = useState<number>(0);
  // Percentage change from first to last value in timeframe
  const [percentageChange, setPercentageChange] = useState<number>(0);
  // Loading state for async operations
  const [loading, setLoading] = useState<boolean>(true);
  // Error state for failed operations
  const [error, setError] = useState<string | null>(null);

  /**
   * Maps external timeframe strings to internal PortfolioTimeFrame enum
   * @param external - External timeframe string
   * @returns Internal PortfolioTimeFrame value
   */
  const mapExternalToInternalTimeframe = (external: string): PortfolioTimeFrame => {
    switch (external) {
      case 'day':
        return 'today';
      case 'week':
        return 'lastWeek';
      case 'month':
        return 'lastMonth';
      default:
        return 'today';
    }
  };

  // Determine if internal timeframe buttons should be shown
  const showInternalButtons = !externalTimeframe;
  // Use external timeframe if provided, otherwise use internal state
  const activeTimeframe = externalTimeframe 
    ? mapExternalToInternalTimeframe(externalTimeframe)
    : internalSelectedTimeFrame;

  /**
   * Calculates percentage change between first and last values in the dataset
   * @param data - Array of portfolio snapshots
   * @returns Percentage change as a number
   */
  const calculatePercentageChange = (data: PortfolioSnapshot[]): number => {
    if (data.length < 2) return 0;
    const firstValue = data[0].gesamtBetrag;
    const lastValue = data[data.length - 1].gesamtBetrag;
    if (firstValue === 0) return 0;
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  /**
   * Fetches portfolio data from the API for the specified timeframe
   * Uses useCallback to prevent unnecessary re-renders
   */
  const fetchPortfolioData = useCallback(async (timeFrame: PortfolioTimeFrame) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch data from API
      const data = await getPortfolioValues(token, timeFrame);
      setChartData(data);
      if (data.length > 0) {
        // Extract latest values and calculate metrics
        const latest = data[data.length - 1];
        const latestValue = latest.gesamtBetrag;
        const calculatedPercentageChange = calculatePercentageChange(data);
        setCurrentValue(latestValue);
        setPercentageChange(calculatedPercentageChange);
        // Notify parent component of value update if callback provided
        if (onValueUpdate) {
          onValueUpdate(latestValue, calculatedPercentageChange);
        }
      }
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  }, [token, onValueUpdate]);

  // Effect to fetch data when timeframe or token changes
  useEffect(() => {
    if (token) {
      fetchPortfolioData(activeTimeframe);
    }
  }, [activeTimeframe, token, fetchPortfolioData]);

  /**
   * Handles timeframe selection change
   * @param timeFrame - Selected timeframe
   */
  const handleTimeFrameChange = (timeFrame: PortfolioTimeFrame) => {
    setInternalSelectedTimeFrame(timeFrame);
  };

  /**
   * Navigates to the portfolio page when portfolio title is clicked
   */
  const handlePortfolioClick = () => {
    router.push('/portfolio');
  };

  /**
   * Navigates to the search page for buying first stocks
   */
  const handleBuyFirstStocks = () => {
    router.push('/search');
  };

  /**
   * Converts internal timeframe to display format
   * @param timeFrame - Internal timeframe value
   * @returns Display string for UI
   */
  const getTimeFrameDisplay = (timeFrame: PortfolioTimeFrame): TimeFrameDisplay => {
    switch (timeFrame) {
      case 'today':
        return '1D';
      case 'lastWeek':
        return '1W';
      case 'lastMonth':
        return '1M';
    }
  };

  // Prepare chart series data by mapping portfolio snapshots to chart format
  const chartSeries = [{
    name: 'Portfolio Value',
    data: chartData.map(item => ({
      x: new Date(fixOffset(item.snapshotTime)).getTime(), // Convert to timestamp
      y: item.gesamtBetrag // Portfolio value
    }))
  }];

  // Get chart configuration options with performance-based colors
  const chartOptions = getChartOptions(formatXAxisLabel, formatGermanDateTime, activeTimeframe, percentageChange);

  // Error state render
  if (error) {
    return (
      <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg p-6 w-full h-full flex items-center justify-center">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  // Main component render
  return (
    <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg p-6 h-full flex flex-col">
      {/* Header with clickable portfolio title */}
      <div className="flex items-center justify-between mb-2">
      <button
        onClick={handlePortfolioClick}
        className="group relative text-[24px] font-semibold hover:text-blue-400 transition-colors cursor-pointer"
      >
        {/* Hover tooltip with modern styling and animation */}
        <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 
                        bg-gradient-to-r from-[#F596D3]/50 to-[#D247BF]/50 
                        text-white text-xs font-medium py-1 px-3 rounded-full 
                        shadow-lg opacity-0 group-hover:opacity-100 
                        transition-all duration-200 whitespace-nowrap
                        scale-90 group-hover:scale-100
                        flex items-center">
          Go to Portfolio page
          {/* Tooltip arrow icon */}
          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
        
        {/* Portfolio title with gradient text and hover underline effect */}
        <h2 className="relative inline-block text-[24px] text-transparent bg-clip-text bg-gradient-to-r from-[#F596D3] to-[#D247BF] font-semibold">
          Portfolio
          {/* Animated underline that appears on hover */}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F596D3] to-[#D247BF] group-hover:w-full transition-all duration-200"></span>
        </h2>
      </button>
      </div>
      
      {/* Current value and percentage change display */}
      <div className="mb-4">
        {!loading && currentValue > 0 && (
          <div className="flex items-center space-x-3">
            {/* Current portfolio value formatted as currency */}
            <span className="text-[20px] font-bold text-white">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(currentValue)}
            </span>
            {/* Percentage change with color coding and directional arrow */}
            <span className={`flex items-center text-[16px] font-medium ${
              percentageChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              <span className="mr-1">
                {percentageChange >= 0 ? '▲' : '▼'}
              </span>
              {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Timeframe selection buttons - Only shown when not controlled externally */}
      {showInternalButtons && (
        <div className="flex justify-center mb-4">
          <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
            {/* Map through available timeframes and create buttons */}
            {(['today', 'lastWeek', 'lastMonth'] as PortfolioTimeFrame[]).map((timeFrame) => (
              <button
                key={timeFrame}
                onClick={() => handleTimeFrameChange(timeFrame)}
                className={`px-4 py-1 text-sm font-medium rounded transition-colors ${
                  internalSelectedTimeFrame === timeFrame
                    ? 'bg-blue-600 text-white' // Active state styling
                    : 'text-gray-300 hover:text-white' // Inactive state styling
                }`}
                disabled={loading}
              >
                {getTimeFrameDisplay(timeFrame)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chart container with flexible height */}
      <div className="flex-1 min-h-0">
        {loading ? (
          // Loading state placeholder
          <div className="h-full bg-gray-700/50 rounded flex items-center justify-center text-gray-400">
            Loading data...
          </div>
        ) : chartData.length > 0 ? (
          // Render ApexCharts area chart with dynamic height
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height="100%"
          />
        ) : (
          // No data - Show buy first stocks call-to-action
          <div className="h-full rounded flex flex-col items-center justify-center text-center p-8">
            {/* Call-to-action text */}
            <p className="text-gray-400 mb-6 max-w-xs">
              You haven&apos;t bought any stocks yet. Start building your portfolio today!
            </p>

            {/* Buy first stocks button */}
            <button
              onClick={handleBuyFirstStocks}
              className="group relative bg-gradient-to-r from-[#F596D3] to-[#D247BF] 
                         hover:from-[#D247BF] hover:to-[#F596D3] 
                         text-white font-semibold px-8 py-3 rounded-lg 
                         transition-all duration-200 transform hover:scale-105 
                         shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center">
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                Buy Your First Stocks
              </span>
              
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#F596D3] to-[#D247BF] 
                              opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-sm"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioChart;