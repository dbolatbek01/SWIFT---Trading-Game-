'use client';
import TopNavbar from '@/app/navigation/Navbar';
import StockGets from '@/components/stocks/StockGets';
import StockViewContent from '@/components/stocks/StockViewContent';
import ScrollToTop from '@/components/ScrollToTop';

/**
 * StockView component.
 * @description A component that displays a stock's details page.
 * @returns {JSX.Element} The JSX element representing the stock details page.
 * @example
 * <StockView />
 */
export default function StockView() {
  return (
    <div className="bg-gradient-to-b from-[#1e1f26] to-[#2a2c38]">
      <div className="container mx-auto sticky top-0 z-100">
        <TopNavbar />
      </div>
      <div className="container mx-auto px-4">
        <main className="p-10">
          {/* StockGets component to fetch and display stock data */}
          <StockGets>
            {({ stocks, getStockPrice }) => (
              <StockViewContent stocks={stocks} getStockPrice={getStockPrice} />
            )}
          </StockGets>
        </main>
      </div>
      <ScrollToTop />
    </div>
  );
}