import { describe, it, expect } from 'vitest';
import { CppAdapter } from '../../src/languages/cppAdapter.js';
import { JavaAdapter } from '../../src/languages/javaAdapter.js';
import { GoAdapter } from '../../src/languages/goAdapter.js';
import { RustAdapter } from '../../src/languages/rustAdapter.js';
import { SolidityAdapter } from '../../src/languages/solidityAdapter.js';
import { FileContent } from '../../src/engine/types.js';

describe('Language Metrics', () => {
    describe('CppAdapter', () => {
        const adapter = new CppAdapter();

        it('should calculate metrics correctly', async () => {
            const file: FileContent = {
                path: 'test.cpp',
                content: `
                    #include <iostream>
                    
                    // This is a comment
                    void main() {
                        if (true) {
                            std::cout << "Hello";
                        }
                    }
                `
            };
            const metrics = await adapter.calculateMetrics([file]);
            expect(metrics[0].nloc).toBeGreaterThan(0);
            expect(metrics[0].linesWithComments).toBe(1);
            expect(metrics[0].cognitiveComplexity).toBeGreaterThan(0);
        });
    });

    describe('JavaAdapter', () => {
        const adapter = new JavaAdapter();

        it('should calculate metrics correctly', async () => {
            const file: FileContent = {
                path: 'Test.java',
                content: `
                    public class Test {
                        /* Block comment */
                        public void main() {
                            for (int i=0; i<10; i++) {
                                System.out.println(i);
                            }
                        }
                    }
                `
            };
            const metrics = await adapter.calculateMetrics([file]);
            expect(metrics[0].nloc).toBeGreaterThan(0);
            expect(metrics[0].linesWithComments).toBe(1);
            expect(metrics[0].cognitiveComplexity).toBeGreaterThan(0);
        });
    });

    describe('GoAdapter', () => {
        const adapter = new GoAdapter();

        it('should calculate metrics correctly', async () => {
            const file: FileContent = {
                path: 'main.go',
                content: `
                    package main
                    import "fmt"

                    // Comment
                    func main() {
                        if true {
                            fmt.Println("Hello")
                        }
                    }
                `
            };
            const metrics = await adapter.calculateMetrics([file]);
            expect(metrics[0].nloc).toBeGreaterThan(0);
            expect(metrics[0].linesWithComments).toBe(1);
            expect(metrics[0].cognitiveComplexity).toBeGreaterThan(0);
        });
    });

    describe('RustAdapter', () => {
        const adapter = new RustAdapter();

        it('should calculate metrics correctly', async () => {
            const file: FileContent = {
                path: 'main.rs',
                content: `
                    fn main() {
                        // Comment
                        if true {
                            println!("Hello");
                        }
                    }
                `
            };
            const metrics = await adapter.calculateMetrics([file]);
            expect(metrics[0].nloc).toBeGreaterThan(0);
            expect(metrics[0].linesWithComments).toBe(1);
            expect(metrics[0].cognitiveComplexity).toBeGreaterThan(0);
        });
    });

    describe('SolidityAdapter', () => {
        const adapter = new SolidityAdapter();

        it('should calculate metrics correctly', async () => {
            const file: FileContent = {
                path: 'Contract.sol',
                content: `
                    contract C {
                        // Comment
                        function foo() {
                            if (true) {
                                revert();
                            }
                        }
                    }
                `
            };
            const metrics = await adapter.calculateMetrics([file]);
            expect(metrics[0].nloc).toBeGreaterThan(0);
            expect(metrics[0].linesWithComments).toBe(1);
            expect(metrics[0].cognitiveComplexity).toBeGreaterThan(0);
        });
    });
});
