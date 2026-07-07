/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

describe('Page', () => {
  it('renders the guides section heading', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', { level: 2, name: 'Fun With Fermentation' })

    expect(heading).toBeInTheDocument()
  })

  it('links to each fermentation guide', () => {
    render(<Page />)

    expect(screen.getByRole('link', { name: /Milk Kefir/ })).toHaveAttribute('href', '/kefir')
    expect(screen.getByRole('link', { name: /Sourdough/ })).toHaveAttribute('href', '/sourdough')
    expect(screen.getByRole('link', { name: /Winemaking/ })).toHaveAttribute('href', '/winemaking')
  })
})
