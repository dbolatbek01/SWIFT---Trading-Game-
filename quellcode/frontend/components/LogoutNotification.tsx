'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

/**
 * LogoutNotification Component
 * 
 * Shows a countdown notification before automatic logout at midnight.
 * Displays warning at 23:55 (5 minutes before logout).
 */
export default function LogoutNotification() {
  const { data: session, status } = useSession();
  const [showNotification, setShowNotification] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(0);

  useEffect(() => {
    if (status !== 'authenticated' || !session) {
      return;
    }

    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      // Show notification from 23:55 to 23:59 (5 minutes before 24:00)
      if (currentHour === 23 && currentMinute >= 55 && currentMinute <= 59) {
        const minutesUntilLogout = 60 - currentMinute;
        setMinutesLeft(minutesUntilLogout);
        setShowNotification(true);
      } else {
        setShowNotification(false);
      }
    };

    // Check immediately
    checkTime();
    
    // Check every minute
    const interval = setInterval(checkTime, 60000);
    
    return () => clearInterval(interval);
  }, [session, status]);

  if (!showNotification) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg shadow-lg border border-blue-300 max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="text-lg">⚠️</div>
          <div>
            <div className="font-semibold text-xs">Auto Logout</div>
            <div className="text-xs opacity-90">
              {minutesLeft}min left (24:00)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
