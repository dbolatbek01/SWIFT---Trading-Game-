'use client';
import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';

interface AutoLogoutOptions {
  /** Hour to logout (0-23), default: 0 (midnight) */
  logoutHour?: number;
  /** Minute to logout (0-59), default: 0 */
  logoutMinute?: number;
  /** Show console logs, default: true */
  enableLogging?: boolean;
  /** Redirect URL after logout, default: '/login' */
  redirectUrl?: string;
}

/**
 * useAutoLogout Hook
 * 
 * Automatically logs out the user at a specified time (default: midnight)
 * - Calculates time until next logout time
 * - Sets timeout to trigger logout
 * - Cleans up timeout on component unmount
 * - Only works for authenticated users
 * 
 * @param options Configuration options for auto-logout
 */
export function useAutoLogout(options: AutoLogoutOptions = {}) {
  // Destructure with consistent defaults to avoid dependency array issues
  const logoutHour = options.logoutHour ?? 0;
  const logoutMinute = options.logoutMinute ?? 0;
  const enableLogging = options.enableLogging ?? true;
  const redirectUrl = options.redirectUrl ?? '/login';
  
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only set auto-logout for authenticated users
    if (status !== 'authenticated' || !session) {
      return;
    }

    const scheduleLogout = () => {
      const now = new Date();
      const logoutTime = new Date();
      
      // Set to specified time today
      logoutTime.setHours(logoutHour, logoutMinute, 0, 0);
      
      // If the time has already passed today, schedule for tomorrow
      if (logoutTime <= now) {
        logoutTime.setDate(logoutTime.getDate() + 1);
      }
      
      // Calculate milliseconds until logout time
      const msUntilLogout = logoutTime.getTime() - now.getTime();
      
      if (enableLogging) {
        console.log(`Auto-logout scheduled for: ${logoutTime.toLocaleString()}`);
        console.log(`Time until logout: ${Math.round(msUntilLogout / 1000 / 60)} minutes`);
      }
      
      // Set timeout for logout
      const timeoutId = setTimeout(() => {
        if (enableLogging) {
          console.log(`${String(logoutHour).padStart(2, '0')}:${String(logoutMinute).padStart(2, '0')} reached - Auto logout triggered`);
        }
        signOut({ 
          callbackUrl: redirectUrl,
          redirect: true 
        });
      }, msUntilLogout);
      
      return timeoutId;
    };

    const timeoutId = scheduleLogout();

    // Cleanup timeout on unmount or session change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        if (enableLogging) {
          console.log('Auto-logout timeout cleared');
        }
      }
    };
  }, [session, status, logoutHour, logoutMinute, enableLogging, redirectUrl]);
}
