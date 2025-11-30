'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { IndexValue } from '@/types/interfaces';
import { getChartOptions } from '@/components/common/chartOptions';

// Dynamic import for ApexCharts to prevent SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * Props interface for IndexChart component
 * @interface IndexChartProps
 * @property {number} indexId - Unique identifier for the index to display
 * @property {Function} getData - Function to fetch index data for a given timeframe
 * @property {Function} [onValueUpdate] - Optional callback when chart values update
 * @property {Function} [onDataUpdate] - Optional callback when data is updated
 * @property {string} [timeframe] - Optional external timeframe control
 */
interface IndexChartProps {
  indexId: number;
  getData: (id: number, timeframe: string, date: string) => Promise<IndexValue[]>;
  onValueUpdate?: (value: string, change?: { percentage: number; absolute: number }) => void;
  onDataUpdate?: (update: { lastUpdate?: string; timeframe?: string }) => void;
  /**
   * Optional timeframe prop - when provided, the component will use this timeframe
   * instead of its internal state and hide the timeframe buttons
   */
  timeframe?: string;
}

/**
 * Format time to German timezone (Europe/Berlin)
 * @param {Date} date - Date object to format
 * @returns {string} Formatted time string in HH:MM format
 */
const formatGermanTime = (date: Date) => {
  const germanDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(germanDate);
};

/**
 * Fix timezone offset for dates without explicit timezone
 * Adds +02:00 offset if no timezone is specified
 * @param {string} s - Date string to fix
 * @returns {string} Date string with timezone offset
 */
const fixOffset = (s: string | undefined | null) => {
  if (!s) return '';
  return s.match(/[Z\+\-]/) ? s : s + '+02:00';
};

/**
 * Format X-axis labels based on the selected timeframe
 * @param {number} value - Timestamp value to format
 * @param {string} selection - Current timeframe selection
 * @returns {string} Formatted label for the X-axis
 */
const formatXAxisLabel = (
  value: number,
  selection: string
) => {
  const date = new Date(value);

  switch (selection) {
    case 'hour':
    case 'day':
      // Show time for hourly and daily views
      return formatGermanTime(date);
    case 'week':
      // Show date (DD.MM) for weekly view
      return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'Europe/Berlin'
      }).format(date);
    case 'month':
      // Show date with abbreviated month for monthly view
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
 * Format full German date and time for tooltips and displays
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string in DD.MM.YYYY, HH:MM format
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
 * IndexChart component - Displays an interactive chart for index values over time
 * Supports multiple timeframes and automatic data fetching with retry logic
 * @component
 * @param {IndexChartProps} props - Component props
 * @returns {JSX.Element} Rendered chart component
 */
const IndexChart: React.FC<IndexChartProps> = ({ 
  indexId, 
  getData, 
  onValueUpdate, 
  onDataUpdate,
  timeframe: externalTimeframe 
}) => {
  // Chart-Component Preload
  useEffect(() => {
    import('react-apexcharts');
  }, []);

  // Internal timeframe state when not controlled externally
  const [internalTimeframe, setInternalTimeframe] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  // Chart data state
  const [data, setData] = useState<IndexValue[]>([]);
  // Loading state for data fetching
  const [loading, setLoading] = useState(false);
  // Error state for handling fetch failures
  const [error, setError] = useState<string | null>(null);

  // Determine whether to show internal timeframe buttons
  const showInternalButtons = !externalTimeframe;
  // Use external timeframe if provided, otherwise use internal state
  const activeTimeframe = (externalTimeframe || internalTimeframe) as 'hour' | 'day' | 'week' | 'month';

  /**
   * Calculate the appropriate date for the given timeframe
   * Adding +1 day to ensure we get the latest data
   * @returns {string} ISO date string for API requests
   */
  const calculateDateForTimeframe = (): string => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  /**
   * Fetch chart data from the API
   * Retries with previous dates if no data is found
   * Will attempt up to 30 days in the past to find data
   */
  const fetchChartData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTimeframe === 'hour') {
        const dateToUse = calculateDateForTimeframe();
        const currentDate = new Date(dateToUse);
        let maxRetries = 30;
        let dataFound = false;
        // Retry loop - goes back one day at a time until data is found
        while (maxRetries > 0 && !dataFound) {
          const testDate = currentDate.toISOString().split('T')[0];
          try {
            const values = await getData(indexId, activeTimeframe, testDate);

            if (values && values.length > 0) {
              setData(values);
              dataFound = true;
              // Notify parent component of data update
              if (onDataUpdate) {
                const lastDataPoint = values[values.length - 1];
                onDataUpdate({ 
                  lastUpdate: lastDataPoint.date,
                  timeframe: activeTimeframe
                });
              }
            } else {
              // No data for this date, try previous day
              currentDate.setDate(currentDate.getDate() - 1);
              maxRetries--;
            }
          } catch {
            // Error fetching data, try previous day
            currentDate.setDate(currentDate.getDate() - 1);
            maxRetries--;
          }
        }

        if (!dataFound) {
          setError('No data available for the last 30 days');
          setData([]);
        }
      } else {
        const values = await getData(indexId, activeTimeframe, '');
        if (values && values.length > 0) {
          setData(values);
          if (onDataUpdate) {
            const lastDataPoint = values[values.length - 1];
            onDataUpdate({ lastUpdate: lastDataPoint.date, timeframe: activeTimeframe });
          }
        } else {
          setError('No data available');
          setData([]);
        }
      }
    } catch {
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  }, [indexId, activeTimeframe, getData, onDataUpdate]);

  /**
   * Effect to fetch chart data when dependencies change
   */
  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  /**
   * Effect to calculate and notify value changes
   * Calculates percentage and absolute change from first to last data point
   */
  useEffect(() => {
    if (data.length > 0 && onValueUpdate) {
      const latestValue = data[data.length - 1].value;
      const firstValue = data[0].value;
      const percentageChange = ((latestValue - firstValue) / firstValue) * 100;
      const absoluteChange = latestValue - firstValue;

      // Notify parent component with formatted value and changes
      onValueUpdate(
        Math.round(latestValue).toLocaleString('en-US'),
        { percentage: percentageChange, absolute: absoluteChange }
      );
    }
  }, [data, onValueUpdate]);

  // Calculate performance change for color determination
  const performanceChange = data.length > 1 ? 
    ((data[data.length - 1].value - data[0].value) / data[0].value) * 100 : 0;

  // Prepare chart series data with proper timestamp formatting
  const chartSeries = useMemo(() => [{
    name: 'Index Value',
    data: data.map(item => ({
      x: new Date(fixOffset(item.date)).getTime(),
      y: item.value
    }))
  }], [data]);

  // Configure ApexCharts options with performance-based colors
  // Memoized to prevent unnecessary re-creation that causes tooltip to flicker
  const chartOptions = useMemo(() => {
    const baseOptions = getChartOptions(formatXAxisLabel, formatGermanDateTime, activeTimeframe, performanceChange);
    return {
      ...baseOptions,
      tooltip: {
        ...baseOptions.tooltip,
        enabled: true,
        shared: false,
        followCursor: true,
        intersect: false
      }
    };
  }, [activeTimeframe, performanceChange]);


  // Timeframe button configuration
  const timeframeButtons = [
    { key: 'hour', label: '1H' },
    { key: 'day', label: '1D' },
    { key: 'week', label: '1W' },
    { key: 'month', label: '1M' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Timeframe selection buttons - only shown when not externally controlled */}
      {showInternalButtons && (
        <div className="mb-4">
          <div className="flex justify-center">
            <div className="flex space-x-1">
              {timeframeButtons.map((tf) => (
                <button
                  key={tf.key}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                    internalTimeframe === tf.key 
                      ? 'bg-white/20 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setInternalTimeframe(tf.key as 'hour' | 'day' | 'week' | 'month')}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart container */}
      <div className="flex-1 min-h-0">
        {/* Loading state */}
        {loading && (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-400">{error}</div>
          </div>
        )}
        {/* Chart display */}
        {!loading && !error && data.length > 0 && (
          <Chart
            options={chartOptions} 
            series={chartSeries} 
            type="area" 
            height="100%"
            width="100%"
          />
        )}
        {/* No data state */}
        {!loading && !error && data.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">No data available</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexChart;