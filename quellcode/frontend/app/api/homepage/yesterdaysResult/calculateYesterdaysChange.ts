/**
 * Calculates yesterday's percentage change from an array of time-series data
 * @param data - Array of data points with value property
 * @returns Yesterday's percentage change or null if not enough data
 */
export function calculateYesterdaysPercentageChange<T extends { value: number }>(
  data: T[]
): number | null {
  // Need at least 2 data points
  if (!data || data.length < 2) {
    return null;
  }

  // Get the last two values (most recent is at the end)
  const currentValue = data[data.length - 1].value;
  const previousValue = data[data.length - 2].value;

  // Avoid division by zero
  if (previousValue === 0) {
    return null;
  }

  // Calculate percentage change
  const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
  
  return percentageChange;
}

/**
 * Calculates yesterday's percentage change for portfolio data
 * @param data - Array of portfolio snapshots
 * @returns Yesterday's percentage change or null if not enough data
 */
export function calculateYesterdaysPortfolioChange(
  data: Array<{ gesamtBetrag: number }>
): number | null {
  if (!data || data.length < 2) {
    return null;
  }

  const currentValue = data[data.length - 1].gesamtBetrag;
  const previousValue = data[data.length - 2].gesamtBetrag;

  if (previousValue === 0) {
    return null;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

/**
 * Calculates the difference between portfolio and index performance
 * @param portfolioChange - Portfolio percentage change
 * @param indexChange - Index percentage change
 * @returns The difference or null if either value is null
 */
export function calculatePerformanceDifference(
  portfolioChange: number | null,
  indexChange: number | null
): number | null {
  if (portfolioChange === null || indexChange === null) {
    return null;
  }
  
  return portfolioChange - indexChange;
}