import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import InstitutionalDashboard from '../components/dashboard/InstitutionalDashboard';
import chartSlice from '../store/slices/chartSlice';
import signalSlice from '../store/slices/signalSlice';
import portfolioSlice from '../store/slices/portfolioSlice';
import uiSlice from '../store/slices/uiSlice';
import orderFlowSlice from '../store/slices/orderFlowSlice';
import smartMoneySlice from '../store/slices/smartMoneySlice';
import backtestSlice from '../store/slices/backtestSlice';
import correlationSlice from '../store/slices/correlationSlice';
import newsSlice from '../store/slices/newsSlice';

// Mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      chart: chartSlice,
      signal: signalSlice,
      portfolio: portfolioSlice,
      ui: uiSlice,
      orderFlow: orderFlowSlice,
      smartMoney: smartMoneySlice,
      backtest: backtestSlice,
      correlation: correlationSlice,
      news: newsSlice,
    },
  });
};

// Mock WebSocket
const mockWebSocket = {
  close: jest.fn(),
  send: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: WebSocket.OPEN,
};

// Mock global WebSocket
Object.defineProperty(window, 'WebSocket', {
  writable: true,
  value: jest.fn(() => mockWebSocket),
});

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

// Mock IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

const renderWithProviders = (component: React.ReactElement, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('InstitutionalDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard components', () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    // Check for main dashboard elements
    expect(screen.getByText('Institutional Trading Dashboard')).toBeInTheDocument();
    expect(screen.getByText('BTC-USD')).toBeInTheDocument();
    expect(screen.getByText('1h')).toBeInTheDocument();
  });

  test('displays signal panel with mock data', () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    // Check for signal panel elements
    expect(screen.getByText('AI Signal Intelligence')).toBeInTheDocument();
    expect(screen.getByText('LONG')).toBeInTheDocument();
    expect(screen.getByText('87%')).toBeInTheDocument();
  });

  test('shows correlation matrix', () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    expect(screen.getByText('Real-time Correlation Matrix')).toBeInTheDocument();
    expect(screen.getByText('BTC-ETH')).toBeInTheDocument();
    expect(screen.getByText('+0.82')).toBeInTheDocument();
  });

  test('displays tab navigation', () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    expect(screen.getByText('Signals History')).toBeInTheDocument();
    expect(screen.getByText('Order Flow')).toBeInTheDocument();
    expect(screen.getByText('Smart Money')).toBeInTheDocument();
    expect(screen.getByText('Risk Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Backtest')).toBeInTheDocument();
  });

  test('handles tab switching', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    // Click on Order Flow tab
    const orderFlowTab = screen.getByText('Order Flow');
    fireEvent.click(orderFlowTab);
    
    await waitFor(() => {
      expect(screen.getByText('Order Flow Analysis')).toBeInTheDocument();
    });
  });

  test('displays risk metrics', () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    // Click on Risk Dashboard tab
    const riskTab = screen.getByText('Risk Dashboard');
    fireEvent.click(riskTab);
    
    expect(screen.getByText('Portfolio Risk Overview')).toBeInTheDocument();
    expect(screen.getByText('VaR (95%, 1d)')).toBeInTheDocument();
    expect(screen.getByText('$2,150')).toBeInTheDocument();
  });

  test('shows backtesting interface', () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    // Click on Backtest tab
    const backtestTab = screen.getByText('Backtest');
    fireEvent.click(backtestTab);
    
    expect(screen.getByText('Institutional Backtest Engine')).toBeInTheDocument();
    expect(screen.getByText('Run Backtest')).toBeInTheDocument();
  });

  test('handles responsive design', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    renderWithProviders(<InstitutionalDashboard />);
    
    // Check if mobile-specific elements are rendered
    expect(screen.getByText('Institutional Trading Dashboard')).toBeInTheDocument();
  });

  test('displays loading states', () => {
    const store = createMockStore();
    // Dispatch loading state
    store.dispatch({ type: 'chart/setLoading', payload: true });
    
    renderWithProviders(<InstitutionalDashboard />, store);
    
    // Check for loading indicators
    expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
  });

  test('handles error states', () => {
    const store = createMockStore();
    // Dispatch error state
    store.dispatch({ type: 'chart/setError', payload: 'Failed to load data' });
    
    renderWithProviders(<InstitutionalDashboard />, store);
    
    // Check for error message
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  test('updates chart when symbol changes', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    // Find and click symbol selector
    const symbolSelector = screen.getByDisplayValue('BTC-USD');
    fireEvent.change(symbolSelector, { target: { value: 'ETH-USD' } });
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('ETH-USD')).toBeInTheDocument();
    });
  });

  test('updates timeframe when changed', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    // Find and click timeframe selector
    const timeframeSelector = screen.getByDisplayValue('1h');
    fireEvent.change(timeframeSelector, { target: { value: '4h' } });
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('4h')).toBeInTheDocument();
    });
  });
});

describe('Signal Panel', () => {
  test('displays signal information correctly', () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    expect(screen.getByText('LONG')).toBeInTheDocument();
    expect(screen.getByText('87%')).toBeInTheDocument();
    expect(screen.getByText('$42,150')).toBeInTheDocument();
    expect(screen.getByText('1:2.1')).toBeInTheDocument();
  });

  test('shows rationale when expanded', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const expandButton = screen.getByText('Show Rationale');
    fireEvent.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByText('Top 3 Reasons')).toBeInTheDocument();
    });
  });

  test('displays risk metrics when expanded', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const expandButton = screen.getByText('Show Risk Metrics');
    fireEvent.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    });
  });
});

describe('Order Flow Tab', () => {
  test('displays order flow data', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const orderFlowTab = screen.getByText('Order Flow');
    fireEvent.click(orderFlowTab);
    
    await waitFor(() => {
      expect(screen.getByText('Order Flow Analysis')).toBeInTheDocument();
      expect(screen.getByText('Bid/Ask Imbalance')).toBeInTheDocument();
      expect(screen.getByText('68%')).toBeInTheDocument();
    });
  });

  test('shows large block trades', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const orderFlowTab = screen.getByText('Order Flow');
    fireEvent.click(orderFlowTab);
    
    await waitFor(() => {
      expect(screen.getByText('Large Block Trades')).toBeInTheDocument();
      expect(screen.getByText('$2.3M')).toBeInTheDocument();
    });
  });
});

describe('Smart Money Tab', () => {
  test('displays smart money patterns', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const smartMoneyTab = screen.getByText('Smart Money');
    fireEvent.click(smartMoneyTab);
    
    await waitFor(() => {
      expect(screen.getByText('Smart Money Detection')).toBeInTheDocument();
      expect(screen.getByText('Accumulation')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });
  });

  test('shows smart money zones', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const smartMoneyTab = screen.getByText('Smart Money');
    fireEvent.click(smartMoneyTab);
    
    await waitFor(() => {
      expect(screen.getByText('Smart Money Zones')).toBeInTheDocument();
      expect(screen.getByText('$41,800 - $42,200')).toBeInTheDocument();
    });
  });
});

describe('Risk Dashboard Tab', () => {
  test('displays VaR metrics', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const riskTab = screen.getByText('Risk Dashboard');
    fireEvent.click(riskTab);
    
    await waitFor(() => {
      expect(screen.getByText('VaR (95%, 1d)')).toBeInTheDocument();
      expect(screen.getByText('$2,150')).toBeInTheDocument();
    });
  });

  test('shows stress test scenarios', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const riskTab = screen.getByText('Risk Dashboard');
    fireEvent.click(riskTab);
    
    await waitFor(() => {
      expect(screen.getByText('Stress Testing')).toBeInTheDocument();
      expect(screen.getByText('Flash Crash')).toBeInTheDocument();
    });
  });
});

describe('Backtest Tab', () => {
  test('displays backtest parameters', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const backtestTab = screen.getByText('Backtest');
    fireEvent.click(backtestTab);
    
    await waitFor(() => {
      expect(screen.getByText('Input Parameters')).toBeInTheDocument();
      expect(screen.getByText('Asset')).toBeInTheDocument();
      expect(screen.getByText('Timeframe')).toBeInTheDocument();
    });
  });

  test('shows run backtest button', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const backtestTab = screen.getByText('Backtest');
    fireEvent.click(backtestTab);
    
    await waitFor(() => {
      expect(screen.getByText('Run Backtest')).toBeInTheDocument();
    });
  });
});

// Integration tests
describe('Dashboard Integration', () => {
  test('maintains state across tab switches', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    // Switch to Order Flow tab
    const orderFlowTab = screen.getByText('Order Flow');
    fireEvent.click(orderFlowTab);
    
    await waitFor(() => {
      expect(screen.getByText('Order Flow Analysis')).toBeInTheDocument();
    });
    
    // Switch back to main view
    const signalsTab = screen.getByText('Signals History');
    fireEvent.click(signalsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Signals')).toBeInTheDocument();
    });
  });

  test('handles multiple rapid tab switches', async () => {
    renderWithProviders(<InstitutionalDashboard />);
    
    const tabs = ['Order Flow', 'Smart Money', 'Risk Dashboard', 'Backtest'];
    
    for (const tabName of tabs) {
      const tab = screen.getByText(tabName);
      fireEvent.click(tab);
      
      await waitFor(() => {
        expect(screen.getByText(tabName)).toBeInTheDocument();
      });
    }
  });
});
