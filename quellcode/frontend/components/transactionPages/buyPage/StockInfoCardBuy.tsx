'use client';

import { Stock } from '@/types/interfaces';
import { useRouter } from 'next/navigation';

/**
 * Props interface for StockInfoCardBuy component
 */
interface StockInfoCardProps {
  stock: Stock;                   // Stock data object
  currentPrice: number | null;    // Current price of the stock (or null if loading)
  lastUpdated: string;            // Timestamp of when price was last updated
  cashAvailable: number;          // User's available cash balance
  orderTypeButton?: React.ReactNode; // Optional: Ordertype-Button oben rechts
}

/**
 * Component that displays stock information in the buy page
 * Shows current price, last update time, and available cash
 */
export default function StockInfoCardBuy({
  stock,
  currentPrice,
  lastUpdated,
  cashAvailable,
  orderTypeButton,
}: StockInfoCardProps) {
  const router = useRouter();
  
  /**
   * Formats a date string into a readable format
   * @param {string} dateString - ISO format date string
   * @returns {string} Formatted date string (e.g., "6/7/2023 14:30")
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit', 
      minute:'2-digit'
    })}`;
  };

  /**
   * Handles click on the back button
   * Navigates to the stock view page
   */
  const handleViewClick = () => {
    router.push(`/stocks/${stock.shortname}/view`);
  };

  return (
    <div className="p-10 flex-1 flex flex-col">
      {/* Stock header section with name, compact back button, and ordertype button */}
      <div className="mb-3">
        <div className="flex justify-between items-start mb-2">
          {/* Compact Back Icon-Button links oben */}
          <button
            onClick={handleViewClick}
            className="mr-4 mt-1 p-2 rounded-full text-white transition-colors hover:cursor-pointer"
            aria-label="Back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            {/* Stock name and symbol */}
            <h3 className="text-3xl font-bold text-white">
              {stock.stockname}
            </h3>
            <p className="text-gray-400 text-xl">{stock.shortname}</p>
          </div>
          {/* Ordertype-Button oben rechts */}
          {orderTypeButton && <div className="ml-4">{orderTypeButton}</div>}
        </div>
      </div>

      {/* Stock information details */}
      <div className="space-y-6 flex-1">
        {/* Current price row */}
        <div className="flex justify-between items-center py-4">
          <span className="text-gray-300 text-lg">Current Price:</span>
          <span className="font-mono text-white text-xl">
            ${currentPrice?.toFixed(2) ?? 'Loading...'}
          </span>
        </div>

        {/* Last updated row */}
        <div className="flex justify-between items-center py-4">
          <span className="text-gray-300 text-lg">Last Updated:</span>
          <span className="text-white text-lg">
            {lastUpdated ? formatDate(lastUpdated) : 'Loading...'}
          </span>
        </div>

        {/* Available cash row */}
        <div className="flex justify-between items-center py-4">
          <span className="text-gray-300 text-lg">Available Cash:</span>
          <span className="font-mono text-white text-xl">
            ${cashAvailable.toLocaleString('de-DE', {
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2
            })}
          </span>
        </div>
      </div>
    </div>
  );
}