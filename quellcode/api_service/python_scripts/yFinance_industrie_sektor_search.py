import yfinance as yf

tickers = [
    'AAPL', 'ABBV', 'ABT', 'ACN', 'ADBE', 'AIG', 'AMD', 'AMGN', 'AMT', 'AMZN',
    'AVGO', 'AXP', 'BA', 'BAC', 'BK', 'BKNG', 'BLK', 'BMY', 'BRK-B', 'C', 'CAT', 
    'CL', 'CMCSA', 'COF', 'COP', 'COST', 'CRM', 'CSCO', 'CVS', 'CVX', 'DE', 'DHR', 
    'DIS', 'DUK', 'EMR', 'FDX', 'GD', 'GE', 'GILD', 'GM', 'GOOG', 'GOOGL', 'GS', 
    'HD', 'HON', 'IBM', 'INTC', 'INTU', 'ISRG', 'JNJ', 'JPM', 'KO', 'LIN', 'LLY', 
    'LMT', 'LOW', 'MA', 'MCD', 'MDLZ', 'MDT', 'MET', 'META', 'MMM', 'MO', 'MRK', 
    'MS', 'MSFT', 'NEE', 'NFLX', 'NKE', 'NOW', 'NVDA', 'ORCL', 'PEP', 'PFE', 'PG', 
    'PLTR', 'PM', 'PYPL', 'QCOM', 'RTX', 'SBUX', 'SCHW', 'SO', 'SPG', 'T', 'TGT', 
    'TMO', 'TMUS', 'TSLA', 'TXN', 'UBER', 'UNH', 'UNP', 'UPS', 'USB', 'V', 'VZ', 
    'WFC', 'WMT', 'XOM', '^SP100'
]

# remove Index shortname (not needed for industrie and sector)
tickers.remove('^SP100')

# Function to call current industrie and sector of Stock from shortname
def fetch_multiple_stock_prices(tickers):
    stock_information = []

    # call of yFinance api 
    for ticker in tickers:
        try: 
            stock = yf.Ticker(ticker)
            info = stock.info
            sector = info.get("sector", "N/A")
            industry = info.get("industry", "N/A")
            stock_information.append(
                f"UPDATE public.stock SET sector='" + sector + "', industry='" + industry + "' WHERE shortname='" + ticker + "';\n"
            )
        except Exception as e:
            stock_information.append({
                "ticker": ticker,
                "error": str(e)
            })

    # return results as json
    return stock_information

print("".join(fetch_multiple_stock_prices(tickers)))