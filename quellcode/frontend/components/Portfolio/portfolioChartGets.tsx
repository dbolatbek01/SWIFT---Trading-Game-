'use client';
import { PortfolioSnapshot, PortfolioTimeFrame } from '@/types/interfaces';

/**
 * Fetches total portfolio values (portfolio + bank) for a specific time frame from the API
 * @param token - Authentication token required for API access
 * @param timeFrame - The time period for which to fetch portfolio data (today, lastWeek, lastMonth)
 * @returns Promise<PortfolioSnapshot[]> - Array of portfolio snapshots sorted chronologically
 * @throws Error if token is missing, timeframe is invalid, or API request fails
 */
export const getPortfolioValues = async (token: string, timeFrame: PortfolioTimeFrame): Promise<PortfolioSnapshot[]> => {
  try {    
    if (!token) {
      throw new Error('Token is required but not provided');
    }
    let endpoint = '';
    
    switch (timeFrame) {
      case 'today':
        endpoint = `/api/homepage/portfolioChartDaily/${token}`;
        break;
      case 'lastWeek':
        endpoint = `/api/homepage/portfolioChartWeekly/${token}`;
        break;
      case 'lastMonth':
        endpoint = `/api/homepage/portfolioChartMonthly/${token}`;
        break;
      default:
        throw new Error(`Invalid timeframe: ${timeFrame}`);
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Debug - Error response:', errorText);
      throw new Error(`Failed to fetch total portfolio data: ${response.status} ${response.statusText}`);
    }

    const data: PortfolioSnapshot[] = await response.json();
        
    // Validate data structure
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received from API');
    }

    // Helper function: Adds +02:00 if no offset is present
    const fixOffset = (s: string) => s.match(/[Z\+\-]/) ? s : s + '+02:00';
    
    // Robust sorting by snapshotTime (oldest first for chronological display)
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(fixOffset(a.snapshotTime)).getTime();
      const dateB = new Date(fixOffset(b.snapshotTime)).getTime();
      return dateA - dateB; // Sort in ascending order (oldest first)
    });

    return sortedData;
    
  } catch (error) {
    console.error('Error in getPortfolioValues (total):', error);
    throw error;
  }
};

/**
 * Fetches portfolio values for multiple time frames in parallel for best performance.
 * @param token - Authentication token required for API access
 * @param timeFrames - Array of time frames to fetch (e.g. ['today', 'lastWeek', 'lastMonth'])
 * @returns Promise<Record<PortfolioTimeFrame, PortfolioSnapshot[]>> - Object mapping timeFrame to snapshots
 */
export async function getPortfolioValuesMultiple(token: string, timeFrames: PortfolioTimeFrame[]): Promise<Record<PortfolioTimeFrame, PortfolioSnapshot[]>> {
  const allFrames: PortfolioTimeFrame[] = ['today', 'lastWeek', 'lastMonth'];
  const results = await Promise.all(
    allFrames.map(tf => timeFrames.includes(tf) ? getPortfolioValues(token, tf) : Promise.resolve([]))
  );
  return {
    today: results[0],
    lastWeek: results[1],
    lastMonth: results[2]
  };
}