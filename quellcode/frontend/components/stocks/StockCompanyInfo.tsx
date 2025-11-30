'use client';
import { Stock } from '@/types/interfaces';

/**
 * Props interface for StockCompanyInfo component.
 * 
 * @property stock - Object containing information about the stock
 */
interface StockCompanyInfoProps {
  stock: Stock;
}

/**
 * StockCompanyInfo component displays company information for a given stock.
 * 
 * @param stock - Object containing information about the stock
 * @returns A JSX element containing the company information
 */
export default function StockCompanyInfo({ stock }: StockCompanyInfoProps) {
  return (
    <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Company Information</h2>
      <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className=" rounded-lg p-4 shadow">
            <p className="text-gray-400 text-sm mb-1">Symbol</p>
            <p className="text-white font-medium">{stock.shortname}</p>
          </div>
          
          <div className=" rounded-lg p-4 shadow">
            <p className="text-gray-400 text-sm mb-1">Name</p>
            <p className="text-white font-medium">{stock.stockname}</p>
          </div>
          
          <div className=" rounded-lg p-4 shadow">
            <p className="text-gray-400 text-sm mb-1">Industry</p>
            <p className="text-white font-medium">{stock.industry}</p>
          </div>

          <div className=" rounded-lg p-4 shadow">
            <p className="text-gray-400 text-sm mb-1">Sector</p>
            <p className="text-white font-medium">{stock.sector}</p>
          </div>
        </div>
      </div>
    </div>
  );
}