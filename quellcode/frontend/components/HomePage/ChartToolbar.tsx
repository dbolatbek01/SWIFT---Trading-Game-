import { ApexOptions } from 'apexcharts';

/**
 * Reusable toolbar configuration for ApexCharts
 * Provides consistent zoom, pan, and other interactive features across all charts
 */
export const getChartToolbarConfig = (): Partial<ApexOptions['chart']> => {
  return {
    toolbar: {
      show: false,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      },
    },
    zoom: {
      enabled: true,
      type: 'x', // Allow horizontal zooming
      autoScaleYaxis: true // Automatically scale Y-axis when zooming
    }
  };
};

/**
 * Get base chart configuration with toolbar
 * Can be spread into chart options for consistent behavior
 */
export const getInteractiveChartConfig = (height: number = 280): Partial<ApexOptions> => {
  return {
    chart: {
      type: 'area',
      height,
      background: 'transparent',
      ...getChartToolbarConfig()
    }
  };
};
