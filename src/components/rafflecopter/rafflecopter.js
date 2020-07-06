import { useState, useEffect } from "react"

/**
 * @typedef Range
 * @property {number} index
 * @property {number} start
 * @property {number} end
 */
const Range = {
  id: 1,
  start: 1,
  end: 100,
}

/**
 * @property {Function} add
 * @property {Function} clear
 * @property {Range[]} ranges
 * @property {number[]} numbersCalled
 */
const RaffleCopter = {
  add: (start, end) => {},
  clear: () => {},
}

/**
 * Merge the ranges into a sequence of non-repeating numbers
 * @param {Range[]} ranges
 * @returns {number[]}
 */
function mergeRanges(ranges) {
  const lookup = new Set()
  ranges.forEach(r => {
    for (let i = r.start; i <= r.end; i++) {
      lookup.add(i)
    }
  })

  return Array.from(lookup.keys())
}

/**
 * Get a random number between 0 and max
 * @param {number} max The maximum number to return (inclusive)
 * @returns {number}
 */
function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

/**
 * @returns {RaffleCopter}
 */
const useRaffleCopter = () => {
  const [numbersCalled, setNumbersCalled] = useState([])
  const [ranges, setRanges] = useState([])
  const [merged, setMerged] = useState([])
  const [current, setCurrent] = useState()

  useEffect(() => {
    setMerged(mergeRanges(ranges))
  }, ranges)

  /**
   * Add a new range to the raffle
   * @param {number} start The inclusive first number in the range
   * @param {number} end The inclusive last number in the range
   */
  const add = (start, end) => {
    setRanges(r => [...r, { index: r.length + 1, start, end }])
  }

  /**
   * Restart the raffle and clear all the numbers drawn so far
   */
  const restart = () => {
    setNumbersCalled([])
    setCurrent(undefined)
  }

  /**
   * Clear the ranges from the raffle
   */
  const clear = () => {
    setRanges([])
    setNumbersCalled([])
  }

  /**
   * Draw a number that hasn't been drawn randomly from the list
   */
  const draw = () => {
    if (merged.length === 0) return
    if (numbersCalled.length === merged.length) return

    let nextIndex, nextNumber

    do {
      nextIndex = getRandom(merged.length - 1)
      nextNumber = merged[nextIndex]
    } while (numbersCalled.includes(nextNumber))

    setNumbersCalled(x => [...x, nextNumber])
    setCurrent(nextNumber)
  }

  return { add, clear, draw, restart, current, numbersCalled, ranges }
}

export { useRaffleCopter }
