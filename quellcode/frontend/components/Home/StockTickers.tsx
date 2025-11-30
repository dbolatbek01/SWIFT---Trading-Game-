'use client';

import React, { useEffect } from 'react';

/**
 * StockTickers component renders a section with a dynamic stock ticker.
 * It loads the Trading View script dynamically to avoid blocking the initial render
 * and to ensure it runs only on the client side.
 * The component also cleans up after itself by removing the script on unmount.
 * The component uses the Trading View Embed Widget: Ticker Tape.
 * https://www.tradingview.com/widget-docs/widgets/tickers/ticker-tape/ 
 *
 * The component accepts no props.
 *
 * @returns A JSX element rendering a section with a dynamic stock ticker.
 */
export default function StockTickers() {
  useEffect(() => {
    // Load script dynamically to avoid blocking the initial render and to ensure 
    // it runs only on the client side
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
        { description: 'AMZN', proName: 'NASDAQ:AMZN' },
        { description: 'MSFT', proName: 'NASDAQ:MSFT' },
        { description: 'AAPL', proName: 'NASDAQ:AAPL' },
        { description: 'NVDA', proName: 'NASDAQ:NVDA' },
        { description: 'NDX', proName: 'NASDAQ:NDX' },
        { description: 'TSLA', proName: 'NASDAQ:TSLA' },
        { description: 'AMD', proName: 'NASDAQ:AMD' },
        { description: 'META', proName: 'NASDAQ:META' },
        { description: 'GOOG', proName: 'NASDAQ:GOOG' },
        { description: 'NFLX', proName: 'NASDAQ:NFLX' },
        { description: 'MSTR', proName: 'NASDAQ:MSTR' },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    });

    const container = document.querySelector('.tradingview-widget-container');
    if (container) {
      container.appendChild(script);
    }

    // Cleanup: remove the script when the component unmounts
    // This prevents memory leaks and ensures the script is not loaded multiple times
    // if the component is re-mounted.
    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <section id="ticker" className="py-6 bg-gray-800">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-400 mb-4 text-sm uppercase tracking-wider">
          Market Snapshot
        </p>
        <div className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
          <div className="tradingview-widget-copyright text-center text-gray-500 text-xs mt-2">
            <a
              href="search"
              rel="noopener nofollow"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Click here to see all stocks
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}