import { describe, it, expect } from 'vitest'
import { LINES_9, LINES_20, LINES_25, getLinesForCount, isValidLine } from './index.js'

describe('paylines', () => {
  it('contains 9 lines of 5 coordinates', () => {
    expect(LINES_9.length).toBe(9)
    for (const line of LINES_9) {
      expect(isValidLine(line)).toBe(true)
    }
  })

  it('exposes 20 and 25 line sets and mapping helper', () => {
    expect(LINES_20.length).toBe(20)
    expect(LINES_25.length).toBe(25)
    expect(getLinesForCount(20)).toBe(LINES_20)
    expect(getLinesForCount(25)).toBe(LINES_25)
    expect(getLinesForCount(1)).toHaveLength(1)
    expect(getLinesForCount(99)).toBe(LINES_9)
  })

  it('each coordinate has valid rows and cols within 3x5', () => {
    for (const line of LINES_9) {
      for (const [r, c] of line) {
        expect(r).toBeGreaterThanOrEqual(0)
        expect(r).toBeLessThan(3)
        expect(c).toBeGreaterThanOrEqual(0)
        expect(c).toBeLessThan(5)
      }
    }
  })
})


