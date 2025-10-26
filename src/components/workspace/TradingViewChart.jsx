import React, { useEffect, useRef } from 'react';

function TradingViewChart({ tvSymbol = 'FX:EURUSD', interval = 'D' }) {
  const container = useRef();

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => {
        new window.TradingView.widget(
          {
            "autosize": true,
            "symbol": tvSymbol,
            "interval": interval,
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "withdateranges": true,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "details": true,
            "hotlist": true,
            "calendar": true,
            "studies": [
              "STD;EMA",
              "STD;RSI"
            ],
            "container_id": "tradingview_chart_container"
          }
        );
      }
      container.current.appendChild(script);

      return () => {
        if (container.current && container.current.contains(script)) {
            container.current.removeChild(script);
        }
      };
    },
    [tvSymbol, interval]
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div id="tradingview_chart_container" style={{ height: "100%", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a>
      </div>
    </div>
  );
}

export default TradingViewChart;
