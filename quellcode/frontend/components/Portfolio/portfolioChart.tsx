'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { PortfolioSnapshot, PortfolioTimeFrame } from '@/types/interfaces';
import { getPortfolioValuesMultiple } from '@/components/Portfolio/portfolioChartGets';
import { getPortfolioAllValues } from '@/components/Portfolio/portfolioGets';
import { getChartOptions } from '@/components/common/chartOptions';

// Dynamically import ApexCharts to avoid server-side rendering issues in Next.js
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PortfolioChartProps {
  token: string;
  onTabChange?: (tab: 'total' | 'performance') => void;
}

type TimeFrameDisplay = '1D' | '1W' | '1M';

// Helper function: Adds +02:00 if no offset is present
const fixOffset = (s: string) => s.match(/[Z\+\-]/) ? s : s + '+02:00';

/**
 * Format a JS Date as a German time string (HH:MM), using Berlin timezone.
 */
const formatGermanTime = (date: Date) => {
  const germanDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(germanDate);
};

/**
 * Format the x-axis label according to the selected time frame.
 * - today: show time
 * - lastWeek: show day and month (e.g. 09.07.)
 * - lastMonth: show day and abbreviated month (e.g. 09. Jul)
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
        month: 'short',
        timeZone: 'Europe/Berlin'
      }).format(date);
    default:
      return formatGermanTime(date);
  }
};

/**
 * Format a JS Date as a detailed German date/time string (e.g. 09.07.2025, 23:00).
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
 * PortfolioChart Component
 * -----------------------
 * Displays a chart showing the user's portfolio value over time.
 * Features:
 * - Dynamic time frame selection (today, last week, last month)
 * - Current value and percentage change display
 * - Last update timestamp
 * - Responsive, dark-themed area chart
 *
 * Props:
 * - token: string (auth token for fetching data)
 */
const PortfolioChart: React.FC<PortfolioChartProps> = ({ token, onTabChange }) => {
  
  // Next.js router for navigation
  const router = useRouter();
  
  useEffect(() => {
    import('react-apexcharts');
  }, []);

  // State for selected chart time frame
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<PortfolioTimeFrame>('today');
  // Chart data (array of portfolio snapshots)
  const [chartData, setChartData] = useState<PortfolioSnapshot[]>([]);
  // Percentage change over selected time frame
  const [percentageChange, setPercentageChange] = useState<number>(0);
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Nur aktuellen Gesamtwert berechnen (Summe aller aktuellen Werte der Holdings)
  const [portfolioTotalValue, setPortfolioTotalValue] = useState<number>(0);

  // Tab-Logik: Aktiver Tab merken
  const [activeTab, setActiveTab] = useState<'total' | 'performance'>('total');

  /**
   * Calculate the percentage change between the first and last non-zero portfolio value.
   */
  const calculatePercentageChange = (data: PortfolioSnapshot[]): number => {
    if (data.length < 2) return 0;
    let firstValue = data[0].gesamtBetrag;
    // Find the first non-zero value (in case initial points are zero)
    if (firstValue === 0) {
      for (let i = 1; i < data.length; i++) {
        if (data[i].gesamtBetrag > 0) {
          firstValue = data[i].gesamtBetrag;
          break;
        }
      }
      if (firstValue === 0) return 0;
    }
    const lastValue = data[data.length - 1].gesamtBetrag;
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  /**
   * Fetch portfolio data for the selected time frame from the API.
   */
  const fetchPortfolioData = useCallback(async (timeFrame: PortfolioTimeFrame) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [{ today, lastWeek, lastMonth }, { current }] = await Promise.all([
        getPortfolioValuesMultiple(token, ['today', 'lastWeek', 'lastMonth']),
        getPortfolioAllValues(token)
      ]);
      const data =
        timeFrame === 'today' ? today :
        timeFrame === 'lastWeek' ? lastWeek :
        lastMonth;
      setChartData(data);
      if (data.length > 0) {
        setPercentageChange(calculatePercentageChange(data));
      }
      // Calculate total value from current holdings
      let sum = 0;
      for (const holding of current) {
        sum += holding.latestPrice * holding.count;
      }
      setPortfolioTotalValue(sum);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch data on mount and whenever the time frame or token changes
  useEffect(() => {
    if (token) {
      fetchPortfolioData(selectedTimeFrame);
    }
  }, [selectedTimeFrame, token, fetchPortfolioData]);

  /**
   * Handler for time frame button clicks.
   */
  const handleTimeFrameChange = (timeFrame: PortfolioTimeFrame) => {
    setSelectedTimeFrame(timeFrame);
  };

  /**
   * Navigates to the search page for buying first stocks
   */
  const handleBuyFirstStocks = () => {
    router.push('/search');
  };

  /**
   * Map the PortfolioTimeFrame type to user-facing short label.
   */
  const getTimeFrameDisplay = (timeFrame: PortfolioTimeFrame): TimeFrameDisplay => {
    switch (timeFrame) {
      case 'today': return '1D';
      case 'lastWeek': return '1W';
      case 'lastMonth': return '1M';
    }
  };

  // Prepare chart series for ApexCharts
  const chartSeries = [{
    name: 'Portfolio Value',
    data: chartData.map(item => ({
      x: new Date(fixOffset(item.snapshotTime)).getTime(),
      y: item.gesamtBetrag
    }))
  }];

  // Configure ApexCharts options with performance-based colors
  const chartOptions = {
    ...getChartOptions(formatXAxisLabel, formatGermanDateTime, selectedTimeFrame, percentageChange),
    tooltip: {
      enabled: true,
      custom: ({ dataPointIndex, w }: { dataPointIndex: number; w: unknown }) => {
        const chartW = w as { globals: { seriesX: number[][] } };
        const xValue = chartW.globals.seriesX[0][dataPointIndex];
        return `<div style='padding:8px;'>${formatGermanDateTime(new Date(xValue))}</div>`;
      }
    }
  };

  const handleTabChange = (tab: 'total' | 'performance') => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Show error UI if something went wrong
  if (error) {
    return (
      <div className="p-6 w-full h-[400px] flex items-center justify-center">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  // Main chart UI
  return (
    <div className="p-6 w-full mt-3">
      {/* Title */}
      <div className="relative inline-block text-[24px] text-transparent bg-clip-text bg-gradient-to-r from-[#F596D3] to-[#D247BF] font-bold mb-2">
         Portfolio
      </div>
      {/* Current value and percentage change */}
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-white">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(portfolioTotalValue)}
          </span>
          <span className={`flex items-center text-sm font-medium ${
            percentageChange >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            <span className="mr-1">
              {percentageChange >= 0 ? '▲' : '▼'}
            </span>
            {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%
          </span>
        </div>
      </div>
      {/* Time frame selection buttons and Tab Buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* Time frame buttons */}
        <div className="flex space-x-1">
          {(['today', 'lastWeek', 'lastMonth'] as PortfolioTimeFrame[]).map((timeFrame) => (
            <button
              key={timeFrame}
              onClick={() => handleTimeFrameChange(timeFrame)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selectedTimeFrame === timeFrame
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              disabled={loading}
            >
              {getTimeFrameDisplay(timeFrame)}
            </button>
          ))}
        </div>
        
        {/* Modern Tab Buttons */}
        {onTabChange && (
          <div className="relative flex bg-white/5 backdrop-blur-sm rounded-md p-0.5 border border-white/10">
            <button
              onClick={() => handleTabChange('total')}
              className={`px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#F596D3]/20 to-[#D247BF]/20 text-[#F596D3] rounded-sm shadow-md border border-[#F596D3]/30 backdrop-blur-sm ${activeTab === 'total' ? '' : 'opacity-60'}`}
            >
              Total Value
            </button>
            <button
              onClick={() => handleTabChange('performance')}
              className={`px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded-sm transition-all duration-200 hover:bg-white/10 ${activeTab === 'performance' ? 'text-[#F596D3] bg-gradient-to-r from-[#F596D3]/20 to-[#D247BF]/20' : ''}`}
            >
              Performance
            </button>
          </div>
        )}
      </div>
      {/* Chart area */}
      <div className="flex-1 min-h-0 w-full h-[500px]">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#61DAFB]"></div>
          </div>
        ) : chartData.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height="100%"
            width="100%"
          />
        ) : (
          // No data - Show buy first stocks call-to-action
          <div className="h-full rounded flex flex-col items-center justify-center text-center p-12">
            {/* Call-to-action text */}
            <p className="text-gray-400 mb-10 max-w-lg text-xl leading-relaxed">
              Your portfolio is empty. Start your investment journey by purchasing your first stocks.
            </p>

            {/* Buy first stocks button */}
            <button
              onClick={handleBuyFirstStocks}
              className="group relative bg-gradient-to-r from-[#F596D3] to-[#D247BF] 
                         hover:from-[#D247BF] hover:to-[#F596D3] 
                         text-white font-bold px-12 py-5 rounded-xl 
                         transition-all duration-200 transform hover:scale-105 
                         shadow-xl hover:shadow-2xl text-xl"
            >
              <span className="flex items-center">
                <svg 
                  className="w-7 h-7 mr-4" 
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
                Search & Buy Stocks
              </span>
              
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#F596D3] to-[#D247BF] 
                              opacity-0 group-hover:opacity-30 transition-opacity duration-200 blur-sm"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioChart;