import { describe, it, expect } from 'vitest'
import { createBankroll } from './index.js'

describe('bankroll', () => {
  it('sets lines and bet/line within allowed values', () => {
    const b = createBankroll(100)
    b.setLines(9)
    b.setBetPerLine(5)
    expect(b.lines).toBe(9)
    expect(b.betPerLine).toBe(5)
  })

  it('places a bet and reduces balance', () => {
    const b = createBankroll(100)
    b.setLines(1)
    b.setBetPerLine(20)
    const wager = b.placeBet()
    expect(wager).toBe(20)
    expect(b.balance).toBe(80)
  })

  it('prevents betting over balance', () => {
    const b = createBankroll(10)
    b.setLines(9)
    b.setBetPerLine(2)
    expect(() => b.placeBet()).toThrow()
  })

  it('payout increases balance', () => {
    const b = createBankroll(50)
    b.payout(25)
    expect(b.balance).toBe(75)
  })
})



