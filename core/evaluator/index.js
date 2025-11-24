import { byId } from '../symbols/index.js'

const WIN_MULTIPLIER = 1.1

function payoutFor(symbolId, count){
  const s = byId(symbolId)
  if (!s) return 0
  const key = String(count)
  return s.payouts[key] || 0
}

export function evaluate(grid5x3, lines){
  // grid shape: [reelIndex 0..4][rowIndex 0..2]
  const results = []
  let total = 0
  for (let li = 0; li < lines.length; li++){
    const line = lines[li]
    const first = grid5x3[0][line[0][0]]
    if (!first) continue
    let count = 1
    for (let reel = 1; reel < 5; reel++){
      const [row] = line[reel]
      const sym = grid5x3[reel][row]
      if (sym === first){
        count++
      }else{
        break
      }
    }
    if (count >= 3){
      const amount = payoutFor(first, Math.min(count, 5))
      const boostedAmount = Math.round(amount * WIN_MULTIPLIER)
      if (boostedAmount > 0){
        total += boostedAmount
        results.push({ lineIndex: li, count, base: first, amount: boostedAmount })
      }
    }
  }
  return { total, results }
}







