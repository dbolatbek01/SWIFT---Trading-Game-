'use client';

import { useEffect, useState } from 'react';
import { useAuthToken } from '@/lib/useAuthToken';
import { getPortfolioInvestedValues, getPortfolioCurrentValues } from '@/components/Portfolio/portfolioGets';
import { PortfolioDataWithInvestedValue, PortfolioDataWithCurrentPrice } from '@/types/interfaces';

/**
 * Props interface for UserPosition component.
 * @property stockId - The ID of the stock for which the position is being displayed
 * @property stockName - The name of the stock for which the position is being displayed
 */
interface UserPositionProps {
  stockId: number;
  stockName: string;
}

/**
 * Interface representing the user's holding in a stock.
 * 
 * @property sharesOwned - The number of shares owned by the user
 * @property investedAmount - The total amount invested in the stock
 * @property currentValue - The current value of the stock holdings
 * @property averagePrice - The average price at which the shares were purchased
 * @property currentPrice - The current market price of the stock
 */
interface UserHolding {
  sharesOwned: number;
  investedAmount: number;
  currentValue: number;
  averagePrice: number;
  currentPrice: number;
}

/**
 * UserPosition component displays the user's stock position details for a specific stock.
 *
 * This component fetches and displays information about the user's holding in a specific
 * stock, including the number of shares owned, invested amount, current value, average
 * purchase price, and current market price. It also calculates and displays the profit
 * or loss on the investment along with its percentage. The component handles loading and
 * error states, providing respective messages to the user.
 *
 * Props:
 * - stockId: The unique identifier of the stock for which the position is displayed.
 * - stockName: The name of the stock for which the position is displayed.
 *
 * @returns JSX.Element representing the user's stock position details, loading spinner, or error message.
 */

export default function UserPosition({ stockId, stockName }: UserPositionProps) {
  const token = useAuthToken();
  const [holding, setHolding] = useState<UserHolding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  /**
   * Fetches the user's position for the given stock and updates the local state.
   *
   * If the user is not authenticated, the function does nothing.
   * If the user is authenticated, it fetches the user's invested values and current values
   * for the given stock and calculates the user's holding (shares owned, invested amount,
   * current value, average price, and current price). If the data is available, it updates
   * the local state with the holding data. If not, it sets the holding to null.
   * If an error occurs, it logs the error and sets an error message in the local state.
   * The function always sets the loading state to false when finished.
   */
    async function fetchUserPosition() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [investedValues, currentValues] = await Promise.all([
          getPortfolioInvestedValues(token),
          getPortfolioCurrentValues(token)
        ]);

        const investedData = investedValues.find((item: PortfolioDataWithInvestedValue) => 
          item.idStock === stockId
        );
        const currentData = currentValues.find((item: PortfolioDataWithCurrentPrice) => 
          item.idStock === stockId
        );

        if (investedData && currentData) {
          const sharesOwned = investedData.count;
          const averagePrice = investedData.value;
          const investedAmount = averagePrice * sharesOwned;
          const currentPrice = currentData.latestPrice;
          const currentValue = currentPrice * sharesOwned;

          setHolding({
            sharesOwned,
            investedAmount,
            currentValue,
            averagePrice,
            currentPrice
          });
        } else {
          setHolding(null);
        }
      } catch (err) {
        console.error('Error fetching user position:', err);
        setError('Position konnte nicht geladen werden');
      } finally {
        setLoading(false);
      }
    }

    fetchUserPosition();
  }, [token, stockId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Position</h2>
        <div className="flex justify-center items-center h-16">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#61DAFB]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Position</h2>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!holding) {
    return (
      <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Position</h2>
        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-gray-400 text-center">
            You don&apos;t own any {stockName} Stock.
          </p>
        </div>
      </div>
    );
  }

  const profitLoss = holding.currentValue - holding.investedAmount;
  const profitLossPercentage = (profitLoss / holding.investedAmount) * 100;
  const isPositive = profitLoss >= 0;

  return (
    <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Your Position</h2>
      
      <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="rounded-lg p-4 shadow">
            <p className="text-gray-400 text-sm mb-1"># of Shares</p>
            <p className="text-white text-lg font-semibold">
              {holding.sharesOwned.toLocaleString('de-DE')} Shares
            </p>
          </div>

          <div className="rounded-lg p-4 shadow">
            <p className="text-gray-400 text-sm mb-1">Avg. Price</p>
            <p className="text-white text-lg font-semibold">
              ${holding.averagePrice.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>

          <div className="rounded-lg p-4 shadow">
            <p className="text-gray-400 text-sm mb-1">Invested</p>
            <p className="text-white text-lg font-semibold">
              ${holding.investedAmount.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>

          <div className="rounded-lg p-4 shadow">
            <p className="text-gray-400 text-sm mb-1">Current Value</p>
            <p className="text-white text-lg font-semibold">
              ${holding.currentValue.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">Profit/Loss</p>
            <div className={`text-right ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <p className="text-lg font-semibold">
                {isPositive ? '+' : ''}{profitLoss.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} $
              </p>
              <p className="text-sm">
                ({isPositive ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}