import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { useTradeStore } from '../core/tradeStore'
import { ThemeProvider } from '../context/ThemeContext'

// Mock the lazy-loaded components
vi.mock('../modules/AIAnalysis', () => ({
  default: ({ isFullPage, onSetupSelect }: any) => (
    <div data-testid="ai-analysis" data-fullpage={isFullPage}>
      AI Analysis Module
      <button onClick={() => onSetupSelect({ id: 1, name: 'Test Setup' })}>
        Select Setup
      </button>
    </div>
  ),
}))

vi.mock('../modules/TradingSetups', () => ({
  default: ({ isFullPage, onOpenFullPage, onSetupSelect }: any) => (
    <div data-testid="trading-setups" data-fullpage={isFullPage}>
      Trading Setups Module
      <button onClick={onOpenFullPage}>Open Full Page</button>
      <button onClick={() => onSetupSelect({ id: 2, name: 'Trading Setup' })}>
        Select Setup
      </button>
    </div>
  ),
}))

vi.mock('../modules/StrategyBuilder', () => ({
  default: ({ isFullPage, onOpenFullPage, onSetupSelect }: any) => (
    <div data-testid="strategy-builder" data-fullpage={isFullPage}>
      Strategy Builder Module
      <button onClick={onOpenFullPage}>Open Full Page</button>
      <button onClick={() => onSetupSelect({ id: 3, name: 'Strategy Setup' })}>
        Select Setup
      </button>
    </div>
  ),
}))

vi.mock('../modules/RiskControl', () => ({
  default: ({ isFullPage, onOpenFullPage, onSetupSelect }: any) => (
    <div data-testid="risk-control" data-fullpage={isFullPage}>
      Risk Control Module
      <button onClick={onOpenFullPage}>Open Full Page</button>
      <button onClick={() => onSetupSelect({ id: 4, name: 'Risk Setup' })}>
        Select Setup
      </button>
    </div>
  ),
}))

vi.mock('../components/trading/AIExecutionSuite', () => ({
  default: ({ selectedSetup }: any) => (
    <div data-testid="ai-execution-suite">
      AI Execution Suite
      {selectedSetup && <div data-testid="selected-setup">{selectedSetup.name}</div>}
    </div>
  ),
}))

vi.mock('../components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}))

vi.mock('../components/ui/ThemeSwitcher', () => ({
  default: () => <div data-testid="theme-switcher">Theme Switcher</div>,
}))

vi.mock('../components/layout/MiniPerformanceBar', () => ({
  default: () => <div data-testid="mini-performance-bar">Performance Bar</div>,
}))

// Mock the trade store
vi.mock('../core/tradeStore', () => ({
  useTradeStore: vi.fn(),
}))

// Mock theme context
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark' }),
  ThemeProvider: ({ children }: any) => children,
}))

const mockUseTradeStore = vi.mocked(useTradeStore)

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('App Component', () => {
  beforeEach(() => {
    mockUseTradeStore.mockImplementation((selector) => {
      const state = {
        activeModule: 'AI Analysis',
        setActiveModule: vi.fn(),
      }
      return selector(state)
    })
  })

  it('renders the main app layout', () => {
    renderWithProviders(<App />)
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('ai-analysis')).toBeInTheDocument()
    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument()
    expect(screen.getByTestId('mini-performance-bar')).toBeInTheDocument()
  })

  it('renders all tab navigation buttons', () => {
    renderWithProviders(<App />)
    
    expect(screen.getByRole('button', { name: 'AI Analysis' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Trading Setups' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Strategy Builder' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Risk Control' })).toBeInTheDocument()
  })

  it('switches modules when tab is clicked', async () => {
    const mockSetActiveModule = vi.fn()
    mockUseTradeStore.mockImplementation((selector) => {
      const state = {
        activeModule: 'AI Analysis',
        setActiveModule: mockSetActiveModule,
      }
      return selector(state)
    })

    renderWithProviders(<App />)
    
    const tradingSetupsTab = screen.getByRole('button', { name: 'Trading Setups' })
    await userEvent.click(tradingSetupsTab)
    
    expect(mockSetActiveModule).toHaveBeenCalledWith('Trading Setups')
  })

  it('renders different modules based on active module', () => {
    // Test Trading Setups module
    mockUseTradeStore.mockImplementation((selector) => {
      const state = {
        activeModule: 'Trading Setups',
        setActiveModule: vi.fn(),
      }
      return selector(state)
    })

    const { rerender } = renderWithProviders(<App />)
    expect(screen.getByTestId('trading-setups')).toBeInTheDocument()

    // Test Strategy Builder module
    mockUseTradeStore.mockImplementation((selector) => {
      const state = {
        activeModule: 'Strategy Builder',
        setActiveModule: vi.fn(),
      }
      return selector(state)
    })

    rerender(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    )
    expect(screen.getByTestId('strategy-builder')).toBeInTheDocument()
  })

  it('opens full page mode when requested', async () => {
    mockUseTradeStore.mockImplementation((selector) => {
      const state = {
        activeModule: 'Trading Setups',
        setActiveModule: vi.fn(),
      }
      return selector(state)
    })

    renderWithProviders(<App />)
    
    const openFullPageButton = screen.getByText('Open Full Page')
    await userEvent.click(openFullPageButton)
    
    await waitFor(() => {
      expect(screen.getByText('Close Full Page')).toBeInTheDocument()
      expect(screen.getByTestId('ai-execution-suite')).toBeInTheDocument()
    })
  })

  it('closes full page mode when close button is clicked', async () => {
    mockUseTradeStore.mockImplementation((selector) => {
      const state = {
        activeModule: 'Trading Setups',
        setActiveModule: vi.fn(),
      }
      return selector(state)
    })

    renderWithProviders(<App />)
    
    // Open full page mode
    const openFullPageButton = screen.getByText('Open Full Page')
    await userEvent.click(openFullPageButton)
    
    await waitFor(() => {
      expect(screen.getByText('Close Full Page')).toBeInTheDocument()
    })
    
    // Close full page mode
    const closeButton = screen.getByText('Close Full Page')
    await userEvent.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Close Full Page')).not.toBeInTheDocument()
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })
  })

  it('handles setup selection correctly', async () => {
    renderWithProviders(<App />)
    
    const selectSetupButton = screen.getByText('Select Setup')
    await userEvent.click(selectSetupButton)
    
    // The selected setup should be passed to AI Execution Suite in full page mode
    const openFullPageButton = screen.getByText('Open Full Page')
    await userEvent.click(openFullPageButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('selected-setup')).toHaveTextContent('Test Setup')
    })
  })

  it('displays loading state while modules are loading', () => {
    renderWithProviders(<App />)
    
    // The loading state should be visible initially due to Suspense
    expect(screen.getByText('Yüklənir...')).toBeInTheDocument()
  })

  it('applies correct CSS classes for active tab', () => {
    mockUseTradeStore.mockImplementation((selector) => {
      const state = {
        activeModule: 'AI Analysis',
        setActiveModule: vi.fn(),
      }
      return selector(state)
    })

    renderWithProviders(<App />)
    
    const activeTab = screen.getByRole('button', { name: 'AI Analysis' })
    const inactiveTab = screen.getByRole('button', { name: 'Trading Setups' })
    
    expect(activeTab).toHaveClass('text-accent', 'border-b-2', 'border-accent', 'bg-muted')
    expect(inactiveTab).toHaveClass('text-muted-foreground')
  })
})
