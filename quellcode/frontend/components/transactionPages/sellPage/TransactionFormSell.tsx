'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TransactionFormProps {
  currentPrice: number | null;       // The current price of the stock
  sharesAvailable: number;           // The number of shares the user currently owns
  onSell: (quantity: number, limitPrice: number, stopPrice: number) => Promise<void>; // Callback function to handle sell action
  isLoading: boolean;                // Boolean indicating if a transaction is being processed
  marketClosed?: boolean;            // Whether the market is closed
}

const ORDER_TYPES = [
  {
    value: 'shares',
    label: 'Shares',
    icon: (
      <Image src="/icons/Shares_Icon.png" alt="Shares" width={24} height={24} className="w-6 h-6" />
    ),
    description: 'Sell shares during market hours',
  },
  {
    value: 'market',
    label: 'Market',
    icon: (
      <Image src="/icons/Amount_Icon.png" alt="Market" width={24} height={24} className="w-6 h-6" />
    ),
    description: 'Place an Order to sell any quantity at market price',
  },
  {
    value: 'limit',
    label: 'Limit',
    icon: (
      <Image src="/icons/Limit_Icon.png" alt="Limit" width={24} height={24} className="w-6 h-6" />
    ),
    description: 'Sell shares when the price reaches or rises above a specified value',
  },
  {
    value: 'stop',
    label: 'Stop',
    icon: (
      <Image src="/icons/Stop_Icon.png" alt="Stop" width={24} height={24} className="w-6 h-6" />
    ),
    description: 'Sell shares after the price has reached a set value',
  },
];

/**
 * TransactionFormSell is a React component for selling stocks.
 * It provides a form where users can enter the number of shares to sell,
 * see the total sell amount, and submit a sale request.
 *
 * Props:
 * - currentPrice: The current price of the selected stock.
 * - sharesAvailable: The number of shares the user owns and can sell.
 * - onSell: Callback function to execute the sell operation.
 * - isLoading: Indicates if a transaction is in progress.
 */
export default function TransactionFormSell({
  currentPrice,
  sharesAvailable,
  onSell,
  isLoading,
  orderType,
  setOrderType,
  showModal,
  setShowModal,
}: TransactionFormProps & {
  orderType: string;
  setOrderType: (type: string) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  marketClosed?: boolean;
}) {
  // State for the quantity input (as string to allow direct editing)
  const [quantity, setQuantity] = useState('1');

  // State for the calculated sell amount
  const [sellAmount, setSellAmount] = useState(0);

  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');

  // Helper: is market open right now?
  const isMarketOpen = (() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const minutes = now.getHours() * 60 + now.getMinutes();
    // Market open: Mo-Fr, 15:30–22:00
    const isWeekday = day >= 1 && day <= 5;
    return isWeekday && minutes >= 930 && minutes < 1320;
  })();

  // Update sell amount whenever quantity or price changes
  useEffect(() => {
    if (currentPrice) {
      const quantityNumber = parseFloat(quantity) || 0;
      setSellAmount(parseFloat((quantityNumber * currentPrice).toFixed(2)));
    }
  }, [quantity, currentPrice]);

  // Set 'shares' as default orderType on mount
  useEffect(() => {
    setOrderType('shares');
  }, [setOrderType]);

  /**
   * Handle form submission.
   * Converts the quantity to a number and calls the onSell callback.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantityNumber = parseFloat(quantity) || 0;
    await onSell(
      quantityNumber,
      parseFloat(limitPrice) || 0,
      parseFloat(stopPrice) || 0
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-2 space-y-8 relative pb-4">
        {/* Modal für Ordertype Auswahl */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center backdrop-blur-xs"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 animate-fade-in-up relative min-h-[420px] md:min-h-[420px] flex flex-col justify-start md:justify-start"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-sm font-semibold text-gray-300 mb-6 mt-2">Ordertype</h3>
              <div className="flex-1 flex flex-col justify-start">
                <div className="flex flex-col gap-2">
                  {ORDER_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-all border border-transparent ${orderType === type.value ? 'border-[#61DAFB]' : 'hover:bg-white/30'}`}
                      onClick={() => {
                        setOrderType(type.value);
                        setShowModal(false);
                      }}
                    >
                      <span className="mr-6">{type.icon}</span>
                      <div className="flex-1 text-left">
                        <span className={`block font-medium text-white`}>{type.label}</span>
                        <span className={`block text-xs mt-1 text-gray-400`}>{type.description}</span>
                      </div>
                      {orderType === type.value && (
                        <svg className="w-6 h-6 ml-2" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market closed notification for Shares-Ordertype */}
        {orderType === 'shares' && !isMarketOpen && (
          <div className="w-full max-w-sm mx-auto mb-1 p-2 rounded-lg bg-gradient-to-r from-red-900/80 to-gray-800/80 border border-red-400 shadow flex items-center gap-3 animate-fade-in">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-red-300">Market closed</div>
              <div className="text-xs text-gray-300">15:30–22:00</div>
              <div className="text-xs text-gray-400">Select another order type outside market hours</div>
            </div>
          </div>
        )}

        {/* Limit/Stop */}
        {orderType === 'limit' && (
          <div className="w-full max-w-xl mx-auto">
            <label className="block text-sm text-gray-300 mb-2">Limit-Price ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={limitPrice}
              onChange={e => setLimitPrice(e.target.value)}
              required
              className="w-full py-2 px-4 bg-white/5 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#61DAFB] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="$100.00"
              disabled={isLoading}
            />
          </div>
        )}
        {orderType === 'stop' && (
          <div className="w-full max-w-xl mx-auto">
            <label className="block text-sm text-gray-300 mb-2">Stop-Preis ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={stopPrice}
              onChange={e => setStopPrice(e.target.value)}
              required
              className="w-full py-2 px-4 bg-white/5 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#61DAFB] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="$100.00"
              disabled={isLoading}
            />
          </div>
        )}

        <div className="w-full max-w-xl mx-auto">
          <label className="block text-lg font-medium text-gray-300 mb-4">
            Quantity:
          </label>
          <div className="relative flex items-center w-full">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, parseInt(quantity || '1') - 1).toString())}
              disabled={isLoading || parseInt(quantity || '1') <= 1}
              className="absolute left-2 p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                if (e.target.value === '' || /^[0-9]*\.?[0-9]*$/.test(e.target.value)) {
                  setQuantity(e.target.value);
                }
              }}
              min="1"
              step="1"
              required
              className="w-full py-4 px-12 bg-white/5 border border-gray-600 rounded-lg text-white text-center focus:ring-2 focus:ring-[#61DAFB] text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setQuantity((parseInt(quantity || '1') + 1).toString())}
              disabled={isLoading}
              className="absolute right-2 p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full max-w-xl mx-auto flex justify-center">
          <button
            type="submit"
            disabled={
              !currentPrice || 
              parseFloat(quantity) > sharesAvailable || 
              parseFloat(quantity) <= 0 || 
              isLoading ||
              (orderType === 'shares' && !isMarketOpen)
            }
            className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all duration-300 relative mt-2
              ${
                !currentPrice || parseFloat(quantity) > sharesAvailable || parseFloat(quantity) <= 0 || isLoading || (orderType === 'shares' && !isMarketOpen)
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-[#61DAFB]/70 to-[#03a3d7]/70 hover:from-[#03a3d7]/70 hover:to-[#61DAFB] text-white shadow-lg hover:shadow-[#61DAFB]/30'
              }`}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : (
              currentPrice 
                ? `Sell for $${sellAmount.toFixed(2)}` 
                : 'Loading price...'
            )}
          </button>
        </div>

        {parseFloat(quantity) > sharesAvailable && (
          <p className="text-red-400 text-lg text-center">
            Insufficient shares owned
          </p>
        )}
      </form>
    </>
  );
}