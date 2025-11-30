'use client';
import Link from 'next/link';
import { Stock } from '@/types/interfaces';
import StockPriceChange from './StockPriceChange';

/**
 * Props interface for StockPriceInfo component.
 * @property stock - Object containing information about the stock
 * @property currentPrice - The current price of the stock
 * @property lastUpdated - The timestamp when the stock price was last updated
 */
interface StockPriceInfoProps {
  stock: Stock;
  currentPrice: number | null;
  lastUpdated: string;
}

/**
 * StockPriceInfo component displays the current price of a stock and a button to buy/sell it.
 * 
 * @param stock - Object containing information about the stock
 * @param currentPrice - The current price of the stock
 * @param lastUpdated - The timestamp when the stock price was last updated
 * @returns A JSX element containing the current stock price, last updated date, and buttons to buy/sell the stock
 */
export default function StockPriceInfo({ stock, currentPrice }: StockPriceInfoProps) {
  return (
    <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <p className="text-gray-400 text-sm">Current Price</p>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-white">
              {currentPrice ? `$${currentPrice.toFixed(2)}` : 'N/A'}
            </p>
            {currentPrice && stock && (
              // Display the stock price change component if currentPrice is available
              <StockPriceChange stockId={stock.id} />
            )}
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4">
          <Link href={`/stocks/${stock.shortname}/buy`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Buy Stock
            </button>
          </Link>
          <Link href={`/stocks/${stock.shortname}/sell`}>
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Sell Stock
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}