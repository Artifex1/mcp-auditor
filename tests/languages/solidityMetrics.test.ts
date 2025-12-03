import { describe, it, expect } from 'vitest';
import { SolidityAdapter } from '../../src/languages/solidityAdapter.js';

describe('SolidityAdapter Metrics', () => {
    it('should extract signatures from Solidity code', async () => {
        const adapter = new SolidityAdapter();
        const content = `
            pragma solidity ^0.8.0;
            
            contract Test {
                function foo() external {}
                function bar(uint a) public returns (uint) { return a; }
            }
        `;

        const signaturesByFile = await adapter.extractSignatures([{ path: 'Test.sol', content }]);
        const allSignatures = Object.values(signaturesByFile).flat();
        expect(allSignatures.length).toBeGreaterThan(0);
        expect(allSignatures.some(s => s.includes('foo()'))).toBe(true);
        expect(allSignatures.some(s => s.includes('bar'))).toBe(true);
    });

    it('should calculate metrics for Solidity code', async () => {
        const adapter = new SolidityAdapter();
        const content = `
            contract Complex {
                function test(uint n) public {
                    if (n > 0) {
                        for (uint i = 0; i < n; i++) {
                            // comment
                        }
                    }
                }
            }
        `;

        const metrics = await adapter.calculateMetrics([{ path: 'Complex.sol', content }]);
        expect(metrics).toHaveLength(1);
        expect(metrics[0].nloc).toBeGreaterThan(0);
        expect(metrics[0].cognitiveComplexity).toBe(3); // 1 (if at level 0) + 2 (for at level 1) = 3
    });
});
