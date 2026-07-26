'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { OPENING } from './opening'

const FIELDS = [
  { key: 'firm', label: 'Employer', blank: 'the firm' },
  { key: 'practice', label: 'Handles', blank: 'what they handle' },
  { key: 'coverage', label: 'Coverage', blank: 'regions served' },
  { key: 'volume', label: 'Inquiry volume', blank: 'per week' },
  { key: 'response', label: 'Answered now in', blank: 'current speed' },
  { key: 'start', label: 'Start date', blank: 'on signature' },
]

const FIELD_LINE = /^::field\s+([a-z]+)\s*=\s*(.+)$/gim

// The model appends `::field key=value` lines for the offer letter. Strip them
// from what the owner reads, and read them for the letter.
function readFields(raw) {
  const found = {}
  for (const match of raw.matchAll(FIELD_LINE)) {
    const value = match[2].trim()
    if (value) found[match[1].toLowerCase()] = value
  }
  return found
}

function stripFields(raw) {
  return raw
    .replace(FIELD_LINE, '')
    .replace(/::field[\s\S]*$/i, '') // a half-streamed marker
    .replace(/—/g, ', ') // house style forbids the em dash; degrade gracefully if one slips through
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ {2,}/g, ' ')
    .trimEnd()
}

export default function Interview() {
  const [turns, setTurns] = useState([])
  const [streaming, setStreaming] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [draft, setDraft] = useState('')

  const transcriptRef = useRef(null)
  const abortRef = useRef(null)

  const offer = useMemo(() => {
    const all = [OPENING, ...turns.filter((t) => t.role === 'assistant').map((t) => t.raw ?? '')]
    return all.reduce((acc, text) => ({ ...acc, ...readFields(text) }), {})
  }, [turns])

  useEffect(() => {
    const el = transcriptRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turns, streaming])

  useEffect(() => () => abortRef.current?.abort(), [])

  const send = useCallback(
    async (text) => {
      const message = text.trim()
      if (!message || busy) return

      const next = [...turns, { role: 'user', content: message }]
      setTurns(next)
      setDraft('')
      setNotice('')
      setBusy(true)
      setStreaming('')

      const controller = new AbortController()
      abortRef.current = controller

      // Nothing answered the turn, so take it back out of the transcript and put
      // it back in the box: an unanswered turn would otherwise sit there looking
      // sent, and be replayed to the model on the next send.
      const rollback = () => {
        setTurns((prev) =>
          prev.length && prev[prev.length - 1].role === 'user' ? prev.slice(0, -1) : prev,
        )
        setDraft((current) => current || message)
      }

      try {
        const response = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            turns: next.map(({ role, content, raw }) => ({
              role,
              content: role === 'assistant' ? (raw ?? content) : content,
            })),
          }),
          signal: controller.signal,
        })

        if (!response.ok || !response.body) {
          let data = null
          try {
            data = await response.json()
          } catch (error) {
            console.error('interview error response unreadable', response.status, error)
          }
          setNotice(data?.error ?? 'The interview is unavailable right now.')
          rollback()
          return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let raw = ''

        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          raw += decoder.decode(value, { stream: true })
          setStreaming(stripFields(raw))
        }
        raw += decoder.decode()

        const visible = stripFields(raw)
        // An empty reply would go back to the server as an empty turn, which it
        // rejects: the interview would be stuck for good. Drop it and say so.
        if (!visible) {
          console.error('interview returned an empty reply')
          setNotice('The candidate did not answer. Send that again.')
          rollback()
          return
        }
        setTurns((prev) => [...prev, { role: 'assistant', content: visible, raw }])
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('interview request failed', error)
          setNotice('The connection dropped. Send that again.')
          rollback()
        }
      } finally {
        setStreaming('')
        setBusy(false)
        abortRef.current = null
      }
    },
    [busy, turns],
  )

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send(draft)
    }
  }

  return (
    <div className="hiring">
      <section className="interview" aria-label="Interview with the candidate">
        <header className="interview__head">
          <p className="interview__who">
            Intake Coordinator
            <span className="interview__role">Candidate · Tenure</span>
          </p>
          <span className="pill">Openly artificial</span>
        </header>

        <div className="transcript" ref={transcriptRef} aria-live="polite" aria-atomic="false">
          <article className="turn turn--candidate">
            <p className="turn__who">Intake Coordinator</p>
            <p className="turn__text">{stripFields(OPENING)}</p>
          </article>

          {turns.map((turn, index) => (
            <article
              key={index}
              className={`turn ${turn.role === 'user' ? 'turn--visitor' : 'turn--candidate'}`}
            >
              <p className="turn__who">{turn.role === 'user' ? 'You' : 'Intake Coordinator'}</p>
              <p className="turn__text">{turn.content}</p>
            </article>
          ))}

          {/* Hidden from assistive tech while streaming; the completed turn
              announces once instead of on every token. */}
          {busy && (
            <article className="turn turn--candidate" aria-hidden="true">
              <p className="turn__who">Intake Coordinator</p>
              <p className="turn__text caret">{streaming}</p>
            </article>
          )}

          {notice && (
            <article className="turn turn--notice" role="status">
              <p className="turn__text">{notice}</p>
            </article>
          )}
        </div>

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault()
            send(draft)
          }}
        >
          <label className="u-visually-hidden" htmlFor="reply">
            Your reply to the candidate
          </label>
          <textarea
            id="reply"
            className="composer__input"
            rows={1}
            value={draft}
            placeholder="Tell it about your firm…"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
          />
          <button className="composer__send" type="submit" disabled={busy || !draft.trim()}>
            {busy ? 'Thinking' : 'Send'}
          </button>
        </form>
      </section>

      <aside className="offer" aria-label="Offer of employment, filled in as you talk">
        <p className="offer__kicker">Offer of employment</p>
        <p className="offer__body">
          This fills itself in as the interview goes. Nothing here is written by hand.
        </p>

        <dl className="offer__list">
          {FIELDS.map(({ key, label, blank }) => {
            const value = offer[key]
            return (
              <div className="offer__row" key={key}>
                <dt className="offer__key">{label}</dt>
                <dd className="offer__value" data-state={value ? 'filled' : 'blank'}>
                  {value ?? blank}
                </dd>
              </div>
            )
          })}
        </dl>

        <p className="offer__sign">
          Position: Intake Coordinator (AI). Reports to the founder. Ninety-day
          replacement guarantee applies.
        </p>
      </aside>
    </div>
  )
}
