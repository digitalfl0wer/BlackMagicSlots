import { describe, it, expect } from 'vitest'
import { buildReelStrip, buildStrips, spin } from './index.js'

describe('reels', () => {
  it('builds a reel strip of desired length', () => {
    const strip = buildReelStrip(30)
    expect(strip.length).toBe(30)
  })

  it('builds 5 strips by default', () => {
    const strips = buildStrips()
    expect(strips.length).toBe(5)
    expect(strips[0].length).toBeGreaterThan(10)
  })

  it('spins and returns a 5x3 grid by default', () => {
    const strips = buildStrips(5, 40)
    const grid = spin(strips, 3)
    expect(grid.length).toBe(5)
    for (const col of grid) {
      expect(col.length).toBe(3)
    }
  })
})


