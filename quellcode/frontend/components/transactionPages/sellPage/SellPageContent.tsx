// English Documentation for SellPageContent

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Stock } from '@/types/interfaces';
import StockInfoCardSell from '@/components/transactionPages/sellPage/StockInfoCardSell';
import TransactionFormSell from '@/components/transactionPages/sellPage/TransactionFormSell';
import { getPortfolioInvestedValues } from '@/components/Portfolio/portfolioGets';
import { useAuthToken } from '@/lib/useAuthToken';
import SuccessNotification from '@/components/transactionPages/SuccessNotification';

/**
 * SellPageContent is a React component that renders the content for the stock selling page.
 * It displays information about a selected stock, allows the user to sell shares,
 * shows the user's available shares, and handles sell transactions and notifications.
 *
 * Props:
 * - stocks: The list of all available stocks.
 * - getStockPrice: A function to fetch the current price for a stock by its ID.
 */
export default function SellPageContent({
  stocks,
  getStockPrice,
}: {
  stocks: Stock[];
  getStockPrice: (id: number) => Promise<number | null>;
}) {
  // Get route parameters and navigation helpers
  const resolvedParams = useParams();
  const router = useRouter();

  // State to hold available shares for the selected stock
  const [sharesAvailable, setSharesAvailable] = useState<number>(0);

  // State to hold the current price and last update time for the selected stock
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // State to store the selected stock object
  const [stock, setStock] = useState<Stock | null>(null);

  // State for sell success notification
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // State to indicate if a transaction is in progress (disables the sell button)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ordertype-Button als Render-Prop vorbereiten
  const [orderType, setOrderType] = useState('market');
  const [showModal, setShowModal] = useState(false);
  const orderTypeButton = (
    <button
      type="button"
      className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg hover:cursor-pointer shadow-amber-50 shadow-sm"
      onClick={() => setShowModal(true)}
      disabled={isSubmitting}
    >
      <span className="font-semibold text-base">{orderType.charAt(0).toUpperCase() + orderType.slice(1)}</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  // Get the user's authentication token
  const token = useAuthToken();

  // Find the stock by the shortname in route params
  const foundStock = stocks.find((s) => s.shortname === resolvedParams.shortname);

  // When the selected stock changes, fetch its price and start a polling interval for live updates
  useEffect(() => {
    if (foundStock) {
      setStock(foundStock);

      const fetchPrice = async () => {
        const price = await getStockPrice(foundStock.id);
        if (price !== null) {
          setCurrentPrice(price);
          setLastUpdated(new Date().toISOString());
        }
      };

      fetchPrice();
      const interval = setInterval(fetchPrice, 60000); // Refresh price every 60 seconds

      return () => clearInterval(interval);
    }
  }, [foundStock, getStockPrice]);

  // Fetch user's available shares for the selected stock whenever the stock or token changes
  useEffect(() => {
    const fetchSharesAvailable = async () => {
      if (!stock) return;

      try {
        // Get invested values for the portfolio and find the current stock's data
        const investedValues = await getPortfolioInvestedValues(token);
        const stockData = investedValues.find((item) => item.idStock === stock.id);

        if (stockData) {
          setSharesAvailable(stockData.count);
        } else {
          setSharesAvailable(0);
        }
      } catch (error) {
        console.error('Error fetching shares available:', error);
        setSharesAvailable(0);
      }
    };

    fetchSharesAvailable();
  }, [stock, token]);

  // Market open/close logic
  const [marketClosed, setMarketClosed] = useState(false);
  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      // Market open: 15:30 (15*60+30=930), close: 22:00 (22*60=1320)
      const currentMinutes = hours * 60 + minutes;
      setMarketClosed(currentMinutes < 930 || currentMinutes >= 1320);
    };
    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

 /**
  Handle the "Sell" button click.
  Depending on the order type, the appropriate API endpoint is used.
  Success notification and redirect are handled here. 
  */
  const handleSell = async (
    quantity: number,
    limitPrice: number = 0,
    stopPrice: number = 0
  ) => {
    if (!stock || isSubmitting) return;
    if (quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }
    setIsSubmitting(true);
    try {
      let res, data;
      if (orderType === 'shares') {
        res = await fetch(`/api/stocks/${stock.id}/sell`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count: quantity }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Sale failed!');
        setSuccessMessage(`Sold: ${quantity} shares of ${stock.stockname}`);
      } else {
        // OrderType from State
        const orderTypeValue = orderType.toUpperCase();
        const orderPayload = {
          idStock: stock.id,
          bs: true, // Sell
          quantity,
          amount: 0,
          orderType: orderTypeValue,
          limitPrice: orderTypeValue === 'LIMIT' ? limitPrice : 0,
          stopPrice: orderTypeValue === 'STOP' ? stopPrice : 0,
        };
        res = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Order failed!');
        setSuccessMessage(`Order placed: ${quantity} shares of ${stock.stockname}`);
      }
      setShowSuccess(true);
      setSharesAvailable((prev) => prev - quantity);
      setTimeout(() => {
        router.push(`/stocks/${stock.shortname}/view`);
      }, 500);
    } catch (error) {
      console.error(error);
      alert((orderType === 'shares' ? 'Sale failed! ' : 'Order failed! ') + (error instanceof Error ? error.message : ''));
    }
  };

  // Show loading text if the stock is not found
  if (!foundStock) return <div className="p-6 text-gray-300">Loading stock data...</div>;

  // Render the component UI
  return (
    <>
      <SuccessNotification 
        message={successMessage} 
        onClose={() => setShowSuccess(false)} 
        show={showSuccess}
        type="sell"
      />
      
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] backdrop-blur-md border border-gray-700/50 transition-all duration-500 max-w-2xl mx-auto flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e1f26] to-[#2a2c38]"></div>

        <div className="relative z-10 p-2 flex-1 flex flex-col">
          <StockInfoCardSell
            stock={foundStock}
            currentPrice={currentPrice}
            lastUpdated={lastUpdated}
            sharesAvailable={sharesAvailable}
            orderTypeButton={orderTypeButton}
          />

          <TransactionFormSell
            currentPrice={currentPrice}
            sharesAvailable={sharesAvailable}
            onSell={handleSell}
            orderType={orderType}
            setOrderType={setOrderType}
            showModal={showModal}
            setShowModal={setShowModal}
            isLoading={isSubmitting}
            marketClosed={marketClosed}
          />
        </div>

        <div className="absolute inset-0 opacity-30">
          <div className="absolute -inset-2 bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-xl blur-md"></div>
        </div>
      </div>
    </>
  );
}