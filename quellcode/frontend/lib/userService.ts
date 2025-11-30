/**
 * User Service
 * 
 * Provides functions to interact with user-related API endpoints
 */

/**
 * Fetches Google user information from the backend
 * 
 * @returns User information from Google
 * @throws Error if the request fails
 */
export async function fetchGoogleUserInfo() {
  try {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user information');
    }

    const userData = await response.json();
    return userData;
    
  } catch (error) {
    console.error('Error in fetchGoogleUserInfo:', error);
    throw error;
  }
}

/**
 * Hook to fetch user info with error handling
 * Can be used in React components
 */
export async function useUserInfo() {
  try {
    const userInfo = await fetchGoogleUserInfo();
    return { data: userInfo, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
