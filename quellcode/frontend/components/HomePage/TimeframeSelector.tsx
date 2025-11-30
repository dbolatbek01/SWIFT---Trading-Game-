import React from 'react';

interface TimeframeSelectorProps {
  currentTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

/**
 * TimeframeSelector Component
 * 
 * A button group component that allows users to switch between different time periods
 * for chart visualization (1 Day, 1 Week, 1 Month)
 * 
 * @param currentTimeframe - The currently selected timeframe ('day', 'week', or 'month')
 * @param onTimeframeChange - Callback function triggered when a timeframe button is clicked
 */
export default function TimeframeSelector({ 
  currentTimeframe, 
  onTimeframeChange 
}: TimeframeSelectorProps) {
  
  // Configuration for timeframe buttons
  const timeframes = [
    { value: 'day', label: '1D' },
    { value: 'week', label: '1W' },
    { value: 'month', label: '1M' }
  ];

  return (
    <div className="flex justify-center">
      <div className="flex space-x-1">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              currentTimeframe === timeframe.value
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => onTimeframeChange(timeframe.value)}
            aria-label={`Set timeframe to ${timeframe.label}`}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
    </div>
  );
}