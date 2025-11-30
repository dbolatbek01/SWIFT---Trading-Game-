/**
 * Represents basic stock information
 */
export interface Stock {
  id: number;             // Unique identifier for the stock
  stockname: string;      // Full name of the stock
  shortname: string;      // Ticker symbol
  industry: string;       // Industry classification
  sector: string;         // Business sector
}

/**
* Represents transaction data for buying/selling stocks
*/
export interface TransactionData {
  id_stock: number;       // Stock involved in transaction
  count: number;          // Number of shares transacted
}

/**
* Represents portfolio data including invested value
*/
export interface PortfolioDataWithInvestedValue {
  token: string;          // User authentication token
  idStock: number;        // Stock identifier
  count: number;          // Number of shares held
  value: number;          // Total invested value
}

/**
* Represents portfolio data with current market price
*/
export interface PortfolioDataWithCurrentPrice {
  token: string;          // User authentication token
  idStock: number;        // Stock identifier
  latestPrice: number;    // Current market price
  count: number;          // Number of shares held
}

/**
* Represents current bank account worth
*/
export interface CurrentWorthBankaccount {
  token: string;          // User authentication token
  currentWorth: number;   // Current account balance
}

/**
* Represents complete transaction history
*/
export interface AllTransactions {
  token: string;          // User authentication token
  idStock: number | null; // Stock identifier (null for cash transactions)
  value: number;          // Transaction amount
  date: string;           // Transaction date
  stockName: string;      // Name of stock involved
  bs: string | null;      // Transaction type (Buy/Sell) or null
}

/**
* Represents raw transaction data from API
*/
export interface RawTransaction {
  idStock?: number;       // Optional stock identifier
  id_stock?: number;      // Alternative stock identifier field
  value: string | number; // Transaction value (string or number)
  count: string | number; // Share count (string or number)
  date: string;           // Transaction date
  bs?: string;            // Optional transaction type (Buy/Sell)
}

/**
* Represents data for portfolio charts
*/
export interface PortfolioChartData {
  token: string;          // User authentication token
  idStock: number;        // Stock identifier
  count: number;          // Number of shares held
  value: number;          // Current value of holding
}

/**
* Represents a stock holding with financial details
*/
export interface Holding {
  stock: Stock;               // Stock information
  investedAmount: number;     // Original invested amount
  currentValue: number;       // Current market value
}

/**
* Represents stock market index information
*/
export interface IndexInfo {
  id: number;             // Unique identifier for the index
  indexname: string;      // Full name of the index
  shortname: string;      // Ticker symbol of the index
}

/**
* Represents index value at a specific date
*/
export interface IndexValue {
  idIndex: number;        // Reference to the index
  value: number;          // Index value
  date: string;           // Date of the value record
}

/**
* Represents portfolio value snapshot over time
*/
export interface PortfolioSnapshot {
  snapshotTime: string;   // Timestamp of the snapshot
  gesamtBetrag: number;   // Total portfolio value
}

/**
* Represents complete portfolio performance data
*/
export interface PortfolioData {
  snapshots: PortfolioSnapshot[];  // Historical value snapshots
  currentValue?: number;          // Optional current portfolio value
  percentageChange?: number;      // Optional percentage change
  lastUpdate?: string;            // Optional last update timestamp
}

/**
* Represents portfolio Timeframes
*/
export type PortfolioTimeFrame = 'today' | 'lastWeek' | 'lastMonth';

/**
* Represents API response for stock price chart
*/
export interface StockApiResponseItem {
  price: number;
  stockPriceTime: string;
  idStockPrice?: number | null;
}

/**
* Represents API response for index price chart
*/
export interface IndexApiResponseItem {
  price: number;
  indexPriceTime: string;
}

/**
* Represents Google token response data
*/
export interface GoogleTokenResponse {
  access_token: string;      // Access token for Google API
  expires_in: number;       // Token expiration time in seconds
  refresh_token?: string;   // Optional refresh token
  scope?: string;           // Optional scope of the access
  token_type?: string;      // Optional type of the token
  id_token?: string;        // Optional ID token
  error?: string;           // Optional error code
  error_description?: string; // Optional error description
}

/**
 * Google User Info from Backend
 * This is the structure returned by the /api/user endpoint
 */
export interface GoogleUserInfo {
  id?: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  username?: string;
}

/**
 * Represents an achievement/title from /api/achievements/all
 */
export interface Achievement {
  id: number;
  name: string;
  threshold: number;
  titel: string;
  description: string;
}

/**
 * Represents an achieved achievement from /api/achievements/achieved
 */
export interface AchievedAchievement {
  id: number;
  idAchievement: number;
  idUser: string;
  progress: number;
  reached: boolean;
  selected_achievement?: null;
  selected_title?: null;
}

/**
 * Represents the selected title response from /api/achievements/title
 */
export interface SelectedTitleResponse {
  idUser: string;
  idAchievement: number;
  titel: string;
  reached: boolean;
  selectedTitel: number;
}