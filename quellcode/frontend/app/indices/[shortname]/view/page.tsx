'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import TopNavbar from '@/app/navigation/Navbar';
import IndexGets from '@/components/Index/IndexGets';
import { IndexInfo } from '@/types/interfaces';
import IndexChart from '@/components/Index/IndexChart';
import IndexValueDisplay from '@/components/Index/IndexValueDisplay';
import IndexHeader from '@/components/Index/IndexHeader';

/**
 * Main page component for displaying individual index details
 * Simplified design matching stock pages with automatic timeframe selection
 */
export default function IndexViewPage() {
  // Extract and decode shortname from URL
  const params = useParams();
  const shortname = params.shortname as string;
  const decodedShortname = useMemo(() => decodeURIComponent(shortname), [shortname]);
  
  // State management
  const [indexData, setIndexData] = useState<IndexInfo | null>(null);
  const [currentValue, setCurrentValue] = useState<string>('0.00');
  const [priceChange, setPriceChange] = useState<{ percentage: number; absolute: number }>({
    percentage: 0,
    absolute: 0
  });

  /**
   * Callback for handling value updates from chart
   */
  const handleValueUpdate = (value: string, change?: { percentage: number; absolute: number }) => {
    setCurrentValue(value || '0.00');
    if (change) {
      setPriceChange(change);
    }
  };

  return (
    <div className="h-[95vh] max-h-screen overflow-hidden bg-gradient-to-b from-[#1e1f26] to-[#2a2c38]">
      <div className="container mx-auto sticky top-0 z-100">
        <TopNavbar />
      </div>
      <div className="container mx-auto px-4 h-[calc(95vh-80px)] flex flex-col">
        <main className="p-4 md:p-6 flex-1 flex flex-col overflow-hidden">
          <IndexGets decodedShortname={decodedShortname} onIndexFound={setIndexData}>
            {({ getIndexValues, loading, error }) => {

              // Loading state
              if (loading) {
                return (
                  <div className="flex items-center justify-center flex-1">
                    <div className="text-white text-lg">Loading...</div>
                  </div>
                );
              }

              // Error state
              if (error || !indexData) {
                return (
                  <div className="flex items-center justify-center flex-1">
                    <div className="text-red-400 text-lg">
                      {error || 'Index not found'}
                    </div>
                  </div>
                );
              }

              // Main content
              return (
                <div className="flex flex-col gap-4 h-full">
                  {/* Header with index name and shortname */}
                  <div className="flex-shrink-0">
                    <IndexHeader index={indexData} />
                  </div>

                  {/* Current value and change display */}
                  <div className="flex-shrink-0 rounded-lg p-3 md:p-4">
                    <IndexValueDisplay 
                      value={currentValue}
                      change={priceChange.percentage !== 0 ? priceChange : undefined}
                      showLabel={false}
                    />
                  </div>

                  {/* Chart with automatic timeframe selection */}
                  <div className="bg-[#2a2c38] flex-1 rounded-lg p-3 md:p-4">
                    <div className="h-full">
                      <IndexChart 
                        indexId={indexData.id} 
                        getData={getIndexValues}
                        onValueUpdate={handleValueUpdate}
                      />
                    </div>
                  </div>
                </div>
              );
            }}
          </IndexGets>
        </main>
      </div>
    </div>
  );
}