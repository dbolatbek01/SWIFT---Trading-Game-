'use client';
import { useAutoLogout } from '@/lib/useAutoLogout';
import { ReactNode } from 'react';
import LogoutNotification from './LogoutNotification';

/**
 * AutoLogoutProvider Component
 * 
 * Wrapper component that provides automatic logout functionality.
 * Must be used as a Client Component to access browser APIs.
 */
export default function AutoLogoutProvider({ children }: { children: ReactNode }) {
  useAutoLogout({
    logoutHour: 0,
    logoutMinute: 0,
    enableLogging: true,
    redirectUrl: '/login'
  });
  
  return (
    <>
      <LogoutNotification />
      {children}
    </>
  );
}
