'use client';

import React from 'react';

/**
 * Props interface for IndexValueDisplay component
 * @interface IndexValueDisplayProps
 * @property {string} value - The current index value to display
 * @property {Object} [change] - Optional change information
 * @property {number} change.percentage - Percentage change from previous value
 * @property {number} change.absolute - Absolute change from previous value
 * @property {boolean} [showLabel] - Whether to show the "Current Value" label
 * @property {string | null} [lastUpdate] - Optional timestamp of last update
 */
interface IndexValueDisplayProps {
  value: string;
  change?: {
    percentage: number;
    absolute: number;
  };
  showLabel?: boolean;
  lastUpdate?: string | null;
}

/**
 * Component for displaying index values with change indicators
 * Shows current value, percentage/absolute change, and last update time
 * Uses color coding for positive (green) and negative (red) changes
 * @component
 * @param {IndexValueDisplayProps} props - Component props
 * @returns {JSX.Element} Rendered value display
 */
export default function IndexValueDisplay({ 
  value, 
  change, 
  showLabel = true
}: IndexValueDisplayProps) {
  // Determine if the change is positive for color coding
  const isPositive = change ? change.percentage >= 0 : true;
  
  return (
    <div>
      {/* Optional label for current value */}
      {showLabel && (
        <p className="text-gray-400 text-sm mb-2">Current Value</p>
      )}
      <div>
        {/* Main value display with change indicators */}
        <div className="flex items-baseline gap-4">
          {/* Large display of current value */}
          <p className="text-3xl font-bold text-white">
            {value}
          </p>
          {/* Change indicators - only shown if change exists and is non-zero */}
          {change && change.percentage !== 0 && (
            <div className="flex items-center gap-2">
              {/* Arrow indicator for direction of change */}
              <span className={`text-1xl ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '▲' : '▼'}
              </span>
              {/* Percentage and absolute change values */}
              <span className={`text-1xl font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {/* Add + sign for positive changes */}
                {isPositive ? '+' : ''}{change.percentage.toFixed(2)}% 
                {/* Absolute change in parentheses with proper formatting */}
                ({isPositive ? '+' : '-'}{Math.abs(change.absolute).toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}