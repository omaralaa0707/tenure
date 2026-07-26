import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Interview from '../app/Interview'
import { OPENING } from '../app/opening'

// A response whose body streams the given chunks, one read at a time, so the
// component's reader loop runs the way it does against the route.
function streamed(chunks, { ok = true } = {}) {
  const encoder = new TextEncoder()
  let index = 0
  return {
    ok,
    body: {
      getReader: () => ({
        read: async () =>
          index < chunks.length
            ? { done: false, value: encoder.encode(chunks[index++]) }
            : { done: true, value: undefined },
      }),
    },
  }
}

const jsonError = (error) => ({ ok: false, body: null, json: async () => ({ error }) })

const composer = () => screen.getByRole('textbox', { name: /your reply to the candidate/i })
const sendButton = () => screen.getByRole('button', { name: /send|thinking/i })
const offer = () => screen.getByRole('complementary', { name: /offer of employment/i })

function offerValue(label) {
  const term = within(offer()).getByText(label)
  return term.nextElementSibling
}

let fetchMock

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Interview, before anything is said', () => {
  it('shows the opening turn with its markers stripped', () => {
    render(<Interview />)

    expect(screen.getByText(OPENING)).toBeInTheDocument()
  })

  it('starts with every offer line blank', () => {
    render(<Interview />)

    expect(offerValue('Employer')).toHaveTextContent('the firm')
    expect(offerValue('Employer')).toHaveAttribute('data-state', 'blank')
    expect(offerValue('Start date')).toHaveTextContent('on signature')
  })

  it('disables Send until there is something to send', async () => {
    render(<Interview />)

    expect(sendButton()).toBeDisabled()

    await userEvent.type(composer(), '   ')
    expect(sendButton()).toBeDisabled()

    await userEvent.type(composer(), 'Halden Recruiting.')
    expect(sendButton()).toBeEnabled()
  })
})

describe('Interview, sending a reply', () => {
  it('posts the transcript, streams the answer, and clears the composer', async () => {
    fetchMock.mockResolvedValue(streamed(['Noted. ', 'How many a week?']))
    render(<Interview />)

    await userEvent.type(composer(), '  Halden Recruiting.  ')
    await userEvent.click(sendButton())

    await waitFor(() => expect(screen.getByText('Noted. How many a week?')).toBeInTheDocument())
    expect(composer()).toHaveValue('')
    expect(screen.getByText('Halden Recruiting.')).toBeInTheDocument()

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/interview')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({
      turns: [{ role: 'user', content: 'Halden Recruiting.' }],
    })
  })

  it('sends the raw reply, markers and all, back as history', async () => {
    fetchMock
      .mockResolvedValueOnce(streamed(['Noted.\n::field firm=Halden']))
      .mockResolvedValueOnce(streamed(['Understood.']))
    render(<Interview />)

    await userEvent.type(composer(), 'Halden Recruiting.')
    await userEvent.click(sendButton())
    await waitFor(() => expect(screen.getByText('Noted.')).toBeInTheDocument())

    await userEvent.type(composer(), 'Forty a week.')
    await userEvent.click(sendButton())
    await waitFor(() => expect(screen.getByText('Understood.')).toBeInTheDocument())

    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
      turns: [
        { role: 'user', content: 'Halden Recruiting.' },
        { role: 'assistant', content: 'Noted.\n::field firm=Halden' },
        { role: 'user', content: 'Forty a week.' },
      ],
    })
  })

  it('sends on Enter and leaves a newline on Shift+Enter', async () => {
    fetchMock.mockResolvedValue(streamed(['Noted.']))
    render(<Interview />)

    await userEvent.type(composer(), 'One line.{Shift>}{Enter}{/Shift}')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(composer()).toHaveValue('One line.\n')

    await userEvent.type(composer(), '{Enter}')
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).turns[0].content).toBe('One line.')
  })

  it('ignores an empty send', async () => {
    render(<Interview />)

    await userEvent.type(composer(), '   {Enter}')

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('locks the composer while the candidate is answering', async () => {
    let release
    fetchMock.mockReturnValue(new Promise((resolve) => (release = resolve)))
    render(<Interview />)

    await userEvent.type(composer(), 'Halden Recruiting.{Enter}')

    await waitFor(() => expect(composer()).toBeDisabled())
    expect(screen.getByRole('button', { name: 'Thinking' })).toBeDisabled()

    release(streamed(['Noted.']))
    await waitFor(() => expect(composer()).toBeEnabled())
  })
})

describe('Interview, filling in the offer', () => {
  it('writes marker values into the letter and hides them from the transcript', async () => {
    fetchMock.mockResolvedValue(
      streamed([
        'Noted, forty a week.\n',
        '::field firm=Halden Recruiting Group\n::field volume=40 a week',
      ]),
    )
    render(<Interview />)

    await userEvent.type(composer(), 'Halden Recruiting, forty a week.{Enter}')

    await waitFor(() =>
      expect(offerValue('Employer')).toHaveTextContent('Halden Recruiting Group'),
    )
    expect(offerValue('Employer')).toHaveAttribute('data-state', 'filled')
    expect(offerValue('Inquiry volume')).toHaveTextContent('40 a week')
    expect(offerValue('Coverage')).toHaveTextContent('regions served')
    expect(screen.getByText('Noted, forty a week.')).toBeInTheDocument()
    expect(screen.queryByText(/::field/)).not.toBeInTheDocument()
  })

  it('keeps earlier values and overwrites the ones that are said again', async () => {
    fetchMock
      .mockResolvedValueOnce(streamed(['One.\n::field firm=Halden\n::field coverage=US']))
      .mockResolvedValueOnce(streamed(['Two.\n::field coverage=US and Canada']))
    render(<Interview />)

    await userEvent.type(composer(), 'First.{Enter}')
    await waitFor(() => expect(offerValue('Employer')).toHaveTextContent('Halden'))

    await userEvent.type(composer(), 'Second.{Enter}')
    await waitFor(() => expect(offerValue('Coverage')).toHaveTextContent('US and Canada'))
    expect(offerValue('Employer')).toHaveTextContent('Halden')
  })
})

describe('Interview, when the interview is unavailable', () => {
  it('shows the reason the route gives', async () => {
    fetchMock.mockResolvedValue(jsonError('The interview is not connected yet.'))
    render(<Interview />)

    await userEvent.type(composer(), 'Halden Recruiting.{Enter}')

    const notice = await screen.findByRole('status')
    expect(notice).toHaveTextContent('The interview is not connected yet.')
    expect(composer()).toBeEnabled()
  })

  it('falls back to its own wording when the route says nothing useful', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      body: null,
      json: async () => {
        throw new Error('not json')
      },
    })
    render(<Interview />)

    await userEvent.type(composer(), 'Halden Recruiting.{Enter}')

    expect(await screen.findByRole('status')).toHaveTextContent(
      'The interview is unavailable right now.',
    )
  })

  it('asks for the message again when the connection drops', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    render(<Interview />)

    await userEvent.type(composer(), 'Halden Recruiting.{Enter}')

    expect(await screen.findByRole('status')).toHaveTextContent(
      'The connection dropped. Send that again.',
    )
  })

  it('stays quiet when the request is aborted', async () => {
    const aborted = new Error('aborted')
    aborted.name = 'AbortError'
    fetchMock.mockRejectedValue(aborted)
    render(<Interview />)

    await userEvent.type(composer(), 'Halden Recruiting.{Enter}')

    await waitFor(() => expect(composer()).toBeEnabled())
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('clears an earlier notice on the next attempt', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonError('Try again shortly.'))
      .mockResolvedValueOnce(streamed(['Noted.']))
    render(<Interview />)

    await userEvent.type(composer(), 'First.{Enter}')
    await screen.findByRole('status')

    await userEvent.type(composer(), 'Second.{Enter}')
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  })

  it('aborts the request in flight when it unmounts', async () => {
    const abort = vi.spyOn(AbortController.prototype, 'abort')
    let release
    fetchMock.mockReturnValue(new Promise((resolve) => (release = resolve)))
    const { unmount } = render(<Interview />)

    await userEvent.type(composer(), 'Halden Recruiting.{Enter}')
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    unmount()

    expect(abort).toHaveBeenCalled()
    release(streamed([]))
  })
})
