'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { CHART_COLORS } from '@/components/common/chartOptions';
import { StockApiResponseItem } from '@/types/interfaces';

// Dynamically import the ApexCharts component for client-side rendering
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * Props for the StockChart component.
 * @property stockId - The unique identifier for the stock to display.
 */
interface StockChartProps {
  stockId: number;
}

/**
 * Represents a single data point for the stock price chart.
 * @property x - The timestamp (in milliseconds) for the data point.
 * @property y - The price value at the corresponding timestamp.
 */
interface StockPricePoint {
  x: number;
  y: number;
}

/**
 * StockChart component for displaying historical stock prices in a chart.
 * Allows users to switch between different time periods.
 */
const StockChart: React.FC<StockChartProps> = ({ stockId }) => {
  // State for the chart series data
  const [series, setSeries] = useState<{ name: string; data: StockPricePoint[] }[]>([{
    name: 'Stock Price',
    data: []
  }]);
  // State for loading indicator
  const [loading, setLoading] = useState<boolean>(true);
  // State for error message
  const [error, setError] = useState<string | null>(null);
  // State for selected chart period
  const [selection, setSelection] = useState<string>('one_day');

  /**
   * Formats a date as a German time string (HH:MM).
   * @param date - The date to format.
   * @returns Formatted time string.
   */
  const formatGermanTime = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin'
    }).format(date);
  };

  /**
   * Formats X-axis labels based on the selected timeframe.
   * @param value - The timestamp value.
   * @returns Formatted label string.
   */
  const formatXAxisLabel = (value: number) => {
    const date = new Date(value);
    
    switch (selection) {
      case 'one_hour':
      case 'one_day':
        return formatGermanTime(date);
      case 'one_week':
        return new Intl.DateTimeFormat('de-DE', {
          day: '2-digit',
          month: '2-digit',
          timeZone: 'Europe/Berlin'
        }).format(date);
      case 'one_month':
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
   * Formats a date as a German date and time string (DD MMM YYYY, HH:MM).
   * @param date - The date to format.
   * @returns Formatted date and time string.
   */
  const formatGermanDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin'
    }).format(date);
  };

  // Calculate performance change for color determination
  const performanceChange = series[0].data.length > 1 ? 
    ((series[0].data[series[0].data.length - 1].y - series[0].data[0].y) / series[0].data[0].y) * 100 : null;

  // Determine colors based on performance
  const isPositive = performanceChange !== null && performanceChange > 0;
  const isNegative = performanceChange !== null && performanceChange < 0;
  
  const primaryColor = isPositive ? CHART_COLORS.positive : 
                      isNegative ? CHART_COLORS.negative : 
                      CHART_COLORS.primary;
  
  const secondaryColor = isPositive ? CHART_COLORS.positiveSecondary : 
                        isNegative ? CHART_COLORS.negativeSecondary : 
                        CHART_COLORS.secondary;

  // Chart options for ApexCharts
  const options: ApexCharts.ApexOptions = {
    chart: {
      id: 'stock-area-datetime',
      type: 'area',
      height: 350,
      zoom: {
        autoScaleYaxis: true
      },
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    annotations: {
      yaxis: [],
      xaxis: []
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    colors: [primaryColor],
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: CHART_COLORS.labels
        },
        formatter: (value) => formatXAxisLabel(Number(value))
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: CHART_COLORS.labels
        },
        formatter: (value) => `$${value.toFixed(2)}`
      }
    },
    tooltip: {
      x: {
        formatter: (value) => formatGermanDateTime(new Date(value))
      },
      y: {
        formatter: (value) => `$${value.toFixed(2)}`
      },
      theme: 'dark'
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: [primaryColor]
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        colorStops: [
          {
            offset: 0,
            color: primaryColor,
            opacity: 0.8
          },
          {
            offset: 100,
            color: secondaryColor,
            opacity: 0.1
          }
        ]
      }
    },
    grid: {
      borderColor: CHART_COLORS.grid,
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    theme: {
      mode: 'dark'
    }
  };

  /**
   * Fetches stock price data for the selected period and updates the chart.
   * Handles different API endpoints for hour, day, week, and month views.
   * @param period - The selected time period ("one_hour", "one_day", etc.).
   */
  const fetchChartData = useCallback(async (period: string) => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = '';

      switch (period) {
        case 'one_hour': {
          endpoint = `/api/stocks/${stockId}/view/getStockPriceByHour`;
          break;
        }
        case 'one_day':
          endpoint = `/api/stocks/${stockId}/view/getStockPriceByDay`;
          break;
        case 'one_week':
          endpoint = `/api/stocks/${stockId}/view/getStockPriceByWeek`;
          break;
        case 'one_month':
          endpoint = `/api/stocks/${stockId}/view/getStockPriceByMonth`;
          break;
        default:
          endpoint = `/api/stocks/${stockId}/view/getStockPriceByDay`;
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StockApiResponseItem[] = await response.json();

      let dataPoints: StockPricePoint[] = [];

      if (Array.isArray(data) && data.length > 0) {
        dataPoints = data
          .filter(item => typeof item.stockPriceTime === 'string' && item.price !== undefined)
          .map(item => ({
            x: new Date(item.stockPriceTime || '').getTime(),
            y: parseFloat(Number(item.price ?? 0).toFixed(2))
          }))
          .sort((a, b) => a.x - b.x);
      }

      setSeries([{
        name: 'Stock Price',
        data: dataPoints
      }]);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chart data');
    } finally {
      setLoading(false);
    }
  }, [stockId]);

  /**
   * Updates the selected chart period and triggers fetching new data.
   * @param period - The period to select.
   */
  const updatePeriod = (period: string) => {
    setSelection(period);
    fetchChartData(period);
  };

  // Fetch data when stockId or selection changes
  useEffect(() => {
    fetchChartData(selection);
  }, [stockId, selection, fetchChartData]);

  return (
    <div className="relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] bg-opacity-50 z-10">
          <div className="text-red-500 bg-gray-800 p-4 rounded-lg shadow-lg text-center">
            <p className="font-semibold">Error loading chart</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg p-4">
        {/* Chart period selection buttons */}
        <div className="flex justify-center mb-4">
          <div className="flex space-x-1">
            <button
              onClick={() => updatePeriod('one_hour')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selection === 'one_hour'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              1H
            </button>
            <button
              onClick={() => updatePeriod('one_day')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selection === 'one_day'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              1D
            </button>
            <button
              onClick={() => updatePeriod('one_week')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selection === 'one_week'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              1W
            </button>
            <button
              onClick={() => updatePeriod('one_month')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selection === 'one_month'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              1M
            </button>
          </div>
        </div>

        {/* Chart display */}
        <div id="chart-timeline" className="h-64 md:h-80">
          {typeof window !== 'undefined' && series[0].data.length > 0 && (
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height="100%"
            />
          )}

          {/* Message when there is no data */}
          {series[0].data.length === 0 && !loading && !error && (
            <div className="h-full flex items-center justify-center text-gray-500">
              No data available for this time period
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockChart;