import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { cn } from '../lib/utils'

// Simple component for testing
const TestButton = ({ 
  onClick, 
  variant = 'primary', 
  children 
}: { 
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  children: React.ReactNode 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      )}
    >
      {children}
    </button>
  )
}

describe('Demo Tests - Working Examples', () => {
  describe('Utility Functions', () => {
    it('cn function merges classes correctly', () => {
      expect(cn('px-4', 'py-2', 'bg-blue-500')).toBe('px-4 py-2 bg-blue-500')
    })

    it('cn function handles conditional classes', () => {
      const isActive = true
      const result = cn('base', isActive && 'active', 'end')
      expect(result).toBe('base active end')
    })

    it('cn function resolves Tailwind conflicts', () => {
      expect(cn('px-4 px-6')).toBe('px-6')
      expect(cn('text-sm text-lg')).toBe('text-lg')
    })
  })

  describe('Component Testing', () => {
    it('renders button with correct text', () => {
      render(<TestButton>Click me</TestButton>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('applies correct CSS classes for variants', () => {
      const { rerender } = render(<TestButton variant="primary">Primary</TestButton>)
      expect(screen.getByRole('button')).toHaveClass('bg-blue-500', 'text-white')

      rerender(<TestButton variant="secondary">Secondary</TestButton>)
      expect(screen.getByRole('button')).toHaveClass('bg-gray-200', 'text-gray-800')
    })

    it('handles click events', async () => {
      const handleClick = vi.fn()
      render(<TestButton onClick={handleClick}>Click me</TestButton>)
      
      await userEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies base classes correctly', () => {
      render(<TestButton>Test</TestButton>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('px-4', 'py-2', 'rounded')
    })
  })

  describe('Mock Functions', () => {
    it('creates and uses mock functions', () => {
      const mockFn = vi.fn()
      mockFn('test', 123)
      
      expect(mockFn).toHaveBeenCalledWith('test', 123)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('mocks return values', () => {
      const mockFn = vi.fn()
      mockFn.mockReturnValue('mocked result')
      
      expect(mockFn()).toBe('mocked result')
    })

    it('mocks async functions', async () => {
      const mockAsyncFn = vi.fn()
      mockAsyncFn.mockResolvedValue('async result')
      
      const result = await mockAsyncFn()
      expect(result).toBe('async result')
    })
  })

  describe('Array and Object Testing', () => {
    it('tests array operations', () => {
      const items = ['apple', 'banana', 'cherry']
      
      expect(items).toHaveLength(3)
      expect(items).toContain('banana')
      expect(items[0]).toBe('apple')
    })

    it('tests object properties', () => {
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        active: true
      }
      
      expect(user).toHaveProperty('id', 1)
      expect(user).toHaveProperty('name')
      expect(user.active).toBe(true)
      expect(user).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com'
      })
    })
  })

  describe('Error Handling', () => {
    it('tests error throwing', () => {
      const errorFn = () => {
        throw new Error('Something went wrong')
      }
      
      expect(errorFn).toThrow('Something went wrong')
      expect(errorFn).toThrow(Error)
    })

    it('tests async error handling', async () => {
      const asyncErrorFn = async () => {
        throw new Error('Async error')
      }
      
      await expect(asyncErrorFn()).rejects.toThrow('Async error')
    })
  })

  describe('String and Number Testing', () => {
    it('tests string operations', () => {
      const text = 'Hello, World!'
      
      expect(text).toMatch(/Hello/)
      expect(text).toContain('World')
      expect(text.toLowerCase()).toBe('hello, world!')
      expect(text).toHaveLength(13)
    })

    it('tests number operations', () => {
      const price = 99.99
      const quantity = 5
      const total = price * quantity
      
      expect(total).toBeCloseTo(499.95)
      expect(quantity).toBeGreaterThan(0)
      expect(price).toBeLessThan(100)
    })
  })

  describe('Boolean and Null Testing', () => {
    it('tests boolean values', () => {
      expect(true).toBe(true)
      expect(false).toBeFalsy()
      expect(1).toBeTruthy()
      expect(0).toBeFalsy()
      expect('').toBeFalsy()
      expect('text').toBeTruthy()
    })

    it('tests null and undefined', () => {
      expect(null).toBeNull()
      expect(undefined).toBeUndefined()
      expect('defined').toBeDefined()
      expect(null).toBeFalsy()
      expect(undefined).toBeFalsy()
    })
  })
})
