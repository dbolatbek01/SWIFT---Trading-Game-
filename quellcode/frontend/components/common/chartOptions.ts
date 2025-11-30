import { ApexOptions } from 'apexcharts';

/**
 * Unified color scheme for all charts in the application
 * Uses blue as default color with performance-based colors (green for gains, red for losses)
 */
export const CHART_COLORS = {
  // Default colors (blue theme)
  primary: '#3B82F6',       // Blue gradient start
  secondary: '#1E40AF',     // Blue gradient end  
  primaryDark: '#1D4ED8',   // Darker blue for contrast
  stroke: '#3B82F6',        // Line color
  
  // Performance-based colors
  positive: '#10B981',      // Green for positive performance
  positiveSecondary: '#059669', // Darker green for gradients
  negative: '#EF4444',      // Red for negative performance
  negativeSecondary: '#DC2626', // Darker red for gradients
  
  // Neutral colors
  grid: '#374151',          // Grid color (consistent dark theme)
  labels: '#9CA3AF'         // Label color (consistent dark theme)
} as const;

/**
 * Returns a default ApexCharts options object for area charts.
 * Allows injection of custom axis and tooltip formatters with performance-based colors.
 *
 * @param formatXAxisLabel - Function to format x-axis labels (date/time)
 * @param formatGermanDateTime - Function to format tooltip x values (date/time)
 * @param selectedTimeFrame - The currently selected time frame (affects x-axis formatting)
 * @param performanceChange - Optional performance change percentage to determine colors (positive = green, negative = red, null = default blue)
 * @returns ApexOptions - The chart configuration object
 */
export function getChartOptions(
  formatXAxisLabel: (value: number, selection: string) => string,
  formatGermanDateTime: (date: Date) => string,
  selectedTimeFrame: string,
  performanceChange?: number | null
): ApexOptions {
  // Determine colors based on performance
  const isPositive = performanceChange !== null && performanceChange !== undefined && performanceChange > 0;
  const isNegative = performanceChange !== null && performanceChange !== undefined && performanceChange < 0;
  
  const primaryColor = isPositive ? CHART_COLORS.positive : 
                      isNegative ? CHART_COLORS.negative : 
                      CHART_COLORS.primary;
  
  const secondaryColor = isPositive ? CHART_COLORS.positiveSecondary : 
                        isNegative ? CHART_COLORS.negativeSecondary : 
                        CHART_COLORS.secondary;

  return {
    chart: {
      type: 'area',
      height: 350,
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    theme: { mode: 'dark' },
    colors: [primaryColor],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        colorStops: [
          { offset: 0, color: primaryColor, opacity: 0.8 },
          { offset: 100, color: secondaryColor, opacity: 0.1 }
        ]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: [primaryColor]
    },
    grid: {
      show: true,
      borderColor: CHART_COLORS.grid,
      strokeDashArray: 1,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: CHART_COLORS.labels, fontSize: '12px' },
        // Formats the x-axis label using the provided function
        formatter: (value: string) => formatXAxisLabel(Number(value), selectedTimeFrame)
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: CHART_COLORS.labels, fontSize: '12px' },
        // Formats the y-axis label as a currency value
        formatter: (value: number) => {
          return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(value);
        }
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        // Formats the tooltip x value using the provided function
        formatter: (value: number) => formatGermanDateTime(new Date(Number(value)))
      },
      y: {
        // Formats the tooltip y value as a currency value
        formatter: (value: number) => {
          return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value);
        }
      }
    },
    dataLabels: { enabled: false }
  };
}