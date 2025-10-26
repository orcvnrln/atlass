import React, { createContext, useState, useContext } from 'react';

const WorkspaceContext = createContext();

export const useWorkspace = () => useContext(WorkspaceContext);

const initialPanelAssets = {
  a: 'EUR/USD',
  b: 'BTC/USD',
  c: null,
  d: null,
};

export const WorkspaceProvider = ({ children }) => {
  const [layoutId, setLayoutId] = useState('2x2');
  const [panelAssets, setPanelAssets] = useState(initialPanelAssets);
  const [visibleLogicalRange, setVisibleLogicalRange] = useState(null);


  const handleAssetChange = (panelId, asset) => {
    setPanelAssets(prev => ({
      ...prev,
      [panelId]: asset,
    }));
  };

  const resetLayout = () => {
    setLayoutId('2x2');
    setPanelAssets(initialPanelAssets);
  };

  const value = {
    layoutId,
    setLayoutId,
    panelAssets,
    handleAssetChange,
    visibleLogicalRange,
    setVisibleLogicalRange,
    resetLayout,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
