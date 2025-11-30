import { CurrentWorthBankaccount, AllTransactions } from '@/types/interfaces'; // Import TypeScript interfaces for data types

/**
 * Fetches the current bank account worth (cash balance) for a user.
 *
 * @param token - A string representing the user's authentication token.
 * @returns A Promise that resolves to an array of CurrentWorthBankaccount objects.
 */
export async function getCurrentWorthBankaccount(token: string): Promise<CurrentWorthBankaccount[]> {
  // Warn and return empty array if no token is provided
  if (!token) {
    console.warn("No token provided");
    return [];
  }

  try {
    // Make an API call to the cash balance endpoint
    const response = await fetch(`/api/cashpage/cashBalance`);

    // If response is not OK, log the warning and return empty array
    if (!response.ok) {
      console.warn('Fetch warning:', await response.text());
      return [];
    }

    // Parse JSON response
    const data = await response.json();

    // Return data as an array
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    // Handle any fetch or parsing errors
    console.error('Fetch error:', error);
    return [];
  }
}

/**
 * Fetches the list of all cash transactions for a user.
 *
 * @param token - A string representing the user's authentication token.
 * @returns A Promise that resolves to an array of AllTransactions objects.
 */
export async function getAllTransactions(token: string): Promise<AllTransactions[]> {
  // Warn and return empty array if no token is provided
  if (!token) {
    console.warn("No token provided");
    return [];
  }

  try {
    // Make an API call to the transaction list endpoint
    const response = await fetch(`/api/cashpage/transactionList`);

    // If response is not OK, log the warning and return empty array
    if (!response.ok) {
      console.warn('Fetch warning:', await response.text());
      return [];
    }

    // Parse JSON response
    const data = await response.json();

    // Return data as an array
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    // Handle any fetch or parsing errors
    console.error('Fetch error:', error);
    return [];
  }
}

/**
 * Fetches both current bank account worth and all transactions in parallel for best performance.
 * @param token - Authentication token required for API access
 * @returns Promise<{ worth: CurrentWorthBankaccount[], transactions: AllTransactions[] }>
 *          Returns empty arrays if token is missing or request fails
 */
export async function getCashPageData(token: string): Promise<{
  worth: CurrentWorthBankaccount[];
  transactions: AllTransactions[];
}> {
  const [worth, transactions] = await Promise.all([
    getCurrentWorthBankaccount(token),
    getAllTransactions(token)
  ]);
  return { worth, transactions };
}
