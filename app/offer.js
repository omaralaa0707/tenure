// The offer-letter protocol, in one place. The model appends
// `::field key=value` lines; the client reads them into the letter and strips
// them from the transcript; the system prompt lists the same keys. All three
// read from OFFER_FIELDS so they cannot drift apart.

export const OFFER_FIELDS = [
  { key: 'firm', label: 'Employer', blank: 'the firm', prompt: "the firm's name" },
  {
    key: 'practice',
    label: 'Handles',
    blank: 'what they handle',
    prompt: 'the kind of client work they do',
  },
  {
    key: 'coverage',
    label: 'Coverage',
    blank: 'regions served',
    prompt: 'the regions or markets they serve',
  },
  { key: 'volume', label: 'Inquiry volume', blank: 'per week', prompt: 'inquiries per week' },
  {
    key: 'response',
    label: 'Answered now in',
    blank: 'current speed',
    prompt: 'how fast they answer now',
  },
  { key: 'start', label: 'Start date', blank: 'on signature', prompt: 'a proposed start date' },
]

// For the system prompt: `firm (the firm's name), practice (...), ...`
export const OFFER_KEY_SPEC = OFFER_FIELDS.map(({ key, prompt }) => `${key} (${prompt})`).join(', ')

const FIELD_LINE = /^::field\s+([a-z]+)\s*=\s*(.+)$/gim

export function readFields(raw) {
  const found = {}
  for (const match of raw.matchAll(FIELD_LINE)) {
    const value = match[2].trim()
    if (value) found[match[1].toLowerCase()] = value
  }
  return found
}

export function stripFields(raw) {
  return raw
    .replace(FIELD_LINE, '')
    .replace(/::field[\s\S]*$/i, '') // a half-streamed marker
    .replace(/—/g, ', ') // house style forbids the em dash; degrade gracefully if one slips through
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ {2,}/g, ' ')
    .trimEnd()
}

// The letter is the accumulation of every field the candidate has recorded.
export function collectOffer(texts) {
  return texts.reduce((acc, text) => ({ ...acc, ...readFields(text) }), {})
}

export function offerRows(offer) {
  return OFFER_FIELDS.map(({ key, label, blank }) => ({
    key,
    label,
    value: offer[key] ?? blank,
    state: offer[key] ? 'filled' : 'blank',
  }))
}
