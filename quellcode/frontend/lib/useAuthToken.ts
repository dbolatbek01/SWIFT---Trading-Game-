'use client';
import { useSession } from "next-auth/react";

/**
 * useAuthToken
 * Custom React hook to retrieve the user's authentication token from the session.
 * - Returns the token if available.
 * - Redirects to the login page if not authenticated.
 * - Returns an empty string while loading or if not authenticated.
 */
export function useAuthToken(): string {
  const { data: session, status } = useSession();

  // Return empty string while authentication status is loading
  if (status === 'loading') {
    return '';
  }

  // If there's a refresh token error, force re-authentication
  if (session?.error === "RefreshAccessTokenError") {
    if (typeof window !== 'undefined') {
      console.error("Token refresh failed, redirecting to login");
      window.location.href = '/login';
    }
    return '';
  }

  // If the session is missing or has no accessToken, redirect to login (for dev/failure cases)
  if (!session?.accessToken) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return '';
  }

  // Return the user's access token
  return session.accessToken;
}