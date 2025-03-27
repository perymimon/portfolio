import {randomItem} from '../../../src/math/math.js'

export class StateMachine {
    constructor () {
        this.masks = new Set()
        this.machine = new Map()
        this.symbols = ''
        this.matrials = {}
    }

    defineStates (pattern, newState) {
        defineStates(this.machine, this.masks, pattern, newState, this.symbols)
    }
    defineMaterial(symbol,name,color){
        this.symbols += symbol
        this.matrials[symbol] = {name,color}
    }
    getNewState (state) {
        for (let mask of this.masks) {
            let masked = maskedPattern(state, mask)
            var newState = this.machine.get(masked)
            if (newState) break
        }
        if (Array.isArray(newState)) return randomItem(newState)
        return newState
    }
    getColors (symbolIndex) {
        let s = this.symbols[symbolIndex]
        return this.matrials[s]?.color
    }
}


/*
vocabulary:
- “ “(space) =  are just visual and will remove before processing
- s = “swap” (if multiple possible s in the pattern , pick one)
- x = Any material (air, sand , water, etc.), or not-care
- f = Not Air material (sand, water, etc. )
- A S W (Capitals) =  as explicit index on the symbol string
- 0 no change to that cell
*/
const explicit = (symbols) =>
    (c) => symbols.includes(c) ? symbols.indexOf(c) : c

const getMask = (pattern) =>
    pattern.replaceAll(/[^x]/g, (_, i) => i) //"ff0xSxxxx" -> "012x4xxxx"

export const maskedPattern = (string, mask) =>
    mask.replaceAll(/[^x]/g, (_, i) => string[i] ?? _)

export default function defineStates (stateMachine, masks, pattern, nextState, symbols) {
    if (!Array.isArray(nextState)) nextState = [nextState] // < explicit multiple options for next
    pattern = pattern.replaceAll(' ', '')
    var target = pattern[4]
    var symIndexes = symbols.matchAll(target).map((m, i) => [i, m.index])

    masks.add(getMask(pattern)) // < Convert all x to mask
    for (let [i, symIndex] of symIndexes) {
        var patternBase = pattern
            .replaceAll(target, symIndex)
            .replaceAll(/./g, explicit(symbols))

        for (let pattern2 of replicaPatterns(patternBase, 'f', 1, symbols.length)) {
            let states = nextState.map(state =>
                getStates(state, symIndex, symIndexes[i + 1] ?? 0, pattern2, symbols),
            ).flat(Infinity)

            if (states.length === 1) states = states[0]
            stateMachine.set(pattern2, states)
        }
    }
}

function getStates (statePattern, currentIndex, nextIndex, pattern, symbols) {
    let normPattern = statePattern
        .replaceAll(' ', '') // clear spaces
        .replaceAll(/./g, explicit(symbols)) // replace explicit Material with init Material index
        .replaceAll('+', nextIndex) // replace + with the next index

    return pivotPattern(normPattern, 's', 0) //split pattern around the 'swap' operator but save the 's' because we use it and index for swap
        .map(state => swapWiring(state, 's', pattern, 4).replace('s', currentIndex))
        .toArray()

}

function swapWiring (pattern, fromMask, source, toIndex) {
    if (!pattern.includes(fromMask)) return pattern
    let i = pattern.indexOf(fromMask)
    let norm = pattern.padEnd(toIndex, '0')
    return norm.slice(0, toIndex) + source[i] + norm.slice(toIndex + 1)
}

function* replicaPatterns (pattern, wild, min, max) {
    const range = max - min; // the `base` of numbers to replace 'symbol'
    if (range === 1) return yield pattern.replaceAll(wild, String(min))

    var parts = pattern.split(wild) // Split the pattern between the symbols
    // If no wildcards are present, yield the pattern as-is
    if (parts.length === 1) return yield pattern

    const numWildcards = parts.length - 1   // Number of wildcards in the pattern
    const totalIterations = Math.pow(range, numWildcards) // Total combinations to generate

    // Loop through all possible combinations
    for (let i = 0; i < totalIterations; i++) {
        const digits = i.toString(range).padStart(numWildcards, '0').split('')
        yield digits.reduce((res, d, i) => res + (min + +d) + parts[i + 1], parts[0])
    }
}

function* pivotPattern (pattern, wild, clearSymbol, symbol = wild) {
    const basePattern = pattern.replaceAll(wild, clearSymbol).split('')

    if (!pattern.includes(wild)) return yield pattern

    for (let m of pattern.matchAll(wild)) {
        yield basePattern.with(m.index, symbol).join('')
    }
}
