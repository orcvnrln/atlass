import { describe, it, expect, beforeEach } from 'vitest'
import { useTradeStore, type TradingSetup, type StrategyRule, type BacktestResult, type RiskMetrics } from '../core/tradeStore'

describe('TradeStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTradeStore.setState({
      activeModule: 'AI Analysis',
      tradingSetups: [],
      activeRules: [],
      backtestResult: null,
      riskMetrics: {
        positionSize: 0,
        riskPercent: 1,
        leverage: 1,
        stopLossDistance: 0,
        potentialProfit: 0,
        potentialLoss: 0,
        marginRequired: 0,
      },
    }, true) // Replace entire state
  })

  describe('Active Module Management', () => {
    it('should have default active module as AI Analysis', () => {
      const { activeModule } = useTradeStore.getState()
      expect(activeModule).toBe('AI Analysis')
    })

    it('should set active module correctly', () => {
      const { setActiveModule } = useTradeStore.getState()
      
      setActiveModule('Trading Setups')
      expect(useTradeStore.getState().activeModule).toBe('Trading Setups')
      
      setActiveModule('Strategy Builder')
      expect(useTradeStore.getState().activeModule).toBe('Strategy Builder')
      
      setActiveModule('Risk Control')
      expect(useTradeStore.getState().activeModule).toBe('Risk Control')
    })
  })

  describe('Trading Setups Management', () => {
    const mockTradingSetup: TradingSetup = {
      id: 'setup_1',
      symbol: 'EURUSD',
      pattern: 'Bullish Engulfing',
      trend: 'BULLISH',
      entry: 1.0850,
      stopLoss: 1.0800,
      takeProfit: 1.0950,
      rrRatio: 2.0,
      confidence: 85,
      timestamp: Date.now(),
    }

    it('should start with empty trading setups', () => {
      const { tradingSetups } = useTradeStore.getState()
      expect(tradingSetups).toEqual([])
    })

    it('should add trading setup correctly', () => {
      const { addTradingSetup } = useTradeStore.getState()
      
      addTradingSetup(mockTradingSetup)
      
      const { tradingSetups } = useTradeStore.getState()
      expect(tradingSetups).toHaveLength(1)
      expect(tradingSetups[0]).toEqual(mockTradingSetup)
    })

    it('should add multiple trading setups', () => {
      const { addTradingSetup } = useTradeStore.getState()
      
      const setup2: TradingSetup = {
        ...mockTradingSetup,
        id: 'setup_2',
        symbol: 'GBPUSD',
        pattern: 'Bearish Engulfing',
        trend: 'BEARISH',
      }
      
      addTradingSetup(mockTradingSetup)
      addTradingSetup(setup2)
      
      const { tradingSetups } = useTradeStore.getState()
      expect(tradingSetups).toHaveLength(2)
      expect(tradingSetups[0]).toEqual(mockTradingSetup)
      expect(tradingSetups[1]).toEqual(setup2)
    })

    it('should clear all trading setups', () => {
      const { addTradingSetup, clearTradingSetups } = useTradeStore.getState()
      
      addTradingSetup(mockTradingSetup)
      expect(useTradeStore.getState().tradingSetups).toHaveLength(1)
      
      clearTradingSetups()
      expect(useTradeStore.getState().tradingSetups).toEqual([])
    })
  })

  describe('Strategy Builder Management', () => {
    it('should have predefined available rules', () => {
      const { availableRules } = useTradeStore.getState()
      
      expect(availableRules).toHaveLength(6)
      expect(availableRules.some(rule => rule.id === 'rule_rsi_oversold')).toBe(true)
      expect(availableRules.some(rule => rule.id === 'rule_rsi_overbought')).toBe(true)
      expect(availableRules.some(rule => rule.id === 'rule_sma_cross_up')).toBe(true)
      expect(availableRules.some(rule => rule.id === 'rule_sma_cross_down')).toBe(true)
      expect(availableRules.some(rule => rule.id === 'rule_bullish_engulfing')).toBe(true)
      expect(availableRules.some(rule => rule.id === 'rule_bearish_engulfing')).toBe(true)
    })

    it('should start with empty active rules', () => {
      const { activeRules } = useTradeStore.getState()
      expect(activeRules).toEqual([])
    })

    it('should add active rule correctly', () => {
      const { availableRules, addActiveRule } = useTradeStore.getState()
      const ruleToAdd = availableRules[0]
      
      addActiveRule(ruleToAdd)
      
      const { activeRules } = useTradeStore.getState()
      expect(activeRules).toHaveLength(1)
      expect(activeRules[0]).toEqual(ruleToAdd)
    })

    it('should add multiple active rules', () => {
      const { availableRules, addActiveRule } = useTradeStore.getState()
      
      addActiveRule(availableRules[0])
      addActiveRule(availableRules[1])
      
      const { activeRules } = useTradeStore.getState()
      expect(activeRules).toHaveLength(2)
      expect(activeRules[0]).toEqual(availableRules[0])
      expect(activeRules[1]).toEqual(availableRules[1])
    })

    it('should remove active rule correctly', () => {
      const { availableRules, addActiveRule, removeActiveRule } = useTradeStore.getState()
      
      addActiveRule(availableRules[0])
      addActiveRule(availableRules[1])
      expect(useTradeStore.getState().activeRules).toHaveLength(2)
      
      removeActiveRule(availableRules[0].id)
      
      const { activeRules } = useTradeStore.getState()
      expect(activeRules).toHaveLength(1)
      expect(activeRules[0]).toEqual(availableRules[1])
    })

    it('should handle backtest results', () => {
      const mockBacktestResult: BacktestResult = {
        totalTrades: 100,
        winRate: 65.5,
        profitFactor: 1.85,
        maxDrawdown: 12.3,
        netProfit: 15000,
      }
      
      const { setBacktestResult } = useTradeStore.getState()
      
      setBacktestResult(mockBacktestResult)
      
      const { backtestResult } = useTradeStore.getState()
      expect(backtestResult).toEqual(mockBacktestResult)
    })
  })

  describe('Risk Control Management', () => {
    it('should have default risk metrics', () => {
      const { riskMetrics } = useTradeStore.getState()
      
      expect(riskMetrics).toEqual({
        positionSize: 0,
        riskPercent: 1,
        leverage: 1,
        stopLossDistance: 0,
        potentialProfit: 0,
        potentialLoss: 0,
        marginRequired: 0,
      })
    })

    it('should update risk metrics partially', () => {
      const { updateRiskMetrics } = useTradeStore.getState()
      
      updateRiskMetrics({
        positionSize: 10000,
        riskPercent: 2,
      })
      
      const { riskMetrics } = useTradeStore.getState()
      expect(riskMetrics.positionSize).toBe(10000)
      expect(riskMetrics.riskPercent).toBe(2)
      expect(riskMetrics.leverage).toBe(1) // Should remain unchanged
    })

    it('should update all risk metrics', () => {
      const newMetrics: RiskMetrics = {
        positionSize: 50000,
        riskPercent: 3,
        leverage: 10,
        stopLossDistance: 50,
        potentialProfit: 2500,
        potentialLoss: 1500,
        marginRequired: 5000,
      }
      
      const { updateRiskMetrics } = useTradeStore.getState()
      
      updateRiskMetrics(newMetrics)
      
      const { riskMetrics } = useTradeStore.getState()
      expect(riskMetrics).toEqual(newMetrics)
    })
  })

  describe('Store Integration', () => {
    it('should maintain state consistency across multiple operations', () => {
      const { setActiveModule, addTradingSetup, addActiveRule, updateRiskMetrics, availableRules } = useTradeStore.getState()
      
      // Perform multiple operations
      setActiveModule('Trading Setups')
      
      const mockSetup: TradingSetup = {
        id: 'integration_test',
        symbol: 'EURUSD',
        pattern: 'Doji',
        trend: 'NEUTRAL',
        entry: 1.0900,
        stopLoss: 1.0850,
        takeProfit: 1.0950,
        rrRatio: 1.0,
        confidence: 70,
        timestamp: Date.now(),
      }
      
      addTradingSetup(mockSetup)
      addActiveRule(availableRules[0])
      updateRiskMetrics({ positionSize: 25000, riskPercent: 2.5 })
      
      // Verify all state changes
      const state = useTradeStore.getState()
      expect(state.activeModule).toBe('Trading Setups')
      expect(state.tradingSetups).toHaveLength(1)
      expect(state.tradingSetups[0]).toEqual(mockSetup)
      expect(state.activeRules).toHaveLength(1)
      expect(state.activeRules[0]).toEqual(availableRules[0])
      expect(state.riskMetrics.positionSize).toBe(25000)
      expect(state.riskMetrics.riskPercent).toBe(2.5)
    })
  })
})
