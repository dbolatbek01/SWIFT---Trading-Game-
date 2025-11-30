'use client';

import { useEffect, useState, useCallback } from 'react';
import { Stock } from '@/types/interfaces';

/**
 * A component that fetches stock data and provides it to its children.
 * 
 * This component fetches stock data from a JSON file and provides a function
 * to get the current price of a stock by its ID.
 * 
 * Props:
 * - children: A function that receives the stocks and getStockPrice function as props.
 */
interface StockGetsProps {
  children: (props: {
    stocks: Stock[];
    getStockPrice: (id: number) => Promise<number | null>;
  }) => React.ReactNode;
}

export default function StockGets({ children }: StockGetsProps) {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    /**
     * Fetches the stock data from the local JSON file.
     * 
     * This function fetches the stock data from the local JSON file and sets the
     * state if the fetch is successful. If there is an error, it logs it to the
     * console.
     */
    const fetchStocks = async () => {
      try {
        const response = await fetch('/stocks.json');
        const data = await response.json();
        setStocks(data);
      } catch (err) {
        console.error('Failed to fetch stocks', err);
      }
    };

    fetchStocks();
  }, []);

  /**
   * Fetches the current price of a stock by its ID.
   * 
   * This function fetches the current price of a stock from the API and returns
   * it. If there is an error, it logs it to the console and returns null.
   */
  // This function is memoized to avoid unnecessary re-fetching.
  // It will only change if the `id` parameter changes.
  const getStockPrice = useCallback(async (id: number): Promise<number | null> => {
    try {
      const response = await fetch(`/api/stocks/${id}/price`);
      if (!response.ok) {
        // Suppress error logging for 404/not found only for price
        if (response.status !== 404) {
          console.error('Error fetching stock price:', response.status, response.statusText);
        }
        return null;
      }
      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error('Error fetching stock price:', error);
      return null;
    }
  }, []);

  return <>{children({ stocks, getStockPrice })}</>;
}