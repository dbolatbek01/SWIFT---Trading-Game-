'use client';
import { Stock } from '@/types/interfaces';

/**
 * Props interface for StockHeader component.
 * @property stock - Object containing information about the stock
 */
interface StockHeaderProps {
  stock: Stock;
}

/**
 * The StockHeader component displays the stock name and short name in a styled header.
 * It is used to provide a clear and visually appealing title for stock-related pages.
 *
 * @param {Stock} stock - The stock object containing stock details.
 * @returns {JSX.Element} A styled header element displaying the stock name and short name.
 */
export default function StockHeader({ stock }: StockHeaderProps) {
  return (
    <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
      {stock.stockname} ({stock.shortname})
    </h1>
  );
}