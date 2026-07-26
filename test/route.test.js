// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Anthropic from '@anthropic-ai/sdk'
import { OPENING } from '../app/opening'
import { POST } from '../app/api/interview/route'

const stream = vi.fn()

vi.mock('@anthropic-ai/sdk', () => {
  class RateLimitError extends Error {}
  class AuthenticationError extends Error {}
  class MockAnthropic {
    constructor() {
      this.messages = { stream }
    }
  }
  MockAnthropic.RateLimitError = RateLimitError
  MockAnthropic.AuthenticationError = AuthenticationError
  return { default: MockAnthropic }
})

// A stand-in for the SDK's stream: async-iterable, with finalMessage and abort.
function fakeStream({ events = [], final = { stop_reason: 'end_turn' }, throwAt = null } = {}) {
  return {
    abort: vi.fn(),
    finalMessage: vi.fn(async () => final),
    async *[Symbol.asyncIterator]() {
      for (const [index, event] of events.entries()) {
        if (throwAt === index) throw new Error('socket closed')
        yield event
      }
      if (throwAt === events.length) throw new Error('socket closed')
    },
  }
}

const textDelta = (text) => ({
  type: 'content_block_delta',
  delta: { type: 'text_delta', text },
})

function post(body) {
  return new Request('http://localhost/api/interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

async function readAll(response) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let out = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    out += decoder.decode(value, { stream: true })
  }
  return out
}

beforeEach(() => {
  process.env.ANTHROPIC_API_KEY = 'test-key'
  stream.mockReset()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
  delete process.env.ANTHROPIC_API_KEY
})

describe('POST /api/interview without a key', () => {
  it('explains that the interview is not connected', async () => {
    delete process.env.ANTHROPIC_API_KEY

    const response = await POST(post({ turns: [] }))

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error:
        'The interview is not connected yet. Add ANTHROPIC_API_KEY to .env.local and restart the server.',
    })
    expect(stream).not.toHaveBeenCalled()
  })
})

describe('POST /api/interview payload validation', () => {
  it('rejects a body that is not JSON', async () => {
    const response = await POST(post('not json'))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Could not read that request.' })
  })

  it.each([
    ['a missing turns list', {}],
    ['turns that are not an array', { turns: 'nope' }],
    ['a null turns list', { turns: null }],
  ])('rejects %s', async (_label, body) => {
    const response = await POST(post(body))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Expected a list of turns.' })
  })

  it('rejects an interview that has run past the turn cap', async () => {
    const turns = Array.from({ length: 41 }, () => ({ role: 'user', content: 'Hello.' }))

    const response = await POST(post({ turns }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'This interview has run long. Reload the page to start a new one.',
    })
  })

  it('accepts an interview exactly at the turn cap', async () => {
    stream.mockReturnValue(fakeStream({ events: [textDelta('Noted.')] }))
    const turns = Array.from({ length: 40 }, () => ({ role: 'user', content: 'Hello.' }))

    const response = await POST(post({ turns }))

    expect(response.status).toBe(200)
    await expect(readAll(response)).resolves.toBe('Noted.')
  })

  it.each([
    ['an unknown role', { role: 'system', content: 'Hello.' }],
    ['a missing role', { content: 'Hello.' }],
    ['a null turn', null],
  ])('rejects %s', async (_label, turn) => {
    const response = await POST(post({ turns: [turn] }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Unrecognized turn.' })
  })

  it.each([
    ['an empty message', ''],
    ['a whitespace-only message', '   \n  '],
    ['a non-string message', 42],
  ])('rejects %s', async (_label, content) => {
    const response = await POST(post({ turns: [{ role: 'user', content }] }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Turns cannot be empty.' })
  })

  it('rejects a message past the character cap', async () => {
    const response = await POST(post({ turns: [{ role: 'user', content: 'a'.repeat(4001) }] }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'That message is too long.' })
  })

  it('accepts a message exactly at the character cap', async () => {
    stream.mockReturnValue(fakeStream())

    const response = await POST(post({ turns: [{ role: 'user', content: 'a'.repeat(4000) }] }))

    expect(response.status).toBe(200)
  })

  it('rejects the whole request when one turn of many is bad', async () => {
    const response = await POST(
      post({
        turns: [
          { role: 'user', content: 'Halden Recruiting.' },
          { role: 'assistant', content: 'Noted.' },
          { role: 'user', content: '' },
        ],
      }),
    )

    expect(response.status).toBe(400)
    expect(stream).not.toHaveBeenCalled()
  })
})

describe('POST /api/interview transcript sent to the model', () => {
  it('replays the opening as the first assistant turn, after a user turn', async () => {
    stream.mockReturnValue(fakeStream())

    await POST(post({ turns: [{ role: 'user', content: '  Halden Recruiting.  ' }] }))

    const { messages, model, system, max_tokens, output_config } = stream.mock.calls[0][0]
    expect(messages).toEqual([
      { role: 'user', content: 'Begin the interview.' },
      { role: 'assistant', content: OPENING },
      { role: 'user', content: 'Halden Recruiting.' },
    ])
    expect(model).toBe('claude-opus-5')
    expect(max_tokens).toBe(2000)
    expect(output_config).toEqual({ effort: 'low' })
    expect(system).toContain('Intake Coordinator')
  })

  it('forwards nothing but role and content, dropping client-only keys', async () => {
    stream.mockReturnValue(fakeStream())

    await POST(
      post({
        turns: [
          { role: 'user', content: 'Halden Recruiting.' },
          { role: 'assistant', content: 'Noted.', raw: 'Noted.\n::field firm=Halden', extra: 1 },
        ],
      }),
    )

    expect(stream.mock.calls[0][0].messages.slice(2)).toEqual([
      { role: 'user', content: 'Halden Recruiting.' },
      { role: 'assistant', content: 'Noted.' },
    ])
  })
})

describe('POST /api/interview streaming response', () => {
  it('streams text deltas as plain text with no caching', async () => {
    stream.mockReturnValue(
      fakeStream({ events: [textDelta('Noted. '), textDelta('Two questions.')] }),
    )

    const response = await POST(post({ turns: [{ role: 'user', content: 'Halden.' }] }))

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8')
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(response.headers.get('X-Accel-Buffering')).toBe('no')
    await expect(readAll(response)).resolves.toBe('Noted. Two questions.')
  })

  it('ignores events that are not text deltas', async () => {
    stream.mockReturnValue(
      fakeStream({
        events: [
          { type: 'message_start' },
          { type: 'content_block_delta', delta: { type: 'thinking_delta', thinking: 'hmm' } },
          { type: 'content_block_delta', delta: { type: 'text_delta', text: '' } },
          { type: 'content_block_delta' },
          textDelta('Noted.'),
          { type: 'message_stop' },
        ],
      }),
    )

    const response = await POST(post({ turns: [{ role: 'user', content: 'Halden.' }] }))

    await expect(readAll(response)).resolves.toBe('Noted.')
  })

  it('appends a recovery line when the model refuses', async () => {
    stream.mockReturnValue(
      fakeStream({ events: [textDelta('Noted.')], final: { stop_reason: 'refusal' } }),
    )

    const response = await POST(post({ turns: [{ role: 'user', content: 'Halden.' }] }))

    await expect(readAll(response)).resolves.toBe(
      'Noted.\n\nI am not able to answer that one. Ask me about intake and I will pick back up.',
    )
  })

  it('keeps what it streamed and explains when the stream breaks mid-sentence', async () => {
    stream.mockReturnValue(fakeStream({ events: [textDelta('Noted.')], throwAt: 1 }))

    const response = await POST(post({ turns: [{ role: 'user', content: 'Halden.' }] }))

    await expect(readAll(response)).resolves.toBe(
      'Noted.\n\nThe connection dropped mid-sentence. Send that again.',
    )
    expect(console.error).toHaveBeenCalledWith('interview stream failed', expect.any(Error))
  })

  it('aborts the upstream stream when the reader cancels', async () => {
    const upstream = fakeStream({ events: [textDelta('Noted.')] })
    stream.mockReturnValue(upstream)

    const response = await POST(post({ turns: [{ role: 'user', content: 'Halden.' }] }))
    await response.body.cancel()

    expect(upstream.abort).toHaveBeenCalled()
  })
})

describe('POST /api/interview upstream failures', () => {
  it.each([
    ['rate limits', () => new Anthropic.RateLimitError('slow down'), 429, 'The candidate is handling another interview. Try again shortly.'],
    ['a rejected key', () => new Anthropic.AuthenticationError('bad key'), 503, 'The API key was rejected. Check ANTHROPIC_API_KEY.'],
    ['anything else', () => new Error('boom'), 502, 'The interview could not start. Try again.'],
  ])('reports %s', async (_label, makeError, status, error) => {
    stream.mockImplementation(() => {
      throw makeError()
    })

    const response = await POST(post({ turns: [{ role: 'user', content: 'Halden.' }] }))

    expect(response.status).toBe(status)
    await expect(response.json()).resolves.toEqual({ error })
    expect(console.error).toHaveBeenCalledWith('interview request failed', expect.any(Error))
  })
})
