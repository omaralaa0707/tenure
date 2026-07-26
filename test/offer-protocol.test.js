import { describe, expect, it } from 'vitest'

import { FIELDS, readFields, stripFields } from '../app/Interview'
import { OPENING } from '../app/opening'

describe('readFields', () => {
  it('reads a single marker at the end of a reply', () => {
    expect(readFields('Good to know.\n::field firm=Cardenas & Ruiz LLP')).toEqual({
      firm: 'Cardenas & Ruiz LLP',
    })
  })

  it('reads several markers across the reply', () => {
    const raw = [
      'Understood.',
      '::field firm=Halden Recruiting Group',
      '::field coverage=US and Canada',
      '::field volume=40 a week',
    ].join('\n')

    expect(readFields(raw)).toEqual({
      firm: 'Halden Recruiting Group',
      coverage: 'US and Canada',
      volume: '40 a week',
    })
  })

  it('tolerates whitespace around the key and the equals sign', () => {
    expect(readFields('::field   start   =    Next Monday   ')).toEqual({ start: 'Next Monday' })
  })

  it('lowercases the key', () => {
    expect(readFields('::field FIRM=Halden')).toEqual({ firm: 'Halden' })
  })

  it('keeps the last value when a key repeats', () => {
    expect(readFields('::field firm=First\n::field firm=Second')).toEqual({ firm: 'Second' })
  })

  it('ignores a marker with an empty value', () => {
    expect(readFields('Noted.\n::field firm=   ')).toEqual({})
  })

  // Known rough edge: `\s*` around the equals sign spans newlines, so a marker
  // left blank takes the next line as its value. The letter shows something odd
  // rather than nothing; it does not throw.
  it('lets a blank value swallow the following line', () => {
    expect(readFields('::field firm=\n::field practice=Immigration')).toEqual({
      firm: '::field practice=Immigration',
    })
  })

  it('ignores markers that are not at the start of a line', () => {
    expect(readFields('I noted it. ::field firm=Halden')).toEqual({})
  })

  it('returns nothing for prose with no markers', () => {
    expect(readFields('Two sentences, no markers.')).toEqual({})
    expect(readFields('')).toEqual({})
  })

  it('is not affected by the shared regex across calls', () => {
    const raw = '::field firm=Halden'
    expect(readFields(raw)).toEqual({ firm: 'Halden' })
    expect(readFields(raw)).toEqual({ firm: 'Halden' })
  })

  it('finds no markers in the opening line', () => {
    expect(readFields(OPENING)).toEqual({})
  })
})

describe('stripFields', () => {
  it('removes complete markers from what the owner reads', () => {
    expect(stripFields('Noted.\n::field firm=Halden')).toBe('Noted.')
  })

  it('removes every marker when several are appended', () => {
    const raw = 'Noted.\n::field firm=Halden\n::field coverage=US and Canada'
    expect(stripFields(raw)).toBe('Noted.')
  })

  it('removes a half-streamed marker', () => {
    expect(stripFields('Noted.\n::field fir')).toBe('Noted.')
  })

  it('removes everything from a half-streamed marker onward', () => {
    expect(stripFields('Noted.\n::field fir=')).toBe('Noted.')
    expect(stripFields('Noted.\n::fie')).toBe('Noted.\n::fie')
  })

  it('degrades an em dash to a comma', () => {
    expect(stripFields('Speed matters—a lot.')).toBe('Speed matters, a lot.')
  })

  it('collapses runs of blank lines left behind by stripping', () => {
    expect(stripFields('One.\n\n\n\nTwo.')).toBe('One.\n\nTwo.')
  })

  it('collapses runs of spaces', () => {
    expect(stripFields('One.    Two.')).toBe('One. Two.')
  })

  it('trims only the end, preserving leading text', () => {
    expect(stripFields('Noted.\n\n')).toBe('Noted.')
  })

  it('leaves prose without markers alone', () => {
    expect(stripFields('Two sentences, no markers.')).toBe('Two sentences, no markers.')
  })

  it('returns an empty string when the reply is only a marker', () => {
    expect(stripFields('::field firm=Halden')).toBe('')
  })

  it('leaves the opening line intact', () => {
    expect(stripFields(OPENING)).toBe(OPENING)
  })
})

describe('FIELDS', () => {
  it('lists the six offer keys the system prompt allows, once each', () => {
    expect(FIELDS.map((field) => field.key)).toEqual([
      'firm',
      'practice',
      'coverage',
      'volume',
      'response',
      'start',
    ])
  })

  it('gives every field a label and a blank placeholder', () => {
    for (const field of FIELDS) {
      expect(field.label).toBeTruthy()
      expect(field.blank).toBeTruthy()
    }
  })
})
