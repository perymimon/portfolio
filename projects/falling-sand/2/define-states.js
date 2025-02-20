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

export default function defineStates (stateMachine, pattern, newState, symbols) {
    pattern = pattern.replaceAll(' ', '') // remove space as they not count
    var target = pattern[4] // now we can count and have access to main symbol. the one in the center
    var symIndex = symbols.indexOf(target)

    pattern = pattern.replaceAll(/./g, explicit(symbols)) // Explicit reference
    var base = newState.replaceAll(' ', '').replaceAll(/./g, explicit(symbols))

    // Step 2: Generate replica patterns for 's' (if any)
    var nextStates = base.matchAll(/s/g).toArray().length > 1 ?
        pivotPattern(base, 's', 0, symIndex).toArray() :
        base.replace('s', symIndex)

    for (let pattern1 of replicaPatterns(pattern, 'x', 0, symbols.length)) {
        for (let pattern2 of replicaPatterns(pattern1, 'f', 1, symbols.length)) {
            stateMachine.set(pattern2, nextStates)
        }
    }
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

    for (let m of pattern.matchAll(wild)) {
        yield basePattern.with(m.index, symbol).join('')
    }
}
