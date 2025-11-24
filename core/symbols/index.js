export const SYMBOLS = [
  { id: 'afroPick', label: 'Afro Pick', weight: 8, payouts: { '3': 10, '4': 25, '5': 100 } },
  { id: 'anhk', label: 'Ankh', weight: 7, payouts: { '3': 12, '4': 35, '5': 120 } },
  { id: 'evilEye', label: 'Evil Eye', weight: 7, payouts: { '3': 14, '4': 40, '5': 140 } },
  { id: 'goldHoopEarrings', label: 'Gold Hoops', weight: 6, payouts: { '3': 16, '4': 45, '5': 160 } },
  { id: 'goldGrillz', label: 'Gold Grillz', weight: 3, payouts: { '3': 40, '4': 120, '5': 400 } },
  { id: 'hotSauce', label: 'Hot Sauce', weight: 6, payouts: { '3': 18, '4': 50, '5': 180 } },
  { id: 'lavaLamp', label: 'Lava Lamp', weight: 5, payouts: { '3': 20, '4': 60, '5': 200 } },
  { id: 'musicRecord', label: 'Record', weight: 5, payouts: { '3': 25, '4': 75, '5': 250 } },
  { id: 'sweetPotatoPie', label: 'Sweet Potato Pie', weight: 4, payouts: { '3': 30, '4': 90, '5': 300 } },
]

export function getTotalWeight(){
  return SYMBOLS.reduce((sum, s) => sum + s.weight, 0)
}

export function byId(id){
  return SYMBOLS.find(s => s.id === id) || null
}


