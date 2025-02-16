export function defineStates (stateMachine, pattern, statePattern, materials) {
    pattern = pattern.replaceAll(' ', '')
    var symbol = pattern[4]
    const explicitRef = (sym) =>
        c => (c === symbol) ? sym : materials.includes(c) ? materials.indexOf(c) : c

    statePattern = statePattern.replaceAll(/./g, explicitRef(symbol))  // Explicit Create Ops
    var symbols = materials.matchAll(symbol).map(m => m.index).toArray()
        .map((v, i, arr) => [v, arr[i + 1] || 0])

    for (let [symbolIndex, nextSymbolIndex] of symbols) {
        let nextStates = getStates(statePattern, symbol, symbolIndex, nextSymbolIndex)

        var sig = pattern.replaceAll(/./g, explicitRef(symbolIndex))

        for (let pattern1 of replicaPatterns(sig, 'x', 0, materials.length)) {
            for (let pattern2 of replicaPatterns(pattern1, 'f', 1, materials.length)) {
                console.log(pattern2, nextStates)
                stateMachine.set(pattern2, nextStates)
            }
        }
    }
}

function getStates (nextState, symbol, symbolIndex, nextSymbolIndex) {
    // Step 1: Replace 'c' and '+', then explicit indices
    let base = nextState
        .replaceAll(' ', '')
        .replaceAll('c', symbolIndex) // Replica ops
        .replaceAll('+', nextSymbolIndex) // Swap & Inc ops
        .replaceAll(/./g, c => (c === symbol) ? symbolIndex : c)  // Explicit Create Ops

    // Step 2: Generate replica patterns for 's' (if any)
    return base.matchAll(/s/g).toArray().length > 1 ?
        pivotPattern(base, 's', 0, symbolIndex).toArray() :
        base.replace('s', symbolIndex)
}

/**
 *  Generates all possible patterns by replacing wildcards in the input pattern.
 *
 *  @param {string} parts  - A string with one type of wildcard (e.g., x0x).
 *  @param {string} symbol - The wildcard character to replace (e.g., x or f).
 *  @param {number} min - The starting value for replacements (e.g., 0 for air).
 *  @param {number} max - The ending value (exclusive) for replacements (e.g., 3 for air, sand, water).
 */
function* replicaPatterns (pattern , symbol, min, max/*not include*/) {
    const range = max - min; // Range of numbers to replace 'x'
    if (range === 1) return yield pattern.replaceAll(symbol, min)
    var parts  = pattern .split(symbol)
    if (parts.length === 1) return yield pattern
    const numWildcards  = parts .length - 1 // number of x in the pattern

    const totalIterations = Math.pow(range, numWildcards );
    // Loop through all possible combinations
    for (let i = 0; i < totalIterations; i++) {
        const digits = i.toString(range).padStart(numWildcards , '0').split('')
        yield digits.reduce((res, d, i) => res + (min + +d) + parts [i + 1], parts [0])
    }
}

function* pivotPattern (pattern, pivotChar, clearChar, symbol = pivotChar) {
    const basePattern = pattern.replaceAll(pivotChar, clearChar).split('')

    for (let m of pattern.matchAll(pivotChar)) {
        basePattern[m.index] = symbol
        yield basePattern.join('')
        basePattern[m.index] = clearChar
    }
}

// Test cases
function testGeneratePatterns3 (generatePatterns) {
    // Test case 1: Simple pattern with 2 'x' placeholders
    const pattern1 = "12x356x90";
    const expectedOutput1 = [
        "121356190", "121356290", "121356390", "121356490",
        "122356190", "122356290", "122356390", "122356490",
        "123356190", "123356290", "123356390", "123356490",
        "124356190", "124356290", "124356390", "124356490",
    ];
    for (let pattern of generatePatterns("12x356x90", 'x', 1, 5)) {
        let expected = expectedOutput1.shift()
        console.assert(pattern === expected, `Test case 1 failed. Expected: "${expected}" Actual:"${pattern}"`)
    }

    const expectedOutput2 = ["0", "1", "2"];
    for (let pattern of generatePatterns("x", 'x', 0, 3)) {
        let expected = expectedOutput2.shift()
        console.assert(pattern === expected, `Test case 2 failed. Expected: ${expected} Actual:"${pattern}"`)
    }
    const expectedOutput3 = ["12345"];
    for (let pattern of generatePatterns("12345", 'x', 1, 4)) {
        let expected = expectedOutput3.shift()
        console.assert(pattern === expected, `Test case 3 failed. Expected: ${expected} Actual:"${pattern}"`)
    }

    const expectedOutput4 = [
        "10101", "10102", "10201", "10202",
        "20101", "20102", "20201", "20202",
    ];
    for (let pattern of generatePatterns("x0x0x", 'x', 1, 3)) {
        let expected = expectedOutput4.shift()
        console.assert(pattern === expected, `Test case 4 failed. Expected: ${expected} Actual:"${pattern}"`)
    }

    const expectedOutput5 = ['10101'];
    for (let pattern of generatePatterns("t0t0t", 't', 1, 2)) {
        let expected = expectedOutput5.shift()
        console.assert(pattern === expected, `Test case 4 failed. Expected: ${expected} Actual:"${pattern}"`)
    }
    console.log("All generatePatterns test cases passed!");
}

function testedReplicaPattern () {
// Test case 1: Simple pattern with two '1's
    let expectedOutput1 = ['100', '001'];
    for (let pattern of pivotPattern('101', '1', '0')) {
        let expected = expectedOutput1.shift()
        console.assert(pattern === expected, `Test case 1 failed. Expected: ${expected} Actual: "${pattern}"`);
    }

// Test case 2: Pattern with multiple '1's
    let expectedOutput2 = ['12030', '02130', '02031']
    for (let pattern of pivotPattern('12131', '1', '0')) {
        let expected = expectedOutput2.shift()
        console.assert(pattern === expected, `Test case 2 failed. Expected: ${expected} Actual: "${pattern}"`);
    }

// Test case 3: Pattern with no '1's
    for (let pattern of pivotPattern('000', '1', '0')) {
        console.assert(false, `Test case 3 failed. Expected no output, but got: "${pattern}"`);
    }

// Test case 4: Pattern with all '1's
    let expectedOutput3 = ['100', '010', '001']
    for (let pattern of pivotPattern('111', '1', '0')) {
        let expected = expectedOutput3.shift()
        console.assert(pattern === expected, `Test case 4 failed. Expected: ${expected} Actual: "${pattern}"`);
    }

    console.log(`All ReplicaPattern test cases passed!`);
}

// Run the tests
testGeneratePatterns3(replicaPatterns);
testedReplicaPattern()
