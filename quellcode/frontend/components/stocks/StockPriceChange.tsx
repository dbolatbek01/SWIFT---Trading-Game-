import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

/**
 * StockPriceChange component displays the change in stock price as a percentage and absolute value.
 * 
 * This component fetches the stock price growth data for a given stock ID and displays the change
 * in both percentage and absolute value. It indicates the change with an arrow and color coding:
 * - Green for positive change
 * - Red for negative change
 * - Gray for no change
 *
 * Props:
 * - stockId: The unique identifier for the stock to display the price change.
 *
 * Dependencies:
 * - Requires session access token for authenticated API requests.
 */

export default function StockPriceChange({ stockId }: { stockId: number }) {
  const { data: session } = useSession();
  const [priceChange, setPriceChange] = useState<{ change: number; percent: number }>({ change: 0, percent: 0 });

  useEffect(() => {
  /**
   * Fetches the stock price growth data for the given stock ID and updates the state accordingly.
   * 
   * If the session access token is not available, the function does nothing.
   * 
   * The function makes a POST request to the /api/stocks/getStockGrowth endpoint with the
   * stock ID and the session access token. If the response is successful (200 OK), the
   * response is parsed as JSON and the change and percent values are extracted and used
   * to update the state. If the response is not successful, an error is logged to the console.
   * 
   * @returns {void}
   */
    const fetchChange = async () => {
      if (!session?.accessToken) return;
      const response = await fetch("/api/stocks/getStockGrowth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
            { token: session.accessToken,
                stockIds: [stockId] 
            }
        ),
      });
      if (response.ok) {
        const arr = await response.json();
        console.log('API Response:', arr);
        if (Array.isArray(arr) && arr.length > 0 && arr[0]) {
          const changeValue = parseFloat(arr[0].change) || 0;
          const percentValue = parseFloat(arr[0].procent) || 0;
          setPriceChange({
            change: changeValue,
            percent: percentValue
          });
        }
      } else {
        console.error('API Error:', response.status, response.statusText);
      }
    };
    fetchChange();
  }, [session?.accessToken, stockId]);

  /**
   * Returns a Tailwind CSS color class string based on the sign of the stock price change.
   * 
   * Returns "text-green-500" if the change is positive, "text-red-500" if the change is negative,
   * and "text-gray-500" if the change is zero.
   * 
   * @returns {string} A Tailwind CSS color class string.
   */
  const getPriceChangeColor = () => {
    if (priceChange.change > 0) return "text-green-500";
    if (priceChange.change < 0) return "text-red-500";
    return "text-gray-500";
  };

/**
 * Returns an arrow symbol indicating the direction of the stock price change.
 * 
 * Returns "▲" if the change is positive, "▼" if the change is negative,
 * and "▶" if there is no change.
 * 
 * @returns {string} An arrow symbol representing the price change direction.
 */

  const getArrow = () => {
    if (priceChange.change > 0) return "▲";
    if (priceChange.change < 0) return "▼";
    return "▶";
  };

  return (
    <span className={`ml-3 ${getPriceChangeColor()}`}>
      {getArrow()} {priceChange.percent.toFixed(2)}% (${priceChange.change.toFixed(2)})
    </span>
  );
}