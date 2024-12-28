const {
    get_1_or_0,
    get_random,
    runDistributionTest,
    runRangeTest
} = require('./randomGenerator');

describe('Random Number Generator Tests', () => {
    describe('get_1_or_0()', () => {
        test('should only return 0 or 1', () => {
            for (let i = 0; i < 1000; i++) {
                const result = get_1_or_0();
                expect([0, 1]).toContain(result);
            }
        });

        test('should have roughly equal distribution', () => {
            let zeros = 0;
            const iterations = 10000;
            
            for (let i = 0; i < iterations; i++) {
                zeros += get_1_or_0() === 0 ? 1 : 0;
            }
            
            const ratio = zeros / iterations;
            expect(ratio).toBeCloseTo(0.5, 1);
        });
    });

    describe('get_random()', () => {
        test('should handle edge cases', () => {
            expect(get_random(0)).toBe(0);
            expect(() => get_random(-1)).toThrow();
        });

        test('should return numbers within range', () => {
            const testCases = [1, 5, 10, 100, 1000];
            
            testCases.forEach(n => {
                const result = runRangeTest(n);
                expect(result.min).toBe(0);
                expect(result.max).toBe(n);
            });
        });

        test('should have reasonable distribution', () => {
            const testCases = [1, 5, 10, 100];
            
            testCases.forEach(n => {
                const result = runDistributionTest(n);
                // Check if mean is within 10% of expected
                const meanError = Math.abs(result.mean - result.expectedMean) / result.expectedMean;
                expect(meanError).toBeLessThan(0.1);
            });
        });

        test('should work with large numbers', () => {
            const n = 1000000;
            const samples = Array.from({ length: 100 }, () => get_random(n));
            
            samples.forEach(num => {
                expect(num).toBeGreaterThanOrEqual(0);
                expect(num).toBeLessThanOrEqual(n);
            });
        });
    });
});