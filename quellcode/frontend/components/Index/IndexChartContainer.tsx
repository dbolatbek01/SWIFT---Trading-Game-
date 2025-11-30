'use client';

import IndexGets from '@/components/Index/IndexGets';
import IndexChart from '@/components/Index/IndexChart';

/**
 * Container component for IndexChart
 * Manages index selection and provides data fetching functionality to the chart
 * Uses the IndexGets wrapper to access index data and fetching methods
 * @component
 * @returns {JSX.Element} Rendered chart container with index selection dropdown
 */
export default function IndexChartContainer() {
  return (
    <IndexGets>
      {({ indexes, getIndexValues }) => {
        if (indexes.length === 0) {
          return (
            <div className="h-80 bg-gray-600 rounded text-white flex items-center justify-center">
              No indexes available
            </div>
          );
        }
        const firstIndex = indexes[0];
        return (
          <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38] p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
            {/* Container title */}
            <h2 className="text-[24px] mb-4 text-center text-white">Index Chart</h2>
            {/* Show Indexname */}
            <div className="mb-4 text-center text-lg text-white font-semibold">
              {firstIndex.shortname}
            </div>
            {/* Chart rendering */}
            <IndexChart indexId={firstIndex.id} getData={getIndexValues} />
          </div>
        );
      }}
    </IndexGets>
  );
}