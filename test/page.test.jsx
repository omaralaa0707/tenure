import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'

import Page from '../app/page'

const MAILTO = 'mailto:omarmorsi07@gmail.com?subject=Tenure%3A%20founding%20client'

describe('Page', () => {
  it('leads with one heading and the interview as the call to action', () => {
    render(<Page />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Meet your next hire.')
    expect(
      screen.getAllByRole('link', { name: /interview the candidate/i }).length,
    ).toBeGreaterThan(1)
  })

  it('anchors every nav link to a section that exists', () => {
    const { container } = render(<Page />)

    const hrefs = ['#how-it-works', '#pricing', '#faq', '#interview']
    for (const href of hrefs) {
      expect(container.querySelector(`a[href="${href}"]`)).not.toBeNull()
      expect(container.querySelector(`section${href}`)).not.toBeNull()
    }
  })

  it('embeds the interview panel with its blank offer letter', () => {
    render(<Page />)

    const offer = screen.getByRole('complementary', { name: /offer of employment/i })
    expect(within(offer).getByText('Employer')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /your reply to the candidate/i })).toBeEnabled()
  })

  it('lists the six employment steps in order', () => {
    render(<Page />)

    const steps = screen.getAllByRole('listitem').filter((li) => li.className.includes('timeline'))
    expect(steps).toHaveLength(6)
    expect(steps[0]).toHaveTextContent('The role is written down')
    expect(steps[5]).toHaveTextContent('It is reviewed every quarter')
  })

  it('answers the four questions, collapsed until opened', () => {
    const { container } = render(<Page />)

    const items = container.querySelectorAll('details.faq__item')
    expect(items).toHaveLength(4)
    for (const item of items) expect(item.open).toBe(false)
  })

  it('sends the only conversion path to Omar by mail', () => {
    const { container } = render(<Page />)

    expect(container.querySelectorAll(`a[href="${MAILTO}"]`).length).toBe(2)
    expect(container.querySelector('form[action]')).toBeNull()
  })

  it('states the guarantee and the disclosure it promises', () => {
    render(<Page />)

    expect(screen.getByText('90 days')).toBeInTheDocument()
    expect(screen.getAllByText(/Openly artificial/).length).toBeGreaterThan(0)
  })
})
