'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Stock } from '@/types/interfaces';
import { useSession } from 'next-auth/react';
import StockHeader from './StockHeader';
import StockPriceInfo from './StockPriceInfo';
import StockCompanyInfo from './StockCompanyInfo';
import UserPosition from './UserPosition';
import StockChart from './StockChart';

/**
 * Props interface for StockViewContent component.
 * @property stocks - Array of stock objects
 * @property getStockPrice - Function to fetch the current price of a stock
 */
interface StockViewContentProps {
  stocks: Stock[];
  getStockPrice: (id: number) => Promise<number | null>;
}

/**
 * Component to display a single stock's details page.
 * @description This component fetches stock data and displays it in a nicely formatted page.
 * @param {StockViewContentProps} props - The component props.
 * @returns {JSX.Element} The JSX element representing the stock details page.
 * @example
 * <StockViewContent stocks={stocks} getStockPrice={getStockPrice} />
 */
export default function StockViewContent({ stocks, getStockPrice }: StockViewContentProps) {
  const params = useParams();
  const shortname = params.shortname as string;
  const [stock, setStock] = useState<Stock | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const foundStock = stocks.find(s => s.shortname === shortname);
    if (foundStock) {
      setStock(foundStock);
  
      /**
       * Fetches the current price of a stock by its ID and updates the component state accordingly.
       * 
       * If the price is not null, it updates the current price state and sets the previous price state
       * to the current price if it is not already set. It also sets the last updated date to the current
       * date and time.
       * 
       * If the price is null, it sets the loading state to false and sets the error state to a default
       * error message.
       * 
       * @returns {void}
       */
      const fetchPrice = async () => {
        try {
          const price = await getStockPrice(foundStock.id);
          if (price !== null) {
            if (currentPrice !== null) {
              setPreviousPrice(currentPrice);
            } else if (previousPrice === null) {
              setPreviousPrice(price * 0.995);
            }
            
            setCurrentPrice(price);
            setLastUpdated(new Date().toISOString());
          }
          setLoading(false);
        } catch (err) {
          console.error('Error generating price:', err);
          setError('Failed to generate stock price');
          setLoading(false);
        }
      };
  
      fetchPrice();
      const interval = setInterval(fetchPrice, 180000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
      setError('Stock not found');
    }
  }, [stocks, shortname, getStockPrice, session?.accessToken, currentPrice, previousPrice]);
  /**
   * Dependencies:
   * - stocks: The array of stock objects.
   * - shortname: The shortname of the stock to display.
   * - getStockPrice: The function to fetch the current price of a stock.
   * - session?.accessToken: The session access token.
   * - currentPrice: The current price of the stock.
   * - previousPrice: The previous price of the stock.
   * 
   * If any of these dependencies change, the useEffect hook will be re-run.
   */

  if (!stock || loading) return null;

  return (
    <div className="space-y-8 pb-8">
      <StockHeader stock={stock} />
      <StockPriceInfo 
        stock={stock} 
        currentPrice={currentPrice} 
        lastUpdated={lastUpdated} 
      />
      <StockChart stockId={stock.id} />
      <UserPosition stockId={stock.id} stockName={stock.stockname} />
      <StockCompanyInfo stock={stock} />
    </div>
  );
}