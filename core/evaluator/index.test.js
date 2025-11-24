import { describe, it, expect } from 'vitest'
import { evaluate } from './index.js'

const LINES_MID = [
  [[1,0],[1,1],[1,2],[1,3],[1,4]],
]

describe('evaluator', () => {
  it('pays only for 3+ of a kind from left to right', () => {
    const a = 'afroPick'
    const grid = [
      ['x', 'y', 'z'],
      ['x', 'y', 'z'],
      ['x', 'y', 'z'],
      ['x', 'y', 'z'],
      ['x', 'y', 'z'],
    ]
    grid[0][1] = a
    grid[1][1] = a
    grid[2][1] = a
    const res = evaluate(grid, LINES_MID)
    expect(res.total).toBeGreaterThan(0)
    expect(res.results[0].count).toBe(3)
  })

  it('does not pay for only 2 of a kind', () => {
    const a = 'afroPick'
    const grid = [
      ['x', 'y', 'z'],
      ['x', 'y', 'z'],
      ['x', 'y', 'z'],
      ['x', 'y', 'z'],
      ['x', 'y', 'z'],
    ]
    grid[0][1] = a
    grid[1][1] = a
    const res = evaluate(grid, LINES_MID)
    expect(res.total).toBe(0)
    expect(res.results.length).toBe(0)
  })
})



