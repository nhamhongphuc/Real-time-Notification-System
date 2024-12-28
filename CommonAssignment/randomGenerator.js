// Step 1: Function that randomly returns 1 or 0
function get_1_or_0() {
    return Math.random() < 0.5 ? 0 : 1;
}

// Step 2: Function to get random number between 0 and n using only get_1_or_0
function get_random(n) {
    if (n < 0) throw new Error("n must be a positive integer");
    if (n === 0) return 0;
    
    // Calculate number of bits needed to represent n
    const bitsNeeded = Math.floor(Math.log2(n)) + 1;
    
    while (true) {
        let result = 0;
        // Build random number bit by bit
        for (let i = 0; i < bitsNeeded; i++) {
            result = (result << 1) | get_1_or_0();
        }
        // If result is within range, return it
        if (result <= n) {
            return result;
        }
        // Otherwise, try again
    }
}

// Step 3: Test functions
function runDistributionTest(n, iterations = 10000) {
    const counts = new Array(n + 1).fill(0);
    
    for (let i = 0; i < iterations; i++) {
        const num = get_random(n);
        counts[num]++;
    }
    
    return {
        distribution: counts,
        mean: counts.reduce((acc, val, idx) => acc + idx * val, 0) / iterations,
        expectedMean: n / 2,
        variance: counts.reduce((acc, val, idx) => acc + Math.pow(idx - (n/2), 2) * val, 0) / iterations
    };
}

function runRangeTest(n, iterations = 1000) {
    let min = n;
    let max = 0;
    
    for (let i = 0; i < iterations; i++) {
        const num = get_random(n);
        min = Math.min(min, num);
        max = Math.max(max, num);
    }
    
    return { min, max, expectedMin: 0, expectedMax: n };
}

// Export functions for use in tests
module.exports = {
    get_1_or_0,
    get_random,
    runDistributionTest,
    runRangeTest
};