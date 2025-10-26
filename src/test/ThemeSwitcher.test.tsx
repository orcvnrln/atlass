import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeSwitcher from '../components/ui/ThemeSwitcher'
import { THEMES, THEME_CONFIGS } from '../context/ThemeContext'

// Mock the theme context
const mockSetTheme = vi.fn()
const mockUseTheme = vi.fn()

vi.mock('../context/ThemeContext', async () => {
  const actual = await vi.importActual('../context/ThemeContext')
  return {
    ...actual,
    useTheme: () => mockUseTheme(),
  }
})

describe('ThemeSwitcher Component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
    mockUseTheme.mockReturnValue({
      theme: THEMES.DARK,
      setTheme: mockSetTheme,
      themeConfigs: THEME_CONFIGS,
    })
  })

  it('renders the theme switcher button', () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('title', 'Switch Theme')
  })

  it('displays current theme name', () => {
    render(<ThemeSwitcher />)
    
    expect(screen.getByText('Dark')).toBeInTheDocument()
  })

  it('displays correct icon for current theme', () => {
    // Test dark theme (Monitor icon)
    render(<ThemeSwitcher />)
    expect(screen.getByTestId('monitor-icon')).toBeInTheDocument()

    // Test light theme (Sun icon)
    mockUseTheme.mockReturnValue({
      theme: THEMES.LIGHT,
      setTheme: mockSetTheme,
      themeConfigs: THEME_CONFIGS,
    })
    
    const { rerender } = render(<ThemeSwitcher />)
    rerender(<ThemeSwitcher />)
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()

    // Test black theme (Moon icon)
    mockUseTheme.mockReturnValue({
      theme: THEMES.BLACK,
      setTheme: mockSetTheme,
      themeConfigs: THEME_CONFIGS,
    })
    
    rerender(<ThemeSwitcher />)
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })

  it('opens theme menu when button is clicked', async () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    await userEvent.click(button)
    
    expect(screen.getByText('Choose Theme')).toBeInTheDocument()
    expect(screen.getByText('Professional trading interface themes')).toBeInTheDocument()
  })

  it('displays all available themes in the menu', async () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    await userEvent.click(button)
    
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('Black')).toBeInTheDocument()
    
    expect(screen.getByText('Cream-colored professional theme')).toBeInTheDocument()
    expect(screen.getByText('Slate-950 professional theme')).toBeInTheDocument()
    expect(screen.getByText('Pure black professional theme')).toBeInTheDocument()
  })

  it('highlights the current active theme', async () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    await userEvent.click(button)
    
    const themeButtons = screen.getAllByRole('button')
    const darkThemeButton = themeButtons.find(btn => 
      btn.textContent?.includes('Dark') && btn.textContent?.includes('Slate-950')
    )
    
    expect(darkThemeButton).toHaveClass('bg-emerald-600', 'text-white')
  })

  it('changes theme when a theme option is clicked', async () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    await userEvent.click(button)
    
    const lightThemeButton = screen.getByText('Light').closest('button')
    await userEvent.click(lightThemeButton!)
    
    expect(mockSetTheme).toHaveBeenCalledWith(THEMES.LIGHT)
  })

  it('closes menu after selecting a theme', async () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    await userEvent.click(button)
    
    expect(screen.getByText('Choose Theme')).toBeInTheDocument()
    
    const lightThemeButton = screen.getByText('Light').closest('button')
    await userEvent.click(lightThemeButton!)
    
    await waitFor(() => {
      expect(screen.queryByText('Choose Theme')).not.toBeInTheDocument()
    })
  })

  it('closes menu when clicking outside (backdrop)', async () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    await userEvent.click(button)
    
    expect(screen.getByText('Choose Theme')).toBeInTheDocument()
    
    // Click on the backdrop
    const backdrop = document.querySelector('.fixed.inset-0')
    fireEvent.click(backdrop!)
    
    await waitFor(() => {
      expect(screen.queryByText('Choose Theme')).not.toBeInTheDocument()
    })
  })

  it('toggles menu visibility when button is clicked multiple times', async () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    
    // Open menu
    await userEvent.click(button)
    expect(screen.getByText('Choose Theme')).toBeInTheDocument()
    
    // Close menu
    await userEvent.click(button)
    await waitFor(() => {
      expect(screen.queryByText('Choose Theme')).not.toBeInTheDocument()
    })
    
    // Open menu again
    await userEvent.click(button)
    expect(screen.getByText('Choose Theme')).toBeInTheDocument()
  })

  it('displays theme preview colors', async () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    await userEvent.click(button)
    
    // Check if color preview circles are rendered
    const colorPreviews = document.querySelectorAll('[style*="backgroundColor"]')
    expect(colorPreviews.length).toBeGreaterThan(0)
    
    // Check specific colors for dark theme
    const darkThemeColors = Array.from(colorPreviews).filter(el => {
      const style = (el as HTMLElement).style.backgroundColor
      return style === 'rgb(2, 6, 23)' || // primary
             style === 'rgb(15, 23, 42)' || // secondary  
             style === 'rgb(16, 185, 129)' // accent
    })
    expect(darkThemeColors.length).toBeGreaterThan(0)
  })

  it('shows helpful footer text', async () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    await userEvent.click(button)
    
    expect(screen.getByText('Themes are automatically saved and applied across all modules')).toBeInTheDocument()
  })

  it('handles unknown theme gracefully', () => {
    mockUseTheme.mockReturnValue({
      theme: 'unknown-theme',
      setTheme: mockSetTheme,
      themeConfigs: THEME_CONFIGS,
    })
    
    render(<ThemeSwitcher />)
    
    // Should default to Monitor icon for unknown themes
    expect(screen.getByTestId('monitor-icon')).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    render(<ThemeSwitcher />)
    
    const button = screen.getByRole('button', { name: /switch theme/i })
    expect(button).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'px-3',
      'py-2',
      'text-sm',
      'font-medium',
      'text-slate-400',
      'hover:text-slate-200',
      'transition-colors',
      'rounded-lg',
      'hover:bg-slate-800/50'
    )
  })

  it('hides theme name on small screens', () => {
    render(<ThemeSwitcher />)
    
    const themeName = screen.getByText('Dark')
    expect(themeName).toHaveClass('hidden', 'sm:inline')
  })
})
