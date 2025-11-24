import { describe, it, expect } from 'vitest'
import { randInt } from './randInt.js'

describe('randInt', () => {
  it('throws on invalid input', () => {
    expect(() => randInt(0)).toThrow()
    expect(() => randInt(-1)).toThrow()
    // @ts-expect-error
    expect(() => randInt('a')).toThrow()
  })

  it('returns values within range', () => {
    for (let i = 0; i < 1000; i++) {
      const r = randInt(5)
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThan(5)
    }
  })
})


