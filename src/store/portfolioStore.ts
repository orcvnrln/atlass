import create from 'zustand';

interface Asset {
  name: string;
  current: number;
  target: number;
  color: string;
}

interface PortfolioState {
  assets: Asset[];
  totalValue: number;
  setTarget: (assetName: string, newTarget: number) => void;
  resetTargets: () => void;
}

const initialAssets: Asset[] = [
  { name: 'Stocks', current: 35.4, target: 40, color: '#4C6EF5' },
  { name: 'Crypto', current: 29.9, target: 25, color: '#F59E0B' },
  { name: 'Forex', current: 19.7, target: 20, color: '#10B981' },
  { name: 'Commodities', current: 9.4, target: 10, color: '#8B5CF6' },
  { name: 'Bonds', current: 5.5, target: 5, color: '#6B7280' },
];

export const usePortfolioStore = create<PortfolioState>((set) => ({
  assets: initialAssets,
  totalValue: 127450.32,
  setTarget: (assetName, newTarget) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.name === assetName ? { ...asset, target: newTarget } : asset
      ),
    })),
  resetTargets: () => set({ assets: initialAssets }),
}));
