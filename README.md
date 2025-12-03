# MCP Auditor

A Model Context Protocol (MCP) server that provides structured code insights for estimation, security auditing, and report writing.

## Overview

MCP Auditor helps LLMs systematically analyze codebases through three main capabilities:

- **Estimation**: Calculate code complexity metrics and estimate audit effort
- **Auditing**: Map systems, identify security hotspots, and confirm vulnerabilities
- **Writing**: Generate professional audit reports in OpenZeppelin style

### Supported Languages

- **Solidity** (full support: entrypoints, call graphs, metrics)
- **C++** (entrypoints and metrics)
- **Java** (entrypoints and metrics)
- **Go** (entrypoints and metrics)
- **Rust** (entrypoints and metrics)

## Installation

To install this MCP server, run:

```bash
gemini extensions install <this repository URL>
```

To verify the installation, run:

```bash
gemini extensions list
```

To build the project locally, run:

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test
```

## Usage with Gemini CLI

This MCP server is designed to work as a Gemini CLI extension.

### Available Tools

| Tool | Inputs | Output | Purpose |
| :--- | :--- | :--- | :--- |
| `entrypoints` | `paths` (str[]) | `Entrypoint[]` | List public/external functions (attack surface). |
| `peek` | `paths` (str[]) | `Signature[]` | Extract function signatures for quick overview. |
| `metrics` | `paths` (str[]) | `Metrics[]` | Calculate NLoC, complexity, and effort estimates. |
| `callgraph` | `paths` (str[]) | `CallGraph` | Generate call graph (nodes/edges) for flow analysis. |

**Note:**

- `paths` allow for glob patterns.

### Command Workflows

The `commands/` directory contains TOML files with systematic prompts for:

**Estimation Workflow**:

- `/estimate:discovery` - Identify and chunk files
- `/estimate:explore` - Categorize files and determine scope
- `/estimate:metrics` - Calculate complexity and effort
- `/estimate:report` - Generate estimation report

**Audit Workflow**:

- `/audit:map` - Build system map (contracts, invariants, flows)
- `/audit:hunt` - Identify security hotspots
- `/audit:attack` - Confirm vulnerabilities

**Writing Workflow**:

- `/write:intro` - Generate report introduction
- `/write:issue` - Write formal issue descriptions

See `GEMINI.md` for detailed workflow instructions.

### Design Principles

- **Modular**: Clear separation between MCP protocol, engine, and language adapters
- **Extensible**: Easy to add new languages via `BaseAdapter` inheritance
- **DRY**: Common logic shared via `BaseAdapter` class
- **Tested**: Automated tests for all language adapters

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **AST Engine**: [`ast-grep`](https://github.com/ast-grep/ast-grep) for parsing and pattern matching
- **Output Format**: [TOON (Token-Oriented Object Notation)](https://github.com/toon-format/toon)
- **Protocol**: Model Context Protocol (MCP)
- **Testing**: Vitest

## Project Files

- **`GEMINI.md`** - AI assistant context guide for using workflows and tools
- **`gemini-extension.json`** - Gemini CLI extension configuration

## License

MIT
