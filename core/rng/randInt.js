export function randInt(maxExclusive){
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error('maxExclusive must be a positive integer')
  }
  const cryptoObj = globalThis.crypto || (globalThis.window && window.crypto)
  if (!cryptoObj || !cryptoObj.getRandomValues) {
    // Fallback: not crypto-safe
    return Math.floor(Math.random() * maxExclusive)
  }
  const range = maxExclusive
  const maxUint32 = 0xffffffff
  const limit = Math.floor((maxUint32 + 1) / range) * range - 1
  const buf = new Uint32Array(1)
  let x
  do {
    cryptoObj.getRandomValues(buf)
    x = buf[0]
  } while (x > limit)
  return x % range
}


