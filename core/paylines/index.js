/**
 * A coordinate is [row, col] with 0-based indices for a 3-row, 5-reel grid
 * @typedef {[number, number]} Coord
 */

/** @type {Coord[][]} */
export const LINES_9 = [
  // 1: middle row
  [[1,0],[1,1],[1,2],[1,3],[1,4]],
  // 2: top row
  [[0,0],[0,1],[0,2],[0,3],[0,4]],
  // 3: bottom row
  [[2,0],[2,1],[2,2],[2,3],[2,4]],
  // 4: V shape
  [[0,0],[1,1],[2,2],[1,3],[0,4]],
  // 5: inverted V
  [[2,0],[1,1],[0,2],[1,3],[2,4]],
  // 6: top-down staircase
  [[0,0],[1,1],[1,2],[1,3],[0,4]],
  // 7: bottom-up staircase
  [[2,0],[1,1],[1,2],[1,3],[2,4]],
  // 8: diagonal TL→BR
  [[0,0],[1,1],[2,2],[2,3],[2,4]],
  // 9: diagonal BL→TR
  [[2,0],[1,1],[0,2],[0,3],[0,4]],
]

export const LINES_1 = [
  [[1,0],[1,1],[1,2],[1,3],[1,4]],
]

export const LINES_20 = [
  ...LINES_9,
  [[0,0],[1,1],[0,2],[1,3],[0,4]],
  [[2,0],[1,1],[2,2],[1,3],[2,4]],
  [[0,0],[0,1],[1,2],[0,3],[0,4]],
  [[2,0],[2,1],[1,2],[2,3],[2,4]],
  [[0,0],[1,1],[2,2],[1,3],[1,4]],
  [[2,0],[1,1],[0,2],[1,3],[1,4]],
  [[1,0],[0,1],[1,2],[0,3],[1,4]],
  [[1,0],[2,1],[1,2],[2,3],[1,4]],
  [[0,0],[0,1],[0,2],[1,3],[2,4]],
  [[2,0],[2,1],[2,2],[1,3],[0,4]],
  [[1,0],[1,1],[2,2],[2,3],[2,4]],
]

export const LINES_25 = [
  ...LINES_20,
  [[0,0],[1,1],[0,2],[0,3],[0,4]],
  [[2,0],[1,1],[2,2],[2,3],[2,4]],
  [[0,0],[0,1],[1,2],[2,3],[2,4]],
  [[2,0],[2,1],[1,2],[0,3],[0,4]],
  [[1,0],[0,1],[1,2],[2,3],[1,4]],
]

const PAYLINES_BY_COUNT = {
  1: LINES_1,
  9: LINES_9,
  20: LINES_20,
  25: LINES_25,
}

export function getLinesForCount(count) {
  return PAYLINES_BY_COUNT[count] || LINES_9
}

export function isValidLine(line){
  return Array.isArray(line) && line.length === 5 && line.every(c => Array.isArray(c) && c.length === 2)
}


