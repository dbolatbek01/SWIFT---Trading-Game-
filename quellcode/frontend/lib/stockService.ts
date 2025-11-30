/**
 * Server-side stock loading service
 * Used by NextAuth events to load stocks after sign-in
 */

/**
 * Load stocks data and save to public/stocks.json
 * @param accessToken - User's access token
 * @returns Promise<boolean> - Success status
 */
export async function loadStocksOnSignIn(accessToken: string): Promise<boolean> {
  try {
    console.log('Loading stocks after sign-in...');
    
    // Import config and required modules dynamically (server-side only)
    const { BACKEND_BASE_URL } = await import('@/config');
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Fetch stocks from backend
    const response = await fetch(`${BACKEND_BASE_URL}/loadStocks/${accessToken}`);
    
    if (!response.ok) {
      console.error('Backend error while loading stocks:', response.status);
      return false;
    }
    
    // Parse response
    const stocksData = await response.json();
    
    // Save to public/stocks.json
    const filePath = path.join(process.cwd(), 'public', 'stocks.json');
    await fs.writeFile(filePath, JSON.stringify(stocksData, null, 2));
    
    console.log('Stocks loaded and saved successfully after sign-in');
    return true;
    
  } catch (error) {
    console.error('Error loading stocks after sign-in:', error);
    return false;
  }
}
