import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist', 'mcp');

// Find web-tree-sitter.wasm in node_modules (version-agnostic)
function findWasmFile() {
    const searchPaths = [
        path.join(ROOT_DIR, 'node_modules', 'web-tree-sitter', 'web-tree-sitter.wasm'),
        path.join(ROOT_DIR, 'node_modules', '.pnpm'),
    ];

    // Try direct path first
    if (fs.existsSync(searchPaths[0])) {
        return searchPaths[0];
    }

    // Search in .pnpm directory
    const pnpmDir = searchPaths[1];
    if (fs.existsSync(pnpmDir)) {
        const entries = fs.readdirSync(pnpmDir);
        for (const entry of entries) {
            if (entry.startsWith('web-tree-sitter@')) {
                const wasmPath = path.join(pnpmDir, entry, 'node_modules', 'web-tree-sitter', 'web-tree-sitter.wasm');
                if (fs.existsSync(wasmPath)) {
                    return wasmPath;
                }
            }
        }
    }

    throw new Error('Could not find web-tree-sitter.wasm in node_modules');
}

try {
    const sourcePath = findWasmFile();
    const targetPath = path.join(DIST_DIR, 'web-tree-sitter.wasm');

    // Ensure dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✓ Copied web-tree-sitter.wasm to ${targetPath}`);
} catch (error) {
    console.error('Error copying web-tree-sitter.wasm:', error);
    process.exit(1);
}
