'use client';
import TopNavbar from '@/app/navigation/Navbar';
import { useAuthToken } from '@/lib/useAuthToken';
import { useTokenSync } from '@/lib/useTokenSync';
import IndexGets from '@/components/Index/IndexGets';
import IndexChart from '@/components/Index/IndexChart';
import PortfolioChart from '@/components/HomePage/PortfolioChart';
import TimeframeSelector from '@/components/HomePage/TimeframeSelector';
import IndexValueCompact from '@/components/HomePage/IndexValueCompact';
import YesterdaysResult from '@/components/HomePage/YesterdaysResult';
import MiniLeaderboard from '@/components/HomePage/MiniLeaderboard';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * HomePage Component
 * 
 * Main dashboard displaying index charts, portfolio performance, 
 * yesterday's results, and leaderboard rankings.
 */
export default function HomePage() {
  // Authentication token and navigation
  const token = useAuthToken();
  const router = useRouter();
  useTokenSync();

  // Index display state
  const [currentValue, setCurrentValue] = useState<string>('');
  const [currentChange, setCurrentChange] = useState<{ percentage: number; absolute: number } | undefined>();
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [currentTimeframe, setCurrentTimeframe] = useState<string>('day');

  // Updates index value and percentage change
  const handleValueUpdate = useCallback((value: string, change?: { percentage: number; absolute: number }) => {
    setCurrentValue(value);
    setCurrentChange(change);
  }, []);

  // Updates chart metadata (last update time and timeframe)
  const handleDataUpdate = useCallback((update: { lastUpdate?: string; timeframe?: string }) => {
    if (update.lastUpdate) {
      setLastUpdate(update.lastUpdate);
    }
    if (update.timeframe) {
      setCurrentTimeframe(update.timeframe);
    }
  }, []);

  // Handles timeframe changes from selector
  const handleTimeframeChange = useCallback((timeframe: string) => {
    setCurrentTimeframe(timeframe);
  }, []);

  // Navigate to index detail page
  const handleIndexClick = useCallback((shortname: string) => {
    router.push(`/indices/${shortname}/view`);
  }, [router]);

  return (
    <div className="h-[95vh] max-h-screen bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] flex flex-col overflow-hidden">
      {/* Navigation bar */}
      <div className="container mx-auto sticky top-0 z-100">
        <TopNavbar />
      </div>

      {/* Mobile: Scrollable, Desktop/Tablet: Fits in viewport */}
      <div className="container mx-auto px-4 sm:px-6 max-w-[1500px] flex-1 overflow-y-auto lg:overflow-hidden flex flex-col">
        {/* Main responsive grid layout - Mobile: stacked, Desktop: 2x2 grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mt-4 lg:mt-6 lg:flex-1 lg:overflow-hidden lg:grid-rows-2'>
         {/* Row 1: Index Chart */}
          <div className='lg:col-span-2 xl:col-span-3 flex flex-col min-h-[400px] lg:min-h-0 lg:overflow-hidden'>
          {/* Index Chart */}
            <div className="bg-gradient-to-b from-[#1e1f26] to-[##2a2c38] rounded-lg shadow-lg h-full min-h-0 p-4 lg:p-6 overflow-hidden flex flex-col">
              <IndexGets>
                {({ indexes: fetchedIndexes, getIndexValues }) => {
                  // Choose first index
                  const firstIndex = Array.isArray(fetchedIndexes) && fetchedIndexes.length > 0 ? fetchedIndexes[0] : null;
                  if (!firstIndex) {
                    return <div className="h-full flex items-center justify-center text-gray-400">No indices available</div>;
                  }
                  return (
                    <div className="flex flex-col h-full">
                      {/* Header section */}
                      <div className="mb-3 lg:mb-4 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2 lg:gap-3">
                          <button 
                            className="group relative text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[24px] font-semibold text-white hover:text-blue-400 transition-all duration-200 cursor-pointer"
                            onClick={() => handleIndexClick(firstIndex.shortname)}
                          >
                            {/* Hover tooltip */}
                            <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 
                                            bg-gradient-to-r from-[#F596D3]/50 to-[#D247BF]/50 
                                            text-white text-[10px] sm:text-xs font-medium py-1 px-2 sm:px-3 rounded-full 
                                            shadow-lg opacity-0 group-hover:opacity-100 
                                            transition-all duration-200 whitespace-nowrap
                                            scale-90 group-hover:scale-100
                                            flex items-center">
                              Go to Index View
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </span>
                            <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[24px] text-transparent bg-clip-text bg-gradient-to-r from-[#F596D3] to-[#D247BF] font-semibold inline-block relative">
                              {firstIndex.indexname}
                              {/* Animated underline */}
                              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F596D3] to-[#D247BF] group-hover:w-full transition-all duration-200"></span>
                            </h2>
                          </button>
                          {/* Timeframe selector */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                            <TimeframeSelector 
                              currentTimeframe={currentTimeframe}
                              onTimeframeChange={handleTimeframeChange}
                            />
                          </div>
                        </div>
                        {/* Current value display */}
                        <IndexValueCompact
                          value={currentValue}
                          change={currentChange}
                          lastUpdate={lastUpdate}
                        />
                      </div>
                      {/* Chart area */}
                      <div className="flex-1 min-h-0">
                        <IndexChart
                          indexId={firstIndex.id}
                          getData={getIndexValues}
                          onValueUpdate={handleValueUpdate}
                          onDataUpdate={handleDataUpdate}
                          timeframe={currentTimeframe}
                        />
                      </div>
                    </div>
                  );
                }}
              </IndexGets>
            </div>
          </div>

          {/* Row 1: Yesterday's Result */}
          <div className='lg:col-span-1 flex flex-col min-h-[400px] lg:min-h-0 lg:overflow-hidden lg:h-full'>  
            {/* Yesterday's Result */}
            <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg text-white border border-white/10 w-full p-4 lg:p-6 h-full min-h-0 flex flex-col overflow-hidden">
              <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[24px] mb-3 lg:mb-4 text-center bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text font-semibold flex-shrink-0">
                Yesterdays Result
              </h2>
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <IndexGets>
                  {({ indexes }) => {
                    const firstIndex = Array.isArray(indexes) && indexes.length > 0 ? indexes[0] : null;
                    return (
                      <YesterdaysResult token={token} selectedIndexId={firstIndex ? firstIndex.id : null} />
                    );
                  }}
                </IndexGets>
              </div>
            </div>
          </div>

          {/* Row 2: Portfolio Chart */}
          <div className="lg:col-span-2 xl:col-span-3 min-h-[400px] lg:min-h-0 w-full lg:overflow-hidden">
            {token ? (
              <PortfolioChart 
                token={token} 
                timeframe={currentTimeframe}
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg">
                {/* Placeholder for unauthenticated users */}
              </div>
            )}
          </div>

          {/* Row 2: Leaderboard Preview */}
          <div className='lg:col-span-1 flex flex-col min-h-[400px] lg:min-h-0 lg:overflow-hidden lg:h-full'>
            <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] rounded-lg shadow-lg text-white border border-white/10 w-full p-4 lg:p-6 h-full min-h-0 overflow-hidden flex flex-col">
              <div className="mb-3 lg:mb-4 flex justify-center flex-shrink-0">
                <button 
                  className="group relative text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[24px] font-semibold text-white hover:text-blue-400 transition-all duration-200 cursor-pointer"
                  onClick={() => router.push('/leaderboard')}
                >
                  {/* Hover tooltip */}
                  <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 
                                  bg-gradient-to-r from-[#F596D3]/50 to-[#D247BF]/50 
                                  text-white text-[10px] sm:text-xs font-medium py-1 px-2 sm:px-3 rounded-full 
                                  shadow-lg opacity-0 group-hover:opacity-100 
                                  transition-all duration-200 whitespace-nowrap
                                  scale-90 group-hover:scale-100
                                  flex items-center">
                    Go to Leaderboard page
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                
                  <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] xl:text-[24px] text-transparent bg-clip-text bg-gradient-to-r from-[#F596D3] to-[#D247BF] font-semibold inline-block relative">
                    Leaderboard
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F596D3] to-[#D247BF] group-hover:w-full transition-all duration-200"></span>
                  </h2>
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <MiniLeaderboard token={token} />
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for mobile to add bottom padding */}
        <div className="h-4 lg:hidden flex-shrink-0"></div>
      </div>
    </div>
  );
}

