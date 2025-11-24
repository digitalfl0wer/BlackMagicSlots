export function createBankroll(initialBalance = 1000){
  if (!Number.isFinite(initialBalance) || initialBalance < 0) throw new Error('bad balance')
  let balance = Math.floor(initialBalance)
  let lines = 1
  let betPerLine = 1

  function totalBet(){ return lines * betPerLine }
  function canBet(){ return balance >= totalBet() }

  return {
    get balance(){ return balance },
    get lines(){ return lines },
    get betPerLine(){ return betPerLine },
    get totalBet(){ return totalBet() },
    setLines(n){
      if (![1,9,20,25].includes(n)) throw new Error('invalid lines')
      lines = n
      return lines
    },
    setBetPerLine(n){
      if (![1,2,5,10,20,50,100].includes(n)) throw new Error('invalid bet')
      betPerLine = n
      return betPerLine
    },
    canBet,
    placeBet(){
      const t = totalBet()
      if (balance < t) throw new Error('insufficient balance')
      balance -= t
      return t
    },
    payout(amount){
      if (!Number.isFinite(amount) || amount < 0) throw new Error('bad payout')
      balance += Math.floor(amount)
      return balance
    },
  }
}



