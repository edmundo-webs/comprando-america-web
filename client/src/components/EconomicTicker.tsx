import { useEffect, useRef } from "react";

export function EconomicTicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent multiple injections in dev mode
    if (!containerRef.current || containerRef.current.querySelector('script')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          {
            "proName": "FX_IDC:USDMXN",
            "title": "USD/MXN"
          },
          {
            "proName": "FX_IDC:EURMXN",
            "title": "EUR/MXN"
          },
          {
            "description": "S&P 500",
            "proName": "OANDA:SPX500USD"
          },
          {
            "description": "NASDAQ 100",
            "proName": "OANDA:NAS100USD"
          },
          {
            "description": "Bolsa Mexicana (IPC)",
            "proName": "BMV:ME"
          },
          {
            "description": "Tasa Fed (EE.UU.)",
            "proName": "ECONOMICS:USINTR"
          },
          {
            "description": "Inflación EE.UU.",
            "proName": "ECONOMICS:USIRYY"
          },
          {
            "description": "Inflación México",
            "proName": "ECONOMICS:MXIRYY"
          },
          {
            "description": "Bitcoin",
            "proName": "BINANCE:BTCUSDT"
          }
        ],
        "showSymbolLogo": true,
        "isTransparent": true,
        "displayMode": "adaptive",
        "colorTheme": "dark",
        "locale": "es"
      }
    `;

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="fixed top-20 left-0 w-full z-40 border-b border-[#1E3A5F] bg-[#0B1F3A]">
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}
