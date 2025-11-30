// English Documentation for BuyPageContent

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Stock } from '@/types/interfaces';
import StockInfoCard from '@/components/transactionPages/buyPage/StockInfoCardBuy';
import TransactionFormBuy from '@/components/transactionPages/buyPage/TransactionFormBuy';
import { useAuthToken } from '@/lib/useAuthToken';
import { getCurrentWorthBankaccount } from '@/components/CashPage/CashPageGet';
import SuccessNotification from '@/components/transactionPages/SuccessNotification';

/**
 * BuyPageContent is a React component that renders the content for the stock purchase page.
 * It displays information about a selected stock, allows the user to buy shares,
 * shows the user's available cash, and handles purchase transactions and notifications.
 *
 * Props:
 * - stocks: The list of all available stocks.
 * - getStockPrice: A function to fetch the current price for a stock by its ID.
 */
export default function BuyPageContent({ 
  stocks, 
  getStockPrice 
}: { 
  stocks: Stock[]; 
  getStockPrice: (id: number) => Promise<number | null>; 
}) {
  // Get route parameters and navigation helpers
  const resolvedParams = useParams();
  const router = useRouter();

  // State to hold cash available for purchases
  const [cashAvailable, setCashAvailable] = useState<number>(0);

  // State to hold the current price and last update time for the selected stock
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // State to store the selected stock object
  const [stock, setStock] = useState<Stock | null>(null);

  // State for purchase success notification
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // State to indicate if a transaction is in progress (disables the buy button)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the user's authentication token
  const token = useAuthToken();

  // Find the stock by the shortname in route params
  const foundStock = stocks.find(s => s.shortname === resolvedParams.shortname);

  // Fetch the user's available cash from their bank account on mount or when token changes
  useEffect(() => {
    const fetchCurrentWorth = async () => {
      if (!token) return;
      try {
        const data = await getCurrentWorthBankaccount(token);
        // Defensive: check if response is valid and extract current worth
        const currentWorth = (data && Array.isArray(data) && data.length > 0 && data[0].currentWorth) || 0;
        setCashAvailable(currentWorth);
      } catch (error) {
        console.error('Error fetching current worth:', error);
      }
    };

    fetchCurrentWorth();
  }, [token]);

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

  const [orderType, setOrderType] = useState('market');
  const [showModal, setShowModal] = useState(false);
  const isLoading = isSubmitting;
  const orderTypeButton = (
    <div className="relative group shadow-amber-50 shadow-sm rounded-lg">
      <button
        type="button"
        className="flex items-center gap-2 px-5 py-2 text-white font-semibold text-base cursor-pointer"
        onClick={() => setShowModal(true)}
        disabled={isLoading}
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <span>{orderType.charAt(0).toUpperCase() + orderType.slice(1)}</span>
      </button>
    </div>
  );

  /**
  Handle the "Buy" button click.
  Depending on the order type, the appropriate API endpoint is used.
  Success notification and redirect are handled here. 
  */
  const handleBuy = async (
    quantity: number,
    limitPrice: number = 0,
    stopPrice: number = 0
  ) => {
    if (!stock || isSubmitting) return;
    if (quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    setIsSubmitting(true);
    try {
      let res, data;
      if (orderType === 'shares') {
        res = await fetch(`/api/stocks/${stock.id}/buy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count: quantity }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Buy failed!');
        setSuccessMessage(`Purchased: ${quantity} shares of ${stock.stockname}`);
      } else {
        // OrderType from State
        const orderTypeValue = orderType.toUpperCase();
        const orderPayload = {
          idStock: stock.id,
          bs: false, // buy
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
      setTimeout(() => {
        router.push(`/stocks/${stock.shortname}/view`);
      }, 500);
    } catch (error) {
      console.error(error);
      alert((orderType === 'shares' ? 'Buy failed! ' : 'Order failed! ') + (error instanceof Error ? error.message : ''));
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
        type='buy'
      />
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] backdrop-blur-md border border-gray-700/50 transition-all duration-500 max-w-2xl mx-auto flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e1f26] to-[#2a2c38]"></div>
        <div className="relative z-10 p-2 flex-1 flex flex-col">
          <StockInfoCard 
            stock={foundStock}
            currentPrice={currentPrice}
            lastUpdated={lastUpdated}
            cashAvailable={cashAvailable}
            orderTypeButton={orderTypeButton}
          />
          <TransactionFormBuy 
            currentPrice={currentPrice}
            cashAvailable={cashAvailable}
            onBuy={handleBuy}
            isLoading={isSubmitting}
            orderType={orderType}
            setOrderType={setOrderType}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        </div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -inset-2 bg-gradient-to-b from-[#1e1f26] to-[#2c2f3e] rounded-xl blur-md"></div>
        </div>
      </div>
    </>
  );
}