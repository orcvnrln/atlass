import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'

// Mock zustand store
import { useTradeStore } from '../core/tradeStore'

beforeEach(() => {
  useTradeStore.setState({
    activeModule: 'AI Analysis',
    setActiveModule: vi.fn(),
  })
})

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ExternalLink: () => 'div',
  X: () => 'div',
  ChevronDown: () => 'div',
  Settings: () => 'div',
  Moon: () => 'div',
  Sun: () => 'div',
  Monitor: () => 'div',
}))
