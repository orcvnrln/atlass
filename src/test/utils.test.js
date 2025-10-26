import { describe, it, expect } from 'vitest'
import { cn } from '../lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-500')
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class', 'another-class')
      expect(result).toBe('base-class active-class another-class')
    })

    it('handles false conditional classes', () => {
      const isActive = false
      const result = cn('base-class', isActive && 'active-class', 'another-class')
      expect(result).toBe('base-class another-class')
    })

    it('merges conflicting Tailwind classes correctly', () => {
      const result = cn('px-4 px-6', 'py-2 py-4')
      // twMerge should keep the last conflicting class
      expect(result).toBe('px-6 py-4')
    })

    it('handles arrays of classes', () => {
      const result = cn(['px-4', 'py-2'], 'bg-blue-500')
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('handles objects with conditional classes', () => {
      const result = cn({
        'px-4': true,
        'py-2': true,
        'bg-red-500': false,
        'bg-blue-500': true,
      })
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('handles empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('handles null and undefined inputs', () => {
      const result = cn('px-4', null, undefined, 'py-2')
      expect(result).toBe('px-4 py-2')
    })

    it('handles complex mixed inputs', () => {
      const isActive = true
      const isDisabled = false
      const result = cn(
        'base-class',
        ['array-class-1', 'array-class-2'],
        {
          'object-class-1': true,
          'object-class-2': false,
        },
        isActive && 'active-class',
        isDisabled && 'disabled-class',
        'final-class'
      )
      expect(result).toBe('base-class array-class-1 array-class-2 object-class-1 active-class final-class')
    })

    it('properly merges responsive classes', () => {
      const result = cn('w-full md:w-1/2', 'md:w-1/3 lg:w-1/4')
      expect(result).toBe('w-full md:w-1/3 lg:w-1/4')
    })

    it('handles hover and focus states', () => {
      const result = cn('hover:bg-blue-500 focus:bg-blue-600', 'hover:bg-red-500')
      expect(result).toBe('focus:bg-blue-600 hover:bg-red-500')
    })
  })
})
