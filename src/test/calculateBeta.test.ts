// Test for calculateBeta handling zero benchmark variance
import { describe, it, expect, vi } from 'vitest';

// Mock the mockData module to provide controlled historicalPerformance
vi.mock('../pages/portfolio-analysis/utils/mockData', async () => {
  const actual = await vi.importActual('../pages/portfolio-analysis/utils/mockData');
  return {
    ...actual,
    historicalPerformance: [
      { portfolioValue: 100, benchmarkValue: 100 },
      { portfolioValue: 110, benchmarkValue: 100 },
      { portfolioValue: 120, benchmarkValue: 100 },
    ],
    holdings: [],
  };
});

import { calculateBeta } from '../pages/portfolio-analysis/utils/calculations';

describe('calculateBeta', () => {
  it('returns 0 when benchmark variance is zero', () => {
    expect(calculateBeta()).toBe(0);
  });
});
