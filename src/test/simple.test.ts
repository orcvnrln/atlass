import { describe, it, expect, beforeEach } from 'vitest'
import { cn } from '../lib/utils'
import { useTradeStore } from '../core/tradeStore'

describe('Simple Tests', () => {
  describe('Utils - cn function', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'active', 'end')).toBe('base active end')
      expect(cn('base', false && 'inactive', 'end')).toBe('base end')
    })

    it('should merge conflicting Tailwind classes', () => {
      expect(cn('px-4 px-6')).toBe('px-6')
    })
  })

  describe('Trade Store', () => {
    beforeEach(() => {
      // Reset only the data, not the functions
      const store = useTradeStore.getState()
      store.setActiveModule('AI Analysis')
      store.clearTradingSetups()
      useTradeStore.setState({
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
      })
    })

    it('should have correct initial state', () => {
      const state = useTradeStore.getState()
      expect(state.activeModule).toBe('AI Analysis')
      expect(state.tradingSetups).toEqual([])
      expect(state.activeRules).toEqual([])
      expect(state.backtestResult).toBeNull()
    })

    it('should add trading setup', () => {
      const { addTradingSetup } = useTradeStore.getState()
      
      const setup = {
        id: 'test-1',
        symbol: 'EURUSD',
        pattern: 'Bullish Engulfing',
        trend: 'BULLISH' as const,
        entry: 1.0850,
        stopLoss: 1.0800,
        takeProfit: 1.0950,
        rrRatio: 2.0,
        confidence: 85,
        timestamp: Date.now(),
      }
      
      addTradingSetup(setup)
      
      const state = useTradeStore.getState()
      expect(state.tradingSetups).toHaveLength(1)
      expect(state.tradingSetups[0]).toEqual(setup)
    })

    it('should update risk metrics', () => {
      const { updateRiskMetrics } = useTradeStore.getState()
      
      updateRiskMetrics({
        positionSize: 10000,
        riskPercent: 2,
      })
      
      const state = useTradeStore.getState()
      expect(state.riskMetrics.positionSize).toBe(10000)
      expect(state.riskMetrics.riskPercent).toBe(2)
      expect(state.riskMetrics.leverage).toBe(1) // Should remain unchanged
    })

    it('should manage active rules', () => {
      const { availableRules, addActiveRule, removeActiveRule } = useTradeStore.getState()
      
      // Add a rule
      const ruleToAdd = availableRules[0]
      addActiveRule(ruleToAdd)
      
      let state = useTradeStore.getState()
      expect(state.activeRules).toHaveLength(1)
      expect(state.activeRules[0]).toEqual(ruleToAdd)
      
      // Remove the rule
      removeActiveRule(ruleToAdd.id)
      
      state = useTradeStore.getState()
      expect(state.activeRules).toHaveLength(0)
    })
  })
})
