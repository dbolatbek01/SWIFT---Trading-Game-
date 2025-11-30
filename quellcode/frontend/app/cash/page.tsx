'use client'; // This directive indicates that this file is a Client Component in Next.js 13+.

// Import the top navigation bar component.
import TopNavbar from '@/app/navigation/Navbar';
// Import the transaction list component for the cash page.
import TransactionList from '@/components/CashPage/TransactionList';
// Import the new cash visualization component.
import CashVisualization from '@/components/CashPage/CashVisualization';
// Import a component that allows users to scroll back to the top of the page.
import ScrollToTop from '@/components/ScrollToTop';
// Import a custom hook to retrieve the user's authentication token.
import { useAuthToken } from '@/lib/useAuthToken';

/**
 * CashPage Component
 * Main page for the "Cash" section.
 * Displays a top navigation bar, a list of cash transactions, a cash balance summary,
 * and a scroll-to-top button. Retrieves the user's authentication token via a custom hook.
 */
export default function CashPage() {
  // Get the authentication token using the custom hook.
  const token = useAuthToken(); 

  // Return the rendered JSX for the page.
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1f26] to-[#2a2c38]">
      {/* Sticky top navigation bar */}
      <div className="sticky top-0 z-50">
        <div className="container mx-auto">
          <TopNavbar />
        </div>
      </div>
      
      {/* Main content container - Split Screen Layout */}
      <div className="container mx-auto px-25">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10 h-[calc(100vh-8rem)]">
          {/* Left Side: Transaction List */}
          <div className="flex flex-col overflow-hidden" id="transaction-list">
            <TransactionList token={token} />
          </div>

          {/* Right Side: Cash Visualization Dashboard */}
          <div className="flex flex-col overflow-y-auto">
            <CashVisualization token={token} />
          </div>
        </div>
      </div>

      {/* Scroll-to-top button component */}
      <ScrollToTop />
    </div>
  );
}