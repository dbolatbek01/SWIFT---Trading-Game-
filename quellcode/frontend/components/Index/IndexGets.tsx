'use client';

import { useEffect, useState, useCallback } from 'react';
import { IndexInfo, IndexValue } from '@/types/interfaces';

/**
 * Response item from backend API
 */
interface IndexValueResponse {
  value?: number;
  date?: string;
  indexPriceTime?: string;
  price?: number;
}

/**
 * Props interface for IndexGets component
 * Uses render prop pattern to provide index data and functions to children
 * @interface IndexGetsProps
 * @property {Function} children - Render prop function that receives index data and utilities
 * @property {string} [decodedShortname] - Optional decoded shortname for auto-matching
 * @property {Function} [onIndexFound] - Optional callback when index is found
 */
interface IndexGetsProps {
  children: (props: {
    indexes: IndexInfo[];
    getIndexValues: (id: number, timeframe: string, date: string) => Promise<IndexValue[]>;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
  decodedShortname?: string;
  onIndexFound?: (index: IndexInfo | null) => void;
}

/**
 * IndexGets component - Data provider for index information
 * Fetches available indexes and provides a function to fetch index values
 * Uses render prop pattern to share data with child components
 * @component
 * @param {IndexGetsProps} props - Component props
 * @returns {React.ReactNode} Rendered children with provided data
 */
export default function IndexGets({ children, decodedShortname, onIndexFound }: IndexGetsProps) {
  // State for storing fetched indexes
  const [indexes, setIndexes] = useState<IndexInfo[]>([]);
  // Loading state for initial index fetch
  const [loading, setLoading] = useState(true);
  // Error state for handling fetch failures
  const [error, setError] = useState<string | null>(null);

  /**
   * Effect to fetch available indexes on component mount
   * Makes API call to loadIndexes endpoint and handles errors
   */
  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch available indexes from API
        const res = await fetch('/api/index/loadIndexes');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Handle both array and single object responses
        if (Array.isArray(data)) {
          setIndexes(data);
        } else if (data && typeof data === 'object') {
          // Convert single index object to array
          setIndexes([data]);
        } else {
          console.error('Expected array or object but got:', typeof data);
          setIndexes([]); // Default to empty array
          setError('Invalid data structure received');
        }
      } catch (err) {
        console.error('Failed to fetch indexes:', err);
        setIndexes([]); // Ensure indexes is always an array
        setError(err instanceof Error ? err.message : 'Error loading indices');
      } finally {
        setLoading(false);
      }
    };

    fetchIndexes();
  }, []);

  /**
   * Effect to find matching index when data is loaded
   */
  useEffect(() => {
    if (!loading && indexes.length > 0 && decodedShortname && onIndexFound) {
      const index = indexes.find((idx: IndexInfo) => {
        const idxShortname = idx.shortname.toLowerCase();
        const searchShortname = decodedShortname.toLowerCase();
        
        // Exact match
        if (idxShortname === searchShortname) return true;
        
        // Fuzzy match - remove non-alphanumeric characters
        if (idxShortname.replace(/[^a-z0-9]/gi, '') === searchShortname.replace(/[^a-z0-9]/gi, '')) return true;
        
        // Match with ^ prefix
        if (idxShortname === `^${searchShortname}`) return true;
        
        return false;
      });
      
      onIndexFound(index || null);
    }
  }, [loading, indexes, decodedShortname, onIndexFound]);

  /**
   * Function to fetch index values for a specific index, timeframe, and date
   * Note: Backend automatically returns the active index for the current season
   * @param {number} id - Index ID (used for reference, backend filters by active season)
   * @param {string} timeframe - Timeframe for the data ('hour', 'day', 'week', 'month')
   * @param {string} date - Date string in ISO format (for 'hour' timeframe, format: 'YYYY-MM-DD HH:mm:ss')
   * @returns {Promise<IndexValue[]>} Array of index values or empty array on error
   */
  const getIndexValues = useCallback(
    async (id: number, timeframe: string, date: string): Promise<IndexValue[]> => {
      try {
        let endpoint = '';
        let url = '';
        
        if (timeframe === 'hour') {
          endpoint = 'getIndexValueByHour';
          // Backend expects dateTime in format 'YYYY-MM-DD HH:mm:ss'
          // Ensure proper formatting
          let dateTime = date;
          if (date && !date.includes(':')) {
            // If no time is provided, add current time
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            dateTime = `${date} ${hours}:${minutes}:${seconds}`;
          }
          url = `/api/index/${endpoint}/${encodeURIComponent(dateTime)}`;
        } else if (timeframe === 'day') {
          endpoint = 'getIndexValueByDay';
          url = `/api/index/${endpoint}`;
        } else if (timeframe === 'week') {
          endpoint = 'getIndexValueByWeek';
          url = `/api/index/${endpoint}`;
        } else {
          endpoint = 'getIndexValueByMonth';
          url = `/api/index/${endpoint}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          const errorData = await res.text();
          console.error(`Failed to fetch ${endpoint}:`, errorData);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        // Backend returns data filtered by active season index
        // For 'hour' route: returns {value, date}
        // For other routes: returns {indexPriceTime, price}
        return Array.isArray(data)
          ? data.map((item: IndexValueResponse) => ({
              idIndex: id,
              date: item.date || item.indexPriceTime || '',
              value: item.value || item.price || 0
            }))
          : [];
      } catch (err) {
        console.error('Failed to fetch index values:', err);
        return [];
      }
    },
    []
  );

  // Render children with provided data and utilities
  return <>{children({ indexes, getIndexValues, loading, error })}</>;
}