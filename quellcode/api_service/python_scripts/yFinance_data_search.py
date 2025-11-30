import sys
import yfinance as yf
import json

# Function to call current Stock and Index Prices from shortnames
def fetch_multiple_stock_prices(tickers):
    stock_data = []

    # call of yFinance api 
    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)
            # current stock price 
            current_price = stock.history(period="1d")['Close'].iloc[0]  
            stock_data.append({"shortname":ticker, "current_price": current_price})
        except Exception as e:
            stock_data.append({"shortname":ticker, "error": str(e)})
 
    # return results as json
    return json.dumps(stock_data, indent=4)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        tickers_arg = sys.argv[1]
        tickers = tickers_arg.split(',')
        print(json.dumps(fetch_multiple_stock_prices(tickers), indent=4))
    else: 
        print("No Tickers given!.")
