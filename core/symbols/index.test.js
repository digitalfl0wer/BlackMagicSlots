import { describe, it, expect } from 'vitest'
import { SYMBOLS, getTotalWeight, byId } from './index.js'

describe('symbols', () => {
  it('has at least 5 symbols', () => {
    expect(SYMBOLS.length).toBeGreaterThanOrEqual(5)
  })

  it('weights sum to a positive number', () => {
    expect(getTotalWeight()).toBeGreaterThan(0)
  })

  it('finds symbol by id', () => {
    expect(byId('afroPick')?.label).toBeDefined()
    expect(byId('missing')).toBeNull()
  })
})


