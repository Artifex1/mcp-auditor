export enum SupportedLanguage {
    Solidity = "solidity",
    Cpp = "cpp",
    Java = "java",
    Go = "go",
    Rust = "rust",
    // Future languages:
    // TypeScript = "typescript",
    // JavaScript = "javascript",
}

export interface Entrypoint {
    file: string;
    contract: string;
    name: string;
    signature: string;
    visibility: string;
    location: {
        line: number;
        column: number;
    };
}



export interface FileContent {
    path: string;
    content: string;
}

export interface GraphNode {
    id: string; // Fully qualified signature (e.g., "MyContract.myFunc(uint256)")
    label: string; // Human readable name
    file: string;
    contract?: string;
    visibility?: 'public' | 'external' | 'internal' | 'private';
    range: { start: { line: number, column: number }, end: { line: number, column: number } };
}

export interface GraphEdge {
    from: string; // node id
    to: string; // node id
}

export interface CallGraph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export interface FileMetrics {
    file: string;
    nloc: number;
    linesWithComments: number;
    commentDensity: number;
    cognitiveComplexity: number;
    estimatedHours: number;
}
