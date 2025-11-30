import yfinance as yf
import json
from datetime import datetime, timedelta
import warnings
import sys

# ignore warnings (came always)
warnings.filterwarnings('ignore')

# Function that gets shortname and gives old prices of it back
def fetch_old_stock_prices(ticker):
    stock_data = {
        "shortname": ticker,
        "minute": [],
        "day": []
    }

    today = datetime.today()
    # 9 before date (7 days plus 2 days weekend = 7 days yFinance)
    nine_days_ago = today - timedelta(days=9)

    # minutely prices of the last 7 days
    try:
        intraday_data = yf.download(tickers=ticker, period="7d", interval="1m", progress=False)
        
        for timestamp, row in intraday_data.iterrows():
            if timestamp.tz_convert("Europe/Berlin").date() > nine_days_ago.date():
                stock_data["minute"].append({
                    "timestamp": timestamp.tz_convert("Europe/Berlin").strftime('%Y-%m-%d %H:%M:%S'),
                    "price": float(row["Close"])
                })
    except Exception as e:
        stock_data["minute"].append({
                "error": str(e)
            })

    # last price (one for each day) from day 8 up to 3 months
    try:
        daily_data = yf.download(tickers=ticker, period="3mo", interval="1d", progress=False)

        for date, row in daily_data.iterrows():
            if date < nine_days_ago:
                stock_data["day"].append({
                    "date": date.strftime('%Y-%m-%d'),
                    "price": float(row["Close"])
                })
    except Exception as e:
        stock_data["day"].append({
                "error": str(e)
            })
        
    # return results as json
    return json.dumps(stock_data)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ticker = sys.argv[1]
        print(json.dumps(fetch_old_stock_prices(ticker)))
    else:
        print("No Ticker given!.")