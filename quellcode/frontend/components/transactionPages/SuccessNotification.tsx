import { useEffect } from 'react';

type SuccessNotificationProps = {
  message: string;            // Message to display in the notification
  onClose: () => void;        // Callback to close the notification
  show: boolean;              // Whether the notification is visible
  type: 'buy' | 'sell';       // Type of transaction ("buy" or "sell") to customize title
};

/**
 * SuccessNotification Component
 * ----------------------------
 * Displays a temporary success notification for completed buy or sell actions.
 * - Automatically closes after 5 seconds.
 * - Can be closed manually via the close ("X") button.
 * - Shows a checkmark icon, transaction type, and a custom message.
 *
 * Props:
 * - message: string - The message to be shown in the notification body.
 * - onClose: function - Function to execute when notification should close.
 * - show: boolean - If true, the notification is shown.
 * - type: 'buy' | 'sell' - Determines if notification says "Purchase Successful!" or "Sale Successful!".
 */
export default function SuccessNotification({ 
  message, 
  onClose, 
  show, 
  type 
}: SuccessNotificationProps) {
  // Effect to automatically close the notification after 5 seconds when shown
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  // If not visible, render nothing
  if (!show) return null;

  const bgColor = 'bg-green-500/70';

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-100">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-4 animate-fade-in max-w-md`}>
        {/* Checkmark icon */}
        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <div className="flex-1">
          {/* Title based on transaction type */}
          <p className="font-semibold">{type === 'buy' ? 'Purchase' : 'Sale'} Successful!</p>
          <p className="text-sm">{message}</p>
        </div>
        {/* Manual close ("X") button */}
        <button 
          onClick={onClose} 
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close notification"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}