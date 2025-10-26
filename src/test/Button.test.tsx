import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, IconButton, ButtonGroup } from '../components/ui/Button'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-elevated')

    rerender(<Button variant="buy">Buy</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-buy')

    rerender(<Button variant="sell">Sell</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-sell')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')

    rerender(<Button variant="danger">Danger</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-sell')

    rerender(<Button variant="ai">AI</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-ai')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm')

    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-base')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button.querySelector('svg')).toBeInTheDocument()
    expect(button.querySelector('svg')).toHaveClass('animate-spin')
  })

  it('renders with left icon', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>
    render(<Button leftIcon={<LeftIcon />}>With Left Icon</Button>)
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByText('With Left Icon')).toBeInTheDocument()
  })

  it('renders with right icon', () => {
    const RightIcon = () => <span data-testid="right-icon">→</span>
    render(<Button rightIcon={<RightIcon />}>With Right Icon</Button>)
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    expect(screen.getByText('With Right Icon')).toBeInTheDocument()
  })

  it('hides icons when loading', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>
    const RightIcon = () => <span data-testid="right-icon">→</span>
    
    render(
      <Button 
        isLoading 
        leftIcon={<LeftIcon />} 
        rightIcon={<RightIcon />}
      >
        Loading
      </Button>
    )
    
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument()
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument()
  })

  it('applies fullWidth class when specified', () => {
    render(<Button fullWidth>Full Width</Button>)
    
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
  })

  it('is disabled when loading', () => {
    render(<Button isLoading>Loading</Button>)
    
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('forwards other props to button element', () => {
    render(<Button data-testid="custom-button" type="submit">Submit</Button>)
    
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('type', 'submit')
  })
})

describe('IconButton Component', () => {
  it('renders with icon only', () => {
    const TestIcon = () => <span data-testid="test-icon">🔥</span>
    render(<IconButton icon={<TestIcon />} aria-label="Fire button" />)
    
    const button = screen.getByRole('button', { name: 'Fire button' })
    expect(button).toBeInTheDocument()
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const TestIcon = () => <span>🔥</span>
    const { rerender } = render(
      <IconButton icon={<TestIcon />} aria-label="Test" size="sm" />
    )
    expect(screen.getByRole('button')).toHaveClass('w-8', 'h-8', 'p-1.5')

    rerender(<IconButton icon={<TestIcon />} aria-label="Test" size="md" />)
    expect(screen.getByRole('button')).toHaveClass('w-10', 'h-10', 'p-2')

    rerender(<IconButton icon={<TestIcon />} aria-label="Test" size="lg" />)
    expect(screen.getByRole('button')).toHaveClass('w-12', 'h-12', 'p-2.5')
  })

  it('requires aria-label for accessibility', () => {
    const TestIcon = () => <span>🔥</span>
    render(<IconButton icon={<TestIcon />} aria-label="Required label" />)
    
    expect(screen.getByRole('button', { name: 'Required label' })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const TestIcon = () => <span>🔥</span>
    
    render(
      <IconButton 
        icon={<TestIcon />} 
        aria-label="Clickable icon" 
        onClick={handleClick} 
      />
    )
    
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

describe('ButtonGroup Component', () => {
  it('renders children in a group', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toBeInTheDocument()
    expect(group).toHaveClass('inline-flex', 'rounded-lg')
    
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Second' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Third' })).toBeInTheDocument()
  })

  it('applies correct border radius classes to grouped buttons', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    )
    
    const buttons = screen.getAllByRole('button')
    
    // First button should not have rounded-l-none
    expect(buttons[0]).not.toHaveClass('rounded-l-none')
    expect(buttons[0]).toHaveClass('rounded-r-none')
    
    // Middle button should have both rounded corners removed
    expect(buttons[1]).toHaveClass('rounded-l-none', 'rounded-r-none', 'border-l-0')
    
    // Last button should not have rounded-r-none
    expect(buttons[2]).toHaveClass('rounded-l-none', 'border-l-0')
    expect(buttons[2]).not.toHaveClass('rounded-r-none')
  })

  it('applies custom className to group', () => {
    render(
      <ButtonGroup className="custom-group-class">
        <Button>Test</Button>
      </ButtonGroup>
    )
    
    expect(screen.getByRole('group')).toHaveClass('custom-group-class')
  })

  it('handles single button in group', () => {
    render(
      <ButtonGroup>
        <Button>Single</Button>
      </ButtonGroup>
    )
    
    const button = screen.getByRole('button')
    // Single button should not have any border radius modifications
    expect(button).not.toHaveClass('rounded-l-none', 'rounded-r-none', 'border-l-0')
  })
})
