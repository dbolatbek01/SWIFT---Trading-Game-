'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * useTokenSync
 * Custom React hook to synchronize the user's authentication token with the backend.
 * - When the user is authenticated and the token is available, a POST request is sent to the backend endpoint `/api/auth/verify-token`.
 * - The hook sets a flag (`isTokenSynced`) to true if the backend confirms successful synchronization.
 * - Ensures the token is only synced once per session unless the session changes.
 * 
 * @returns { isTokenSynced } - Boolean indicating if the token has been successfully synced.
 */
export function useTokenSync() {
  const { data: session, status } = useSession();
  const [isTokenSynced, setIsTokenSynced] = useState(false);

  useEffect(() => {
    async function syncTokenWithBackend() {
      if (status === 'authenticated' && session?.accessToken && !isTokenSynced) {
        try {
          const response = await fetch('/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            console.log('Token successfully synced with backend');
            setIsTokenSynced(true);
          } else {
            console.error('Failed to sync token with backend');
          }
        } catch (error) {
          console.error('Error syncing token:', error);
        }
      }
    }

    syncTokenWithBackend();
  }, [session, status, isTokenSynced]);

  return { isTokenSynced };
}