# Test Suite Documentation

This directory contains comprehensive tests for the Bloomberg Terminal Pro trading platform.

## Test Setup

### Testing Framework
- **Vitest**: Fast unit test runner with TypeScript support
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment for testing

### Configuration
- `vitest.config.ts`: Main Vitest configuration with path aliases
- `src/test/setup.ts`: Global test setup with mocks and utilities

## Test Files

### 1. `simple.test.ts` ✅ PASSING
**Purpose**: Core functionality tests for utilities and state management
**Coverage**:
- `cn()` utility function for class name merging
- Trade store state management (CRUD operations)
- Risk metrics management
- Trading rules management

**Key Tests**:
- Class name merging with Tailwind CSS
- Trading setup creation and management
- Risk metrics updates
- Active rules addition/removal

### 2. `utils.test.js` ✅ PASSING
**Purpose**: Comprehensive utility function testing
**Coverage**:
- Class name concatenation and merging
- Conditional class handling
- Tailwind CSS conflict resolution
- Complex input scenarios (arrays, objects, conditionals)

### 3. `tradeStore.test.ts` ⚠️ PARTIAL
**Purpose**: Detailed trade store testing
**Coverage**:
- Module switching functionality
- Trading setups management
- Strategy builder operations
- Risk control metrics
- Store integration testing

**Issues**: Some tests failing due to state reset conflicts

### 4. `App.test.tsx` ❌ NEEDS FIXING
**Purpose**: Main application component testing
**Coverage**:
- Component rendering
- Tab navigation
- Module switching
- Full-page mode functionality
- Setup selection handling

**Issues**: Path resolution and component mocking

### 5. `Button.test.tsx` ❌ NEEDS FIXING
**Purpose**: UI Button component testing
**Coverage**:
- Button variants (primary, secondary, buy, sell, ghost, danger, AI)
- Button sizes (sm, md, lg)
- Loading states
- Icon handling
- Event handling
- Accessibility features

**Issues**: Path resolution for imports

### 6. `ThemeSwitcher.test.tsx` ❌ NEEDS FIXING
**Purpose**: Theme switching component testing
**Coverage**:
- Theme selection UI
- Theme persistence
- Icon display
- Menu interactions
- Theme preview colors

**Issues**: Context mocking and path resolution

## Running Tests

### All Tests
```bash
npm test          # Watch mode
npm run test:run  # Single run
npm run test:ui   # UI mode
```

### Specific Tests
```bash
npx vitest run src/test/simple.test.ts
npx vitest run src/test/utils.test.js
```

### Coverage
```bash
npm run test:coverage
```

## Test Patterns

### 1. Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Render component
render(<Component prop="value" />)

// Find elements
const button = screen.getByRole('button', { name: 'Click me' })

// Simulate interactions
await userEvent.click(button)

// Assert results
expect(button).toBeInTheDocument()
```

### 2. Store Testing
```typescript
import { useTradeStore } from '../core/tradeStore'

// Get store functions
const { addTradingSetup } = useTradeStore.getState()

// Perform actions
addTradingSetup(mockSetup)

// Assert state changes
const state = useTradeStore.getState()
expect(state.tradingSetups).toHaveLength(1)
```

### 3. Utility Testing
```typescript
import { cn } from '../lib/utils'

// Test utility functions
expect(cn('class1', 'class2')).toBe('class1 class2')
expect(cn('px-4 px-6')).toBe('px-6') // Tailwind merge
```

## Mocking Strategy

### 1. External Libraries
```typescript
// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ExternalLink: () => 'div',
  X: () => 'div',
  // ... other icons
}))
```

### 2. Context Providers
```typescript
// Mock theme context
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => children,
}))
```

### 3. Lazy Components
```typescript
// Mock lazy-loaded modules
vi.mock('../modules/AIAnalysis', () => ({
  default: ({ isFullPage }: any) => (
    <div data-testid="ai-analysis" data-fullpage={isFullPage}>
      AI Analysis Module
    </div>
  ),
}))
```

## Best Practices

1. **Isolation**: Each test should be independent and not affect others
2. **Descriptive Names**: Test names should clearly describe what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification
4. **Mock External Dependencies**: Mock APIs, external libraries, and complex components
5. **Test User Interactions**: Focus on testing user behavior, not implementation details
6. **Accessibility**: Include accessibility testing with proper ARIA labels and roles

## Troubleshooting

### Common Issues

1. **Path Resolution**: Ensure `@` alias is configured in `vitest.config.ts`
2. **Component Mocking**: Mock complex components to avoid dependency issues
3. **State Management**: Reset store state between tests to avoid interference
4. **Async Operations**: Use `waitFor` for async state changes and effects

### Debug Tips

1. Use `screen.debug()` to see rendered DOM
2. Add `console.log` in tests to inspect values
3. Use `--reporter=verbose` for detailed test output
4. Check browser console for additional error details

## Future Improvements

1. Add integration tests for complete user workflows
2. Implement visual regression testing
3. Add performance testing for critical components
4. Increase test coverage to 90%+
5. Add E2E tests with Playwright or Cypress
