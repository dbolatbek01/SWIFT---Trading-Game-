'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getCashPageData } from '@/components/CashPage/CashPageGet';
import { AllTransactions } from '@/types/interfaces';

interface CashVisualizationProps {
  token: string;
}

export default function CashVisualization({ token }: CashVisualizationProps) {
  const [cashBalance, setCashBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<AllTransactions[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch both balance and transactions
      const { worth, transactions } = await getCashPageData(token);

      // Set balance
      if (worth && worth.length > 0 && worth[0]?.currentWorth) {
        setCashBalance(worth[0].currentWorth);
      } else {
        setCashBalance(0);
      }

      // Set transactions
      setTransactions(transactions || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data');
      setCashBalance(0);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  // Calculate monthly cash flow (last 3 months, current month first)
  const getMonthlyData = () => {
    const now = new Date();
    const months = [];
    
    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
      
      const monthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === monthDate.getMonth() && 
               txDate.getFullYear() === monthDate.getFullYear();
      });

      const income = monthTransactions
        .filter(tx => tx.bs)
        .reduce((sum, tx) => sum + tx.value, 0);
      
      const Outgoings = monthTransactions
        .filter(tx => !tx.bs)
        .reduce((sum, tx) => sum + tx.value, 0);

      months.push({
        month: monthName,
        income,
        Outgoings,
        net: income - Outgoings
      });
    }
    
    return months;
  };

  const monthlyData = getMonthlyData();
  const maxValue = Math.max(...monthlyData.map(m => Math.max(m.income, m.Outgoings)), 1);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Balance Card */}
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto"></div>
            <div className="h-8 bg-gray-700 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
        
        {/* Loading Overview */}
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700 rounded w-12"></div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-8 bg-gray-700/30 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Loading Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-gradient-to-br from-[#1e1f26] to-[#23272b] rounded-xl border border-[#03a3d7]/20">
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-700 rounded w-2/3 mx-auto"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-[#1e1f26] to-[#23272b] rounded-xl border border-[#D247BF]/20">
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-700 rounded w-2/3 mx-auto"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Cash Balance Card */}
      <div className='mb-16'>
        {error ? (
          <p className="text-gray-400 text-center">{error}</p>
        ) : (
          <div className="flex items-center gap-32">
            <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-[#F596D3] to-[#D247BF] rounded-full ml-6"></div>
                <p className="text-xl text-white font-bold">
                  Cash
                </p>
            </div>
            <p className="text-xl font-bold text-white">
              {cashBalance?.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              }) || '$0.00'}
            </p>
          </div>
        )}
      </div>

      {/* Modern Monthly Cash Flow */}
      <div className="group p-4 transition-all duration-300 mt-19">
        <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-[#61DAFB] to-[#03a3d7] rounded-full ml-2 mb-4"></div>
                <p className="text-xl text-white font-semibold mb-4">
                  Last 3 Months
                </p>
            </div>
        <div className="space-y-5">
          {monthlyData.map((month, index) => (
            <div key={index} className="group/item p-3 rounded-lg transition-all duration-200">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-300 font-medium transition-colors duration-200">
                  {month.month}
                </span>
              </div>
              
              {/* Progress Rings Visualization */}
              <div className="flex items-center justify-center gap-8">
                {/* Income Ring */}
                <div className="flex flex-col items-center group/income relative">
                  <div className="relative w-16 h-16">
                    {/* Background Circle */}
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-700"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Progress Circle */}
                      <path
                        className="transition-all duration-700 ease-out"
                        stroke="#03a3d7"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={`${(month.income / maxValue) * 100}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        style={{ 
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </svg>
                    {/* Center Value */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#03a3d7]">
                        {month.income >= 1000 
                          ? `$${(month.income / 1000).toFixed(0)}k`
                          : `$${month.income.toFixed(0)}`
                        }
                      </span>
                    </div>
                  </div>
                  <span className="text-xs mt-1 font-medium text-[#03a3d7]">Income</span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/income:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border border-white/10 whitespace-nowrap">
                      {month.income.toLocaleString('en-US', { 
                        style: 'currency', 
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                  </div>
                </div>

                {/* Outgoings Ring */}
                <div className="flex flex-col items-center group/outgoings relative">
                  <div className="relative w-16 h-16">
                    {/* Background Circle */}
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-700"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Progress Circle */}
                      <path
                        className="transition-all duration-700 ease-out"
                        stroke="#D247BF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={`${(month.Outgoings / maxValue) * 100}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        style={{ 
                          animationDelay: `${index * 200 + 100}ms`
                        }}
                      />
                    </svg>
                    {/* Center Value */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#D247BF]">
                        {month.Outgoings >= 1000 
                          ? `$${(month.Outgoings / 1000).toFixed(0)}k`
                          : `$${month.Outgoings.toFixed(0)}`
                        }
                      </span>
                    </div>
                  </div>
                  <span className="text-xs mt-1 font-medium text-[#D247BF]">Outgoings</span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/outgoings:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border border-white/10 whitespace-nowrap">
                      {month.Outgoings.toLocaleString('en-US', { 
                        style: 'currency', 
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
