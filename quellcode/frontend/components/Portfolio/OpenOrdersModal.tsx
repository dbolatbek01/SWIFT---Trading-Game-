import React, { useState, useEffect, useRef } from 'react';

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(51, 65, 85, 0.3);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.5);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.7);
  }
`;



interface OrderFromAPI {
  idOrder: number;
  idStock: number;
  idUser: string;
  orderType: 'LIMIT' | 'STOP' | 'MARKET';
  quantity: number;
  amount: number;
  bs: boolean; // false = buy, true = sell
  executedPrice: number;
  executedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Order extends OrderFromAPI {
  stockname: string;
  shortname: string;
}

interface OpenOrdersModalProps {
  onClose: () => void;
  show: boolean;
}

const fetchOpenOrders = async (): Promise<Order[]> => {
  try {
    const [ordersRes, stocksRes] = await Promise.all([
      fetch('/api/orders/all'),
      fetch('/stocks.json')
    ]);
    
    if (!ordersRes.ok) throw new Error('Failed to fetch orders');
    if (!stocksRes.ok) throw new Error('Failed to fetch stocks');
    
    const orders: OrderFromAPI[] = await ordersRes.json();
    const stocks = await stocksRes.json();
    
    // Create a map for quick stock lookup by ID
    const stockMap: Record<number, { stockname: string; shortname: string }> = {};
    stocks.forEach((stock: { id: number; stockname: string; shortname: string }) => {
      stockMap[stock.id] = {
        stockname: stock.stockname,
        shortname: stock.shortname
      };
    });
    
    console.log('Orders:', orders);
    console.log('Stock map keys:', Object.keys(stockMap));
    
    // Enrich orders with stock information
    return orders.map((order: OrderFromAPI) => {
      const stock = stockMap[order.idStock];
      console.log(`Order ${order.idOrder}: idStock=${order.idStock}, found stock:`, stock);
      
      return {
        ...order,
        stockname: stock?.stockname || `Stock ID: ${order.idStock}`,
        shortname: stock?.shortname || ''
      };
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

const OpenOrdersModal: React.FC<OpenOrdersModalProps> = ({ onClose, show }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'executed'>('pending');
  const [filterOrderType, setFilterOrderType] = useState<string>('ALL');
  const [filterDirection, setFilterDirection] = useState<string>('ALL');
  const [isOrderTypeOpen, setIsOrderTypeOpen] = useState(false);
  const [isDirectionOpen, setIsDirectionOpen] = useState(false);
  const orderTypeRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show) {
      setLoading(true);
      fetchOpenOrders().then((data) => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [show]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (orderTypeRef.current && !orderTypeRef.current.contains(event.target as Node)) {
        setIsOrderTypeOpen(false);
      }
      if (directionRef.current && !directionRef.current.contains(event.target as Node)) {
        setIsDirectionOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const deleteOrder = async (idOrder: number) => {
    try {
      console.log(`Attempting to delete order ${idOrder}`);
      const res = await fetch('/api/orders/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idOrder }),
      });
      
      console.log(`Delete response status: ${res.status}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Delete failed:', errorText);
        throw new Error(`Failed to delete order: ${errorText}`);
      }
      
      const result = await res.json();
      console.log('Delete successful:', result);
      
      // Refresh orders list after deletion
      setLoading(true);
      fetchOpenOrders().then((data) => {
        setOrders(data);
        setLoading(false);
      });
    } catch (error) {
      console.error('Delete order error:', error);
      alert(`Error deleting order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!show) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div 
        className="fixed inset-0 z-40 flex items-start justify-center  backdrop-blur-sm animate-in fade-in duration-200 pt-20"
        onClick={onClose}
      >
      <div 
        className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-3xl shadow-2xl w-full max-w-6xl mx-4 p-0 relative animate-in slide-in-from-top-4 duration-300 mt-4 max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-xl">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Orders</h2>
              <p className="text-sm text-gray-400">Manage your pending and executed orders</p>
            </div>
          </div>
          <button
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="px-6 py-3 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            {/* Left side - Tab buttons */}
            <div className="flex space-x-1 bg-black/20 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'pending'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-black/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pending
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === 'pending' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-600/50 text-gray-300'
                  }`}>
                    {orders.filter(order => !order.executedAt).length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('executed')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'executed'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-black/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Executed
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === 'executed' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-600/50 text-gray-300'
                  }`}>
                    {orders.filter(order => order.executedAt).length}
                  </span>
                </div>
              </button>
            </div>

            {/* Right side - Filter dropdowns */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2" ref={orderTypeRef}>
                <span className="text-sm font-medium text-gray-300">Ordertype:</span>
                <div className="relative">
                  <button
                    onClick={() => setIsOrderTypeOpen(!isOrderTypeOpen)}
                    className="bg-black/20 border border-gray-700/50 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-gray-600/50 hover:border-gray-600/50 transition-colors flex items-center justify-between min-w-[100px]"
                  >
                    <span>{filterOrderType === 'ALL' ? 'All' : filterOrderType}</span>
                    <svg className={`w-4 h-4 ml-2 transition-transform ${isOrderTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOrderTypeOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-[#1e1f24] border border-gray-700/50 rounded-lg shadow-lg z-50 min-w-[100px]">
                      {['ALL', 'MARKET', 'LIMIT', 'STOP'].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterOrderType(option);
                            setIsOrderTypeOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700/50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                        >
                          {option === 'ALL' ? 'All' : option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2" ref={directionRef}>
                <span className="text-sm font-medium text-gray-300">Buy/Sell:</span>
                <div className="relative">
                  <button
                    onClick={() => setIsDirectionOpen(!isDirectionOpen)}
                    className="bg-black/20 border border-gray-700/50 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-gray-600/50 hover:border-gray-600/50 transition-colors flex items-center justify-between min-w-[100px]"
                  >
                    <span>
                      {filterDirection === 'ALL' ? 'All' : 
                       filterDirection === 'BUY' ? 'Buy' : 'Sell'}
                    </span>
                    <svg className={`w-4 h-4 ml-2 transition-transform ${isDirectionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isDirectionOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-[#1e1f24] border border-gray-700/50 rounded-lg shadow-lg z-50 min-w-[100px]">
                      {[
                        { value: 'ALL', label: 'All' },
                        { value: 'BUY', label: 'Buy' },
                        { value: 'SELL', label: 'Sell' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilterDirection(option.value);
                            setIsDirectionOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700/50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
                <span className="text-gray-300 font-medium">Loading orders...</span>
              </div>
            </div>
          ) : orders.filter(order => activeTab === 'pending' ? !order.executedAt : order.executedAt).length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-black/20 rounded-2xl inline-block mb-4">
                <svg className="w-12 h-12 text-gray-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {activeTab === 'pending' ? 'No pending orders' : 'No executed orders'}
              </h3>
              <p className="text-gray-400">
                {activeTab === 'pending' 
                  ? "You don't have any open orders at the moment." 
                  : "You haven't had any orders executed yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders
                .filter(order => {
                  const tabMatch = activeTab === 'pending' ? !order.executedAt : order.executedAt;
                  const typeMatch = filterOrderType === 'ALL' || order.orderType === filterOrderType;
                  const directionMatch = filterDirection === 'ALL' || 
                    (filterDirection === 'BUY' && !order.bs) || 
                    (filterDirection === 'SELL' && order.bs);
                  return tabMatch && typeMatch && directionMatch;
                })
                .length === 0 && orders.filter(order => activeTab === 'pending' ? !order.executedAt : order.executedAt).length > 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-black/20 rounded-2xl inline-block mb-4">
                      <svg className="w-12 h-12 text-gray-500 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No orders match your filters</h3>
                    <p className="text-gray-400 mb-4">Try adjusting your filter settings to see more orders.</p>
                    <button
                      onClick={() => {
                        setFilterOrderType('ALL');
                        setFilterDirection('ALL');
                      }}
                      className="px-4 py-2 bg-black/20 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-white rounded-lg transition-colors duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : 
                orders
                  .filter(order => {
                    const tabMatch = activeTab === 'pending' ? !order.executedAt : order.executedAt;
                    const typeMatch = filterOrderType === 'ALL' || order.orderType === filterOrderType;
                    const directionMatch = filterDirection === 'ALL' || 
                      (filterDirection === 'BUY' && !order.bs) || 
                      (filterDirection === 'SELL' && order.bs);
                    return tabMatch && typeMatch && directionMatch;
                  })
                  .map((order, index) => (
                <div 
                  key={order.idOrder} 
                  className="group p-3 rounded-xl bg-black/20 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg animate-in slide-in-from-left"
                  style={{ animationDelay: `${Math.min(index * 50, 500)}ms`, animationDuration: '300ms' }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* Stock Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-gray-700/50 rounded-lg">
                          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base leading-tight">
                            {order.stockname}
                          </h3>
                          {order.shortname && (
                            <p className="text-gray-400 text-xs font-medium">{order.shortname}</p>
                          )}
                        </div>
                      </div>

                      {/* Order Details Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-0.5">
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Type & Buy/Sell</p>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-gray-700/50 text-gray-200">
                              {order.orderType}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                              !order.bs 
                                ? 'bg-green-600 text-white' 
                                : 'bg-red-600 text-white'
                            }`}>
                              {!order.bs ? 'BUY' : 'SELL'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Quantity</p>
                          <p className="text-white font-bold text-sm">{order.quantity.toLocaleString()}</p>
                        </div>

                        {order.amount > 0 && (
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Amount</p>
                            <p className="text-white font-bold text-sm">${order.amount.toLocaleString()}</p>
                          </div>
                        )}

                        <div className="space-y-0.5">
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Created</p>
                          <p className="text-gray-300 text-xs">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Execution Info - nur bei executed orders */}
                      {order.executedPrice > 0 && order.executedAt && (
                        <div className="mt-2 p-2 bg-green-600/20 border border-green-600/30 rounded-lg">
                          <p className="text-xs text-green-400 uppercase font-semibold tracking-wider mb-0.5">Executed Price</p>
                          <div className="flex items-center justify-between">
                            <p className="text-green-300 font-bold text-sm">${order.executedPrice.toFixed(2)}</p>
                            <p className="text-green-400 text-xs">
                              {new Date(order.executedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {order.executedAt ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                          <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-400 font-bold text-xs">Executed</span>
                        </div>
                      ) : (
                        <button
                          className="group/btn p-2 rounded-lg bg-red-600 border border-red-700 text-white hover:bg-red-700 hover:border-red-800 transition-all duration-200 hover:scale-105"
                          onClick={() => deleteOrder(order.idOrder)}
                          aria-label="Cancel Order"
                          title="Cancel Order"
                        >
                          <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default OpenOrdersModal;
