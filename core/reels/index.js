import { SYMBOLS, getTotalWeight } from '../symbols/index.js'
import { randInt } from '../rng/randInt.js'

export function buildReelStrip(length = 40) {
  if (!Number.isInteger(length) || length < 10) throw new Error('length must be >= 10')
  const total = getTotalWeight()
  const cumulative = []
  let acc = 0
  for (const s of SYMBOLS) {
    acc += s.weight / total
    cumulative.push({ id: s.id, p: acc })
  }
  const strip = []
  for (let i = 0; i < length; i++) {
    const r = (randInt(10000) + 1) / 10000 // (0,1]
    const sym = cumulative.find(x => r <= x.p) || cumulative[cumulative.length - 1]
    strip.push(sym.id)
  }
  return strip
}

export function buildStrips(count = 5, length = 40) {
  return Array.from({ length: count }, () => buildReelStrip(length))
}

export function spin(strips, visible = 3) {
  if (!Array.isArray(strips) || strips.length === 0) throw new Error('strips required')
  const result = []
  for (const strip of strips) {
    const start = randInt(strip.length)
    const window = []
    for (let i = 0; i < visible; i++) {
      window.push(strip[(start + i) % strip.length])
    }
    result.push(window)
  }
  return result // shape: [reelIndex][rowIndex]
}

