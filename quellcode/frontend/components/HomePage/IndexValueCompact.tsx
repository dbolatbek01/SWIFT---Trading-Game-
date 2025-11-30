'use client';

// Compact Index Value Display Component
// Shows current index value, percentage change, and last update time
// Designed for space-efficient display in dashboard or summary views

import React from 'react';

interface IndexValueCompactProps {
  value: string;           // Current index value as formatted string
  change?: {               // Optional price change information
    percentage: number;    // Percentage change from previous value
    absolute: number;      // Absolute change amount
  };
  lastUpdate?: string;     // ISO timestamp of last data update
}

/**
 * Compact component for displaying index value with change indicators
 * Features color-coded change indicators and German-formatted timestamps
 * 
 * @param value - Current index value to display
 * @param change - Optional change object with percentage and absolute values
 * @param lastUpdate - ISO timestamp string for last update
 */
export default function IndexValueCompact({ 
  value, 
  change
}: IndexValueCompactProps) {
  // Determine if price change is positive (green) or negative (red)
  const isPositive = change ? change.percentage >= 0 : true;
  
  return (
    <div className="mb-2">
      {/* Main value display with change indicator */}
      <div className="flex items-center gap-2 mb-1">
        {/* Current index value */}
        <div className="text-white font-semibold text-[20px]">
          {value}
        </div>
        
        {/* Price change indicator with arrow and percentage */}
        {change && (
          <div className={`flex items-center gap-1 text-[16px] font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {/* Direction arrow - up for positive, down for negative */}
            <span className="text-[16px]">
              {isPositive ? '▲' : '▼'}
            </span>
            
            {/* Percentage change with proper sign formatting */}
            <span>
              {isPositive ? '+' : "-"}
              {Math.abs(change.percentage).toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}