import { PortfolioDataWithInvestedValue, PortfolioDataWithCurrentPrice } from '@/types/interfaces';

/**
 * Fetches portfolio data with invested values (average purchase prices) from the API
 * @param token - Authentication token required for API access
 * @returns Promise<PortfolioDataWithInvestedValue[]> - Array of portfolio items with invested values
 *         Returns empty array if token is missing or request fails
 */
export async function getPortfolioInvestedValues(token: string): Promise<PortfolioDataWithInvestedValue[]> {
  if (!token) {
    console.warn("No token provided");
    return [];
  }

  try {
    const response = await fetch(`/api/portfolio/averagePricePortfolio`);

    if (!response.ok) {
      console.warn('Fetch warning:', await response.text());
      return [];
    }
    const data = await response.json();
    // Ensure we always return an array even if single object is received
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

/**
 * Fetches portfolio data with current market values from the API
 * @param token - Authentication token required for API access
 * @returns Promise<PortfolioDataWithCurrentPrice[]> - Array of portfolio items with current prices
 *         Returns empty array if token is missing or request fails
 */
export async function getPortfolioCurrentValues(token: string): Promise<PortfolioDataWithCurrentPrice[]> {
  if (!token) {
    console.warn("No token provided");
    return [];
  }

  try {
    const response = await fetch(`/api/portfolio/currentPricePortfolio`);
    if (!response.ok) {
      console.warn('Fetch warning:', await response.text());
      return [];
    }
    const data = await response.json();
    // Ensure we always return an array even if single object is received
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

/**
 * Fetches both invested and current portfolio values in parallel for best performance.
 * @param token - Authentication token required for API access
 * @returns Promise<{ invested: PortfolioDataWithInvestedValue[], current: PortfolioDataWithCurrentPrice[] }>
 *          Returns empty arrays if token is missing or request fails
 */
export async function getPortfolioAllValues(token: string): Promise<{
  invested: PortfolioDataWithInvestedValue[];
  current: PortfolioDataWithCurrentPrice[];
}> {
  const [invested, current] = await Promise.all([
    getPortfolioInvestedValues(token),
    getPortfolioCurrentValues(token)
  ]);
  return { invested, current };
}