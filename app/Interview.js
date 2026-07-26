'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Turn from './components/Turn'
import { OPENING } from './opening'
import { collectResults, resultRows, stripFields } from './results'

const CANDIDATE = 'Intake Coordinator'

export default function Interview() {
  const [turns, setTurns] = useState([])
  const [streaming, setStreaming] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [draft, setDraft] = useState('')

  const transcriptRef = useRef(null)
  const abortRef = useRef(null)

  const results = useMemo(
    () =>
      collectResults([
        OPENING,
        ...turns.filter((t) => t.role === 'assistant').map((t) => t.raw ?? ''),
      ]),
    [turns],
  )

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
          const data = await response.json().catch(() => null)
          setNotice(data?.error ?? 'The interview is unavailable right now.')
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

        const visible = stripFields(raw)
        setTurns((prev) => [...prev, { role: 'assistant', content: visible, raw }])
        setStreaming('')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setNotice('The connection dropped. Send that again.')
        }
      } finally {
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
    <>
      <section className="interview" aria-label="Watch it handle a real inquiry">
        <header className="interview__head">
          <p className="interview__who">
            {CANDIDATE}
            <span className="interview__role">AI employee · Tenure</span>
          </p>
        </header>

        <div className="transcript" ref={transcriptRef} aria-live="polite" aria-atomic="false">
          <Turn who={CANDIDATE} text={stripFields(OPENING)} />

          {turns.map((turn, index) => (
            <Turn
              key={index}
              variant={turn.role === 'user' ? 'visitor' : 'candidate'}
              who={turn.role === 'user' ? 'You' : CANDIDATE}
              text={turn.content}
            />
          ))}

          {/* Hidden from assistive tech while streaming; the completed turn
              announces once instead of on every token. */}
          {busy && (
            <Turn who={CANDIDATE} text={streaming} textClassName="caret" aria-hidden="true" />
          )}

          {notice && <Turn variant="notice" text={notice} role="status" />}
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

      <aside className="results" aria-label="Live results, filled in as you talk">
        <p className="results__kicker">Live results</p>
        <p className="results__body">
          This fills in as the conversation happens. Nothing here is written by hand.
        </p>

        <dl className="results__list">
          {resultRows(results).map(({ key, label, value, state }) => (
            <div className="results__row" key={key}>
              <dt className="results__key">{label}</dt>
              <dd className="results__value" data-state={state}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="u-sm u-muted">
          Managed by a named person at Tenure. Ninety-day guarantee applies.
        </p>
      </aside>
    </>
  )
}
