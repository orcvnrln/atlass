import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import MainTradingWorkspace from '@/components/workspace/MainTradingWorkspace';
import { getAssetMeta } from '@/data/navData';

const DEFAULT_SYMBOL = 'EURUSD';

const formatDisplay = (symbol) =>
  symbol.includes('/') ? symbol : `${symbol.slice(0, 3)}/${symbol.slice(3)}`;

const buildActiveAsset = (symbol) => {
  const meta = getAssetMeta(symbol);
  const displaySymbol = meta?.displaySymbol || formatDisplay(symbol);

  return {
    symbol,
    displaySymbol,
    tvSymbol: meta?.tvSymbol || `OANDA:${symbol}`,
    name: meta?.name || displaySymbol,
    category: meta?.category || 'Custom',
    currentPrice:
      meta?.samplePrice ||
      parseFloat((1 + Math.random() * 0.05).toFixed(symbol.length > 5 ? 2 : 4)),
  };
};

const InstitutionalWorkspace = ({ initialGroup = 'Major FX' }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [symbol, setSymbol] = useState(() => {
    const initialParam = searchParams.get('symbol');
    return initialParam ? initialParam.toUpperCase() : DEFAULT_SYMBOL;
  });

  useEffect(() => {
    const paramSymbol = searchParams.get('symbol');
    if (paramSymbol) {
      setSymbol(paramSymbol.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (location.state?.symbol) {
      setSymbol(String(location.state.symbol).toUpperCase());
    }
  }, [location.state]);

  const correlationContext = location.state?.context || null;

  const activeAsset = useMemo(() => buildActiveAsset(symbol), [symbol]);

  return <MainTradingWorkspace activeAsset={activeAsset} correlationContext={correlationContext} />;
};

export default InstitutionalWorkspace;
