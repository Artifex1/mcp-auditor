import { SupportedLanguage, Entrypoint, FileContent, CallGraph, FileMetrics } from "./types.js";
import { resolveFiles, readFiles } from "./fileUtils.js";
import path from "path";
import { CppAdapter } from "../languages/cppAdapter.js";
import { JavaAdapter } from "../languages/javaAdapter.js";
import { GoAdapter } from "../languages/goAdapter.js";
import { RustAdapter } from "../languages/rustAdapter.js";

export * from "./types.js";

export interface LanguageAdapter {
    languageId: SupportedLanguage;
    extractEntrypoints(files: FileContent[]): Promise<Entrypoint[]>;
    generateCallGraph(files: FileContent[]): Promise<CallGraph>;
    extractSignatures(files: FileContent[]): Promise<Record<string, string[]>>;
    calculateMetrics(files: FileContent[]): Promise<FileMetrics[]>;
}

export class Engine {
    private adapters: Map<SupportedLanguage, LanguageAdapter> = new Map();

    registerAdapter(adapter: LanguageAdapter) {
        this.adapters.set(adapter.languageId, adapter);
    }

    constructor() {
        this.registerAdapter(new CppAdapter());
        this.registerAdapter(new JavaAdapter());
        this.registerAdapter(new GoAdapter());
        this.registerAdapter(new RustAdapter());
    }

    getAdapter(languageId: SupportedLanguage): LanguageAdapter | undefined {
        return this.adapters.get(languageId);
    }

    detectLanguage(filePath: string): SupportedLanguage | undefined {
        const ext = path.extname(filePath).toLowerCase();
        switch (ext) {
            case ".sol":
                return SupportedLanguage.Solidity;
            case ".cpp":
            case ".hpp":
            case ".cc":
            case ".cxx":
            case ".c":
            case ".h":
                return SupportedLanguage.Cpp;
            case ".java":
                return SupportedLanguage.Java;
            case ".go":
                return SupportedLanguage.Go;
            case ".rs":
                return SupportedLanguage.Rust;
            default:
                return undefined;
        }
    }

    async processEntrypoints(patterns: string[]): Promise<Entrypoint[]> {
        const filePaths = await resolveFiles(patterns);
        const files = await readFiles(filePaths);

        // Group files by language
        const filesByLanguage = this.groupFilesByLanguage(files);

        const allEntrypoints: Entrypoint[] = [];

        // Dispatch to adapters
        for (const [lang, langFiles] of filesByLanguage.entries()) {
            const adapter = this.getAdapter(lang);
            if (adapter) {
                const entrypoints = await adapter.extractEntrypoints(langFiles);
                allEntrypoints.push(...entrypoints);
            } else {
                console.warn(`No adapter found for language: ${lang}`);
            }
        }

        return allEntrypoints;
    }

    async processSignatures(patterns: string[]): Promise<Record<string, string[]>> {
        const filePaths = await resolveFiles(patterns);
        const files = await readFiles(filePaths);
        const filesByLanguage = this.groupFilesByLanguage(files);
        const allSignatures: Record<string, string[]> = {};

        for (const [lang, langFiles] of filesByLanguage.entries()) {
            const adapter = this.getAdapter(lang);
            if (adapter) {
                const signatures = await adapter.extractSignatures(langFiles);
                Object.assign(allSignatures, signatures);
            }
        }
        return allSignatures;
    }

    async processMetrics(patterns: string[]): Promise<FileMetrics[]> {
        const filePaths = await resolveFiles(patterns);
        const files = await readFiles(filePaths);
        const filesByLanguage = this.groupFilesByLanguage(files);
        const allMetrics: FileMetrics[] = [];

        for (const [lang, langFiles] of filesByLanguage.entries()) {
            const adapter = this.getAdapter(lang);
            if (adapter) {
                const metrics = await adapter.calculateMetrics(langFiles);
                allMetrics.push(...metrics);
            }
        }
        return allMetrics;
    }

    async processCallGraph(patterns: string[]): Promise<CallGraph> {
        const filePaths = await resolveFiles(patterns);
        const files = await readFiles(filePaths);
        const filesByLanguage = this.groupFilesByLanguage(files);

        const combinedGraph: CallGraph = { nodes: [], edges: [] };

        for (const [lang, langFiles] of filesByLanguage.entries()) {
            const adapter = this.getAdapter(lang);
            if (adapter) {
                const graph = await adapter.generateCallGraph(langFiles);
                combinedGraph.nodes.push(...graph.nodes);
                combinedGraph.edges.push(...graph.edges);
            }
        }
        return combinedGraph;
    }

    private groupFilesByLanguage(files: FileContent[]): Map<SupportedLanguage, FileContent[]> {
        const filesByLanguage = new Map<SupportedLanguage, FileContent[]>();
        for (const file of files) {
            const lang = this.detectLanguage(file.path);
            if (lang) {
                if (!filesByLanguage.has(lang)) {
                    filesByLanguage.set(lang, []);
                }
                filesByLanguage.get(lang)!.push(file);
            }
        }
        return filesByLanguage;
    }
}
