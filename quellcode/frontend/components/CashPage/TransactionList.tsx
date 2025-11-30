import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllTransactions, Stock } from '@/types/interfaces';
import { getAllTransactions } from '@/components/CashPage/CashPageGet';
import StockGets from '@/components/stocks/StockGets';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface TransactionProps {
  token: string; // Auth token for API requests
}

type FilterType = 'all' | 'income' | 'outgoings';

/**
 * TransactionList Component
 * -------------------------
 * Displays and filters a user's transaction history.
 * Features:
 * - Grouping by date (Today, This Month, previous months)
 * - Filtering by transaction type: all, income, or outgoings
 * - Toggle between showing latest 5 or the full list
 *
 * Props:
 * - token: string (authorization token for fetching transactions)
 */
export default function TransactionList({ token }: TransactionProps) {
  const router = useRouter();
  
  // State to store all fetched transactions
  const [transactions, setTransactions] = useState<AllTransactions[]>([]);
  // State to store current filter type
  const [filter, setFilter] = useState<FilterType>('all');
  // Loading flag for API call
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all transactions on component mount or when token changes
  useEffect(() => {
    if (token) {
      setIsLoading(true);
      getAllTransactions(token)
        .then(data => setTransactions(data))
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  // Apply the filter to the transactions array
  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'outgoings') return !tx.bs;
    if (filter === 'income') return tx.bs;
    return true;
  });

  /**
   * Groups transactions into date-based categories:
   * - "Today": Transactions that happened today
   * - "This Month": Transactions from the current month (except today)
   * - "<Month Year>": Transactions from previous months
   */
  const groupTransactionsByDate = () => {
    // Sort by date descending (most recent first)
    const sorted = [...filteredTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Reference for "today" (start of the day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Reference for start of current month
    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);

    // Initial group containers
    const grouped: Record<string, AllTransactions[]> = {
      'Today': [],
      'This Month': [],
    };

    // Group each transaction
    sorted.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthYear = txDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (txDate >= today) {
        grouped['Today'].push(tx);
      } else if (txDate >= startOfCurrentMonth) {
        grouped['This Month'].push(tx);
      } else {
        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push(tx);
      }
    });

    // Remove any empty groups
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) {
        delete grouped[key];
      }
    });

    return grouped;
  };

  // Group transactions for display
  const groupedTransactions = groupTransactionsByDate();
  const groupKeys = Object.keys(groupedTransactions);

  // Check if there are no transactions for the current filter
  const hasNoTransactions = filteredTransactions.length === 0;

  return (
    <div className="w-full rounded-2xl flex flex-col h-[calc(100vh-10rem)]">
      <div className="p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#F596D3] to-[#D247BF]">
          Transactions
        </h2>

        {/* Filter buttons for All / Income / Outgoings */}
        <div className="flex gap-2 mb-6">
          {(['all', 'income', 'outgoings'] as FilterType[]).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                filter === type
                  ? 'bg-black/50 text-white'
                  : 'bg-white/90 text-black'
              }`}
            >
              {type === 'all' ? 'All' : type === 'income' ? 'Income' : 'Outgoings'}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content section */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(75, 85, 99, 0.3) transparent',
      }}>
        {isLoading ? (
          // Show loading skeleton while fetching
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-5 bg-gray-700 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : hasNoTransactions ? (
          // No transactions for the current filter
          <div className="text-center py-6 text-gray-400 font-medium">
            No transactions made yet
          </div>
        ) : (
          // Show all transactions grouped by date
          <div className="space-y-6">
            {groupKeys.map(groupKey => (
              <div key={groupKey} className="space-y-3">
                <h3 className="text-gray-300 font-semibold text-sm uppercase tracking-wider">
                  {groupKey}
                </h3>
                <ul className="space-y-2">
                  <StockGets>
                    {({ stocks }) => (
                      <>
                        {groupedTransactions[groupKey].map((tx, idx) => (
                          <TransactionItem key={`${groupKey}-${idx}`} tx={tx} router={router} stocks={stocks} />
                        ))}
                      </>
                    )}
                  </StockGets>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * TransactionItem Component
 * --------------------------
 * Renders a single transaction item in the list.
 * Displays:
 * - Transaction type icon (income/sell or outgoing/buy)
 * - Stock name
 * - Transaction direction (Buy/Sell)
 * - Date (time if today, date if earlier)
 * - Value in USD
 *
 * Props:
 * - tx: AllTransactions (single transaction object)
 * - router: AppRouterInstance (for navigation)
 */
const TransactionItem = ({ tx, router, stocks }: { tx: AllTransactions; router: AppRouterInstance; stocks: Stock[] }) => {
  /**
   * Formats the transaction date.
   * - If the transaction is today, display as HH:MM.
   * - Otherwise, display as "day month" (e.g., "7 Jul").
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date >= today) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const handleClick = () => {
    // Find the stock by idStock first, then by name
    let targetStock = null;
    
    if (tx.idStock) {
      targetStock = stocks.find((stock: Stock) => stock.id === tx.idStock);
    }
    
    if (!targetStock) {
      // Try to find by stockName (exact match or partial match)
      targetStock = stocks.find((stock: Stock) => 
        stock.stockname === tx.stockName || 
        stock.stockname.toLowerCase().includes(tx.stockName.toLowerCase()) ||
        tx.stockName.toLowerCase().includes(stock.stockname.toLowerCase())
      );
    }
    
    if (targetStock && targetStock.shortname) {
      router.push(`/stocks/${targetStock.shortname}/view`);
    } else {
      // Fallback to search page if stock not found
      router.push(`/search?q=${encodeURIComponent(tx.stockName)}`);
    }
  };

  return (
    <li 
      className="p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10">
            {/* Icon based on transaction type (income or outgoing) */}
            {tx.bs ? (
              // Income/Sell icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            ) : (
              // Outgoing/Buy icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-100">{tx.stockName}</p>
            <p className="text-xs text-gray-400 font-medium">
              {tx.bs ? 'Sell' : 'Buy'} • {formatDate(tx.date)}
            </p>
          </div>
        </div>
        <p className="font-semibold text-gray-100">
          {tx.value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>
    </li>
  );
};