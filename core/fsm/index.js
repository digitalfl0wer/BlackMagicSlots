import { createBankroll } from '../bankroll/index.js'
import { buildStrips, spin } from '../reels/index.js'
import { getLinesForCount } from '../paylines/index.js'
import { evaluate } from '../evaluator/index.js'

export function createFSM({ initialBalance = 1000, lines = 1, betPerLine = 1 } = {}){
  const bankroll = createBankroll(initialBalance)
  bankroll.setLines(lines)
  bankroll.setBetPerLine(betPerLine)

  let state = 'IDLE'
  const strips = buildStrips(5, 40)
  let lastGrid = null
  let lastEval = null

  function setBet({ lines: l, betPerLine: b }){
    if (state !== 'IDLE' && state !== 'BET') throw new Error('bad state')
    state = 'BET'
    if (l) bankroll.setLines(l)
    if (b) bankroll.setBetPerLine(b)
    return { lines: bankroll.lines, betPerLine: bankroll.betPerLine }
  }

  function spinOnce(){
    if (state !== 'BET' && state !== 'IDLE') throw new Error('bad state')
    if (!bankroll.canBet()) throw new Error('insufficient balance')
    bankroll.placeBet()
    state = 'SPINNING'
    lastGrid = spin(strips, 3)
    state = 'EVAL'
    const lineSet = getLinesForCount(bankroll.lines)
    lastEval = evaluate(lastGrid, lineSet)
    state = 'PAYOUT'
    bankroll.payout(lastEval.total)
    state = 'IDLE'
    return { grid: lastGrid, result: lastEval, balance: bankroll.balance }
  }

  return {
    get state(){ return state },
    get balance(){ return bankroll.balance },
    get lines(){ return bankroll.lines },
    get betPerLine(){ return bankroll.betPerLine },
    setBet,
    spinOnce,
  }
}



